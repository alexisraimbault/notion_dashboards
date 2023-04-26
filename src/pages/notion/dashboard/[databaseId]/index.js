import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'

import NotionNbDbEntriesGraph from '@/components/NotionNbDbEntriesGraph'
import Editor from '@/components/Editor'

const DashboardPage = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {query, push} = useRouter()
  const {databaseId} = query

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {/* <NotionNbDbEntriesGraph
        databaseId={databaseId}
      /> */}
      <Editor
        databaseId={databaseId}
      />
    </div>
  )
}

export default DashboardPage