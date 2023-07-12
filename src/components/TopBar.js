import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import Image from 'next/image'

const TopBar = ({setTabFunction, logoutFunction, createGraphFunction}) => {

  return (
    <div className="topbar__wrapper">
        {/* <div className='topbar__title-container'>Wize Tables</div> */}
        <div 
            className='topbar__new-graph'
            onClick={createGraphFunction}
        >
            New Graph
        </div>
        <div
            className='topbar__item-container'
            onClick={() => setTabFunction('graphs')}
        >
                My Graphs
        </div>
        <div 
            className='topbar__item-container topbar__bottom-spaced'
            onClick={() => setTabFunction('account')}
        >
            Account
        </div>
        <div 
            className='topbar__item-container'
            onClick={logoutFunction}
        >
            Logout
        </div>
        <div 
            className='topbar__item-container'
        >
            Upgrade
        </div>
        <div className='topbar__logo-container'>
            <Image src="/iron_notes.svg" alt="Logo" width="52" height="52" />
        </div>
    </div>
  )
}

export default TopBar