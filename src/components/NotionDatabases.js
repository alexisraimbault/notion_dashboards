import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { InputText } from 'primereact/inputtext';

const NotionDatabases = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()
  const [notionDatabases, setNotionDatabases] = useState([])
  const [queryText, setQueryText] = useState('')

  useEffect(() => {
    console.log({queryText})
    if(user !== null && user.id !== null && user.id.length > 0) {
      getNotionDbs()
    }
  }, [session, queryText])

  const onFilterType = e => setQueryText(e.target.value)

  const getNotionDbs = async () => {
    let { data, error, status } = await supabase
      .from('NOTION_INTEGRATIONS')
      .select('id, notion_token, notion_data, created_at')
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      return
    }

    const notion_token = data[0].notion_token
      
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/dashboardList`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, queryText})
    })

    const response = await res.json()
    console.log({response})

    if(response?.status === 401 && response?.message === "API token is invalid.") {
      console.log('DELETING ...')
      const { error } = await supabase
      .from('NOTION_INTEGRATIONS')
      .delete()
      .eq('id_user', user.id)
      console.log({error})
    }
  
    setNotionDatabases(response?.results || [])
  }

  const onDatabaseClick = databaseId => () => {
    push(`${process.env.NEXT_PUBLIC_BASE_URL}/notion/dashboard/${databaseId}`)
  }

  return (
    <div className="notion-dbs-wrapper">
      <div className="title-basic">New Graph</div>
      <InputText
        value={queryText} 
        onChange={onFilterType}
        placeholder="Filter through your databases"
        className="notion-db-input-container"
      />
      <div className="notion-db-options-list">
        {notionDatabases.map(notionDatabase => (
          <div
            key={`db-${notionDatabase?.id}`}
            onClick={onDatabaseClick(notionDatabase?.id)}
            className="notion-db-option"
          >
            {notionDatabase?.title[0]?.plain_text}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotionDatabases