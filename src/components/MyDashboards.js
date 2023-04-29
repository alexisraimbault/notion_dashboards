import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'

const MyDashboards = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()
  const [userDashboards, setUserDashboards] = useState([])

  useEffect(() => {
    if(user !== null && user.id !== null && user.id.length > 0) {
      getNotionDashboards()
    }
  }, [session])

  const getNotionDashboards = async () => {
    let { data, error, status } = await supabase
      .from('DASHBOARD')
      .select('id, name')
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      return
    }

    setUserDashboards(data)
  }

  const onDashboardClick = dashboardId => () => {
    push(`${process.env.NEXT_PUBLIC_BASE_URL}/notion/dashboardupdate/${dashboardId}`)
  }

  return (
    <div className="graph-listing-wrapper">
      <div className="title-basic">{`My Graphs (${userDashboards?.length || 0})`}</div>
      <div className="graph-listing-cards-container">
        {userDashboards.map(userDashboard => (
          <div
            key={`dash-${userDashboard?.id}`}
            onClick={onDashboardClick(userDashboard?.id)}
            className="graph-listing-card"
          >
            {userDashboard?.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyDashboards