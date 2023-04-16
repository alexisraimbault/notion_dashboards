import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'

import NotionDatabases from '@/components/NotionDatabases'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()

  const [loading, setLoading] = useState(true)
  const [notionIntegrations, setNotionIntegrations] = useState([])

  useEffect(() => {
    if(user !== null && user.id !== null && user.id.length > 0) {
      getProfile()
    }
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('NOTION_INTEGRATIONS')
        .select('id, notion_token, notion_data, created_at')
        .eq('id_user', user.id)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setNotionIntegrations(data)
      }

    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const renderNotionInfos = () => {
    return notionIntegrations.map(notionIntegration => (
      <div key={`int-${notionIntegration.id}`}>
        {notionIntegration.notion_token}
      </div>
    ))
  }

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? (
        <Auth 
          supabaseClient={supabase} 
          appearance={{ theme: ThemeSupa }} 
          theme="light"
          providers={[]}
        />
      ) : (
        <div>
          {/* {renderNotionInfos()} */}
          {notionIntegrations?.length === undefined || notionIntegrations?.length === null || notionIntegrations?.length <= 0 && 
            <a href="https://api.notion.com/v1/oauth/authorize?owner=user&client_id=e1ec6c09-bbde-449f-a5e1-d9e8a4aa582d&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotioncallback&response_type=code">{`Add a notion integration`}</a>
          }
          {notionIntegrations?.length !== undefined && notionIntegrations?.length !== null & notionIntegrations?.length > 0 && 
            <NotionDatabases />
          }
        </div>
      )}
    </div>
  )
}

export default Home