import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

const NotionDatabases = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()
  const [notionDatabases, setNotionDatabases] = useState([])
  const [queryText, setQueryText] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  // TODO error handling

  useEffect(() => {
    console.log({queryText})
    if(user !== null && user.id !== null && user.id.length > 0) {
      getNotionDbs()
    }
  }, [session, queryText])

  const onFilterType = e => setQueryText(e.target.value)

  const getNotionDbs = async () => {
    setIsFetching(true)
    let { data, error, status } = await supabase
      .from('NOTION_INTEGRATIONS')
      .select('id, notion_token, notion_data, created_at')
      .order('id', { ascending: true })
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      // TODO error handling
      setIsFetching(false)
      return
    }

    const notion_token = data[data.length - 1].notion_token
    console.log({data})
      
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
    setIsFetching(false)
  }

  const onDatabaseClick = databaseId => () => {
    push(`${process.env.NEXT_PUBLIC_BASE_URL}/notion/dashboard/${databaseId}`)
  }

  return (
    <div className="notion-dbs__wrapper">
      {/* <div className="title-basic">New Graph</div> */}
      <InputText
        value={queryText} 
        onChange={onFilterType}
        placeholder="Search"
        className="notion-dbs__input-container"
      />
      <div className="notion-dbs__options-list">
        {!isFetching && notionDatabases.map(notionDatabase => (
          <div
            key={`db-${notionDatabase?.id}`}
            onClick={onDatabaseClick(notionDatabase?.id)}
            className="notion-dbs__option"
          >
            {notionDatabase?.title[0]?.plain_text}
          </div>
        ))}
        {isFetching && (
          <ProgressSpinner />
        )}
      </div>
    </div>
  )
}

export default NotionDatabases