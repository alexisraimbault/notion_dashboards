import { useRouter } from 'next/router'
import React, {useEffect} from 'react'
import { createClient } from '@supabase/supabase-js'

const Unsubscribe = () => {
    const {query, push} = useRouter()
    const {email} = query
    
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    useEffect(() => {
        if(email) {
            removeEmail(email)
        }
    }, [email])

    const removeEmail = async email => {
        console.log('removing ', email)
        if(email) {
            const { data, error } = await supabase
                .from('removed_emails')
                .insert({email})
        }

    }

    return (
        <div className='graph-view__wrapper'>
            {`Hi, your email was removed from our mailing list !`}
        </div>
    )
}

export default Unsubscribe