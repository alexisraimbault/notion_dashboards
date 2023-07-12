import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';

import NotionDatabases from '@/components/NotionDatabases'
import MyDashboards from '@/components/MyDashboards'
import TopBar from '@/components/TopBar';

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()

  const [loading, setLoading] = useState(false)
  const [notionIntegrations, setNotionIntegrations] = useState([])
  const [tab, setTab] = useState('graphs')
  const [displayModal, setDisplayModal] = useState(false)

  const onLogout = async () => {
    supabase.auth.signOut();
  }

  const onCreateGraph = () => setDisplayModal(true)

  const tabRenderer = {
    graphs: () => <MyDashboards />,
    account: () => (
      <>
        <Button label="Change Notion Integration" onClick={onLinkNotionAccount} />
      </>
    ),
    create: () => (
      <>
        <NotionDatabases/>
      </>
    )
  }

  const onLinkNotionAccount = () => {
    window.location.replace(`https://api.notion.com/v1/oauth/authorize?owner=user&client_id=e1ec6c09-bbde-449f-a5e1-d9e8a4aa582d&redirect_uri=${process.env.NEXT_PUBLIC_NOTION_REDIRECT}&response_type=code`);
  }

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
        .order('id', { ascending: true })
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
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const renderCreateGreaph = () => {

    return (
      <Dialog header="Select a database" visible={displayModal} style={{ width: '600px' }} onHide={() => setDisplayModal(false)}>
        <div className="homepage__popup-content">
          <NotionDatabases/>
        </div>
      </Dialog>
    )
  }

  return (
    <div className='homepage__wrapper'>
      {session && (
        <TopBar 
          setTabFunction={setTab}
          logoutFunction={onLogout} 
          createGraphFunction={onCreateGraph}
        />
      )}
      <div className="homepage__container" >
        {!loading && (
          <>
            {!session ? (
              <Auth 
                supabaseClient={supabase} 
                appearance={{ theme: ThemeSupa }} 
                theme="light"
                providers={[]}
              />
            ) : (
              <div>
                {tabRenderer[tab]()}
                {/* {notionIntegrations?.length === undefined || notionIntegrations?.length === null || notionIntegrations?.length <= 0 && 
                  <Button label="Link Notion account" onClick={onLinkNotionAccount} />
                }
                {notionIntegrations?.length !== undefined && notionIntegrations?.length !== null && notionIntegrations?.length > 0 && (
                  <>
                    <MyDashboards />
                    <NotionDatabases />
                    <Button label="Change Notion Integration" onClick={onLinkNotionAccount} />
                  </>
                )} */}
              </div>
            )}
          </>
        ) }
        {loading && <ProgressSpinner />}
      </div>
      {renderCreateGreaph()}
    </div>
  )
}

export default Home