import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect, useRef} from 'react'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Menu } from 'primereact/menu';

import DashboardCard from './DashboardCard'

const MyDashboards = ({createGraphFunction}) => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()
  const [userDashboards, setUserDashboards] = useState([])
  const [loading, setLoading] = useState(false)

  const hasGraphs = userDashboards?.length !== undefined && userDashboards?.length !== null && userDashboards?.length > 0

  useEffect(() => {
    if(user !== null && user.id !== null && user.id.length > 0) {
      getNotionDashboards()
    }
  }, [session])

  const getNotionDashboards = async () => {
    setLoading(true)
    let { data, error, status } = await supabase
      .from('DASHBOARD')
      .select('id, name')
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      setLoading(false)
      return
    }

    setUserDashboards(data)
    setLoading(false)
  }
  
  const onDeleteDashboard = async dashboardId => {
    const { error } = await supabase
      .from('DASHBOARD')
      .delete()
      .eq('id', dashboardId)

    getNotionDashboards()
  }

  const renderEmptyState = () => (
    <div
      className="graph-listing__empty-state-container"
    >
      <div
        className="graph-listing__empty-state-title"
      >
        {"No Graphs yet !"}
      </div>
      <div 
        className="graph-listing__empty-state-btn"
        onClick={createGraphFunction}
      >
        {"Create Graph"}
      </div>
    </div>
  )

  return !loading ? (
    <>
      {hasGraphs && (
        <div className="graph-listing-wrapper">
          <div className="title-basic">{`My Graphs (${userDashboards?.length || 0})`}</div>
          <div className="graph-listing-cards-container">
            {userDashboards.map(userDashboard => {
              return (
                <DashboardCard
                  key={`dash-${userDashboard?.id}`}
                  userDashboard={userDashboard}
                  onDeleteDashboard={onDeleteDashboard}
                />
              )
            })}
          </div>
        </div>
      )}
      {!hasGraphs && renderEmptyState()}
    </>
    
  ) : <ProgressSpinner />
}

export default MyDashboards