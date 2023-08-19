import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import GraphRenderer from '@/components/GraphRender';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image'

const Unsubscribe = () => {
    const {query, push} = useRouter()
    const {email} = query
    console.log({email})

    return (
        <div className='graph-view__wrapper'>
            {`Hi, your email was removed from our mailing list !`}
        </div>
    )
}

export default Unsubscribe