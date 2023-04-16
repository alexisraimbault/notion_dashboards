import '../styles/globals.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import * as dayjs from 'dayjs'

function MyApp({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    dayjs().format()
  })

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
export default MyApp