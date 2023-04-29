import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'

import NotionNbDbEntriesGraph from '@/components/NotionNbDbEntriesGraph'
import Editor from '@/components/Editor'

const DashboardEmbedPage = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {query, push} = useRouter()
  const {dashboardId} = query

  return (
    <div>
      {/* <NotionNbDbEntriesGraph
        databaseId={databaseId}
      /> */}
      <Editor
        initialDashboardId={dashboardId}
      />
    </div>
  )
}

export default DashboardEmbedPage