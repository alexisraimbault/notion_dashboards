import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';

const NotionCallback = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {query, push} = useRouter()
  const { code } = query;

  useEffect(() => {
    if(code && code !== null && code !== undefined && code.length > 0 && user && user !== null && user !== undefined) {
      getNotionAccessToken(code, user)
    }
  }, [code, user])
  
  const getNotionAccessToken = async (notionCode, supabaseUser) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/notion`, {
      method: 'post',
      body: JSON.stringify({code: notionCode})
    })

    const response = await res.json()
    console.log({response})

    const notionAccessToken = response?.access_token

    if(notionAccessToken !== null && notionAccessToken?.length > 0) {
      const { error } = await supabase
        .from('NOTION_INTEGRATIONS')
        .insert({
          id_user: supabaseUser.id, 
          notion_token: notionAccessToken,
          notion_data: response,
        })
      
      console.log({error})

      push(`${process.env.NEXT_PUBLIC_BASE_URL}/`)
    }
  }

  getNotionAccessToken()

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <ProgressSpinner />
    </div>
  )
}

export default NotionCallback