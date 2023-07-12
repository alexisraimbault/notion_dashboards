import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import Image from 'next/image'

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

  const hasIntegrations = notionIntegrations?.length !== undefined && notionIntegrations?.length !== null && notionIntegrations?.length > 0
  const currentIntegration = hasIntegrations ? 
    notionIntegrations[notionIntegrations.length - 1] : null

  const onCreateGraph = () => setDisplayModal(true)

  const tabRenderer = {
    graphs: () => <MyDashboards createGraphFunction={onCreateGraph} />,
    account: () => hasIntegrations ? (
      <div className='homepage__account-container'>
        <div className='homepage__account-integration-title'>{'Current linked Notion Workspace'}</div>
        <div className='homepage__account-integration-container'>
          <img 
            className='homepage__account-integration-logo'
            src={currentIntegration?.notion_data?.workspace_icon} 
            alt="Integration logo" 
            width="52" 
            height="52" 
          />
          <div className='homepage__account-integration-name'>{currentIntegration?.notion_data?.workspace_name}</div>
        </div>
        <div 
          className="homepage__account-integration-btn"
          onClick={onLinkNotionAccount}
        >
          {"Update Notion Workspace"}
        </div>
      </div>
    ) : null,
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

  const renderEmptyState = () => (
    <div
      className="homepage__empty-state-container"
    >
      <div
        className="homepage__empty-state-title"
      >
        {"You need to link you notion workspace in order to start creating !"}
      </div>
      <div 
        className="homepage__empty-state-btn"
        onClick={onLinkNotionAccount}
      >
        {"Link Notion Workspace"}
      </div>
    </div>
  )

  const renderCreateGreaph = () => {

    return (
      <Dialog header="Select a database" visible={displayModal} style={{ width: '600px' }} onHide={() => setDisplayModal(false)}>
        {hasIntegrations && (
          <div className="homepage__popup-content">
            <NotionDatabases/>
          </div>
        )}
        {!hasIntegrations && renderEmptyState()}
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
      {!loading && session && (
        <div className="homepage__container" >
          {hasIntegrations && tabRenderer[tab]()}
          {!hasIntegrations && renderEmptyState()}
        </div>
      ) }
      {!loading && !session && (
        <div className="landing__wrapper" >
          <h1 className="landing__title">{'Improve any Notion Database with Powerful Visualizations'}</h1>
          <div className="landing__auth-wrapper" >
            <Auth 
              supabaseClient={supabase} 
              appearance={{ theme: ThemeSupa }} 
              theme="light"
              providers={[]}
            />
          </div>
          <div className='landing__logo-container'>
            <Image src="/iron_notes.svg" alt="Logo" width="64" height="64" />
          </div>
        </div>
      ) }
      {loading && <ProgressSpinner />}
      {renderCreateGreaph()}
    </div>
  )
}

export default Home