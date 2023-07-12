import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect, useRef} from 'react'
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const DashboardCard = ({userDashboard, onDeleteDashboard}) => {
//   const session = useSession()
//   const supabase = useSupabaseClient()
//   const user = useUser()
  const {push} = useRouter()
  const menuRef = useRef(null)
  const [displayModal, setDisplayModal] = useState(false)

  const onDashboardClick = dashboardId => event => {
    push(`${process.env.NEXT_PUBLIC_BASE_URL}/notion/dashboardupdate/${dashboardId}`)
  }

  const onDeleteGraph = () => {
    setDisplayModal(false)
    onDeleteDashboard(userDashboard?.id)
  }

  const menuItems = [{
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    className: 'graph-listing-card__action-delete',
    command: (event) => {
      event.originalEvent.stopPropagation()
      setDisplayModal(true)
    }
  }]

  const onToggleMenu = event => {
    event.stopPropagation()
    menuRef.current.toggle(event)
  }

  const hideModal = () => {
    setDisplayModal(false)
  }

  const stopPropagation = event => {
    event.stopPropagation()
  }

  return (
    <div
      onClick={onDashboardClick(userDashboard?.id)}
      className="graph-listing-card"
    >
      <div
        className="graph-listing-card__top-bar"
      >
        <div
          onClick={onToggleMenu}
          className="graph-listing-card__menu-btn"
        >
          <i 
            className="pi pi-ellipsis-v" 
            style={{ color: 'var(--custom-color-secondary)', fontSize: '1rem' }}
          />
        </div>
        </div>
      <Menu model={menuItems} popup ref={menuRef} />
      <div className="graph-listing-card__title">
        {userDashboard?.name}
      </div>
      <div
        onClick={stopPropagation}
        className="graph-listing-card__stop-propagation"
      >
        <Dialog header="Delete Graph" visible={displayModal} style={{ width: '400px' }} onHide={hideModal}>
          <div className="graph-listing-card__popup-content">
            Are you sure? You can't undo this action.
          </div>
          <div className="graph-listing-card__popup-bottom">
            <Button label="Cancel" onClick={() => setDisplayModal(false)} className="p-button-secondary"/>
            <div className="space-div-horizontal" />
            <Button label="Delete" onClick={onDeleteGraph} className="p-button-danger"  />
          </div>

        </Dialog>
      </div>
    </div>
  )
}

export default DashboardCard