import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {query, push} = useRouter()
  const { code } = query;

  useEffect(() => {
    if(code && code !== null && code !== undefined && code.length > 0) {
      getNotionAccessToken(code)
    }
  }, [code])
  
  const getNotionAccessToken = async (notionCode) => {
    const res = await fetch('http://localhost:3000/api/auth/notion', {
      method: 'post',
      body: JSON.stringify({code: notionCode})
    })

    console.log({res})
    const response = await res.json()
    console.log({response})

    const notionAccessToken = response?.access_token

    if(notionAccessToken !== null && notionAccessToken?.length > 0) {
      const { error } = await supabase
        .from('dashboards')
        .insert({
          id_user: user.id, 
          notion_token: notionAccessToken,
          notion_data: response,
        })
      
      console.log({error})

      push('http://localhost:3000/')
    }
  }

  getNotionAccessToken()

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      TODO LOADER
    </div>
  )
}

export default Home