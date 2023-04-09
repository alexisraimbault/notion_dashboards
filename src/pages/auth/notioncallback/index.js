import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const { code } = router.query;

  useEffect(() => {
    if(code && code !== null && code !== undefined && code.length > 0) {
      getNotionAccessToken(code)
    }
  }, [code])
  
  const getNotionAccessToken = async (notionCode) => {
    console.log({notionCode})
    console.log('V1')
    const notionIntegrationClientId = "e1ec6c09-bbde-449f-a5e1-d9e8a4aa582d"
    const notionIntegrationClientSecret = "secret_mILEebhBUG7gUshPxnNRIPZN2ZAiO5vet9yPDdxCmGL"

    try {
      const res = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'post',
        // mode: 'no-cors',
        headers: new Headers({
          'Authorization': `Basic ${btoa(`${notionIntegrationClientId}:${notionIntegrationClientSecret}`)}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }),
        body: JSON.stringify({
          grant_type: "authorization_code",
          code: notionCode, 
          redirect_uri: "http://localhost:3000/auth/notioncallback"
        })
      })
  
      console.log({res})
      // const response = await res.json()
      // console.log({response})
    } catch(e) {
      console.log(e)
    }
  }

  getNotionAccessToken()

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      
    </div>
  )
}

export default Home