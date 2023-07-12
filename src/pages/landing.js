import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

import NotionDatabases from '@/components/NotionDatabases'
import MyDashboards from '@/components/MyDashboards'

const Landing = () => {

    // Headline: Transform Your Notion Databases Into Customizable Visualizations with Wizetables

    // Subheading: Wizetables lets you easily create dynamic and interactive tables and charts from your Notion databases. Take control of your data and gain insights that matter to you.
    
    // Features:
    
    // Flexible data visualization: Create custom visualizations that fit your specific needs, with a wide range of chart types and styles to choose from.
    // Seamless integration: Connect to your Notion databases seamlessly, and update your visualizations in real-time as your data changes.
    
    // Easy to use: No coding required! With Wizetables' intuitive drag-and-drop interface, creating and customizing your visualizations has never been easier.
    // Collaborate with ease: Share your visualizations with team members or clients, and collaborate in real-time on your data.
    // Benefits:
    
    // Gain insights that matter: Get a clearer understanding of your data with customizable charts and tables that highlight the key trends and patterns.
    // Save time: Create and update visualizations quickly and easily, so you can spend less time wrangling data and more time on what matters most.
    
    // Customizable to your needs: Wizetables is designed to be flexible and adaptable, so you can create visualizations that fit your specific use cases and business needs.
    // Collaborate more effectively: With Wizetables, you can easily share your visualizations with others and collaborate in real-time, improving team productivity and efficiency.
    // Call to Action:
    
    // Ready to take control of your Notion data and transform it into stunning visualizations? Try Wizetables today and see the difference it can make to your productivity and insights. Sign up now to get started!
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <div>Seamlessly Utilize your Notion Databases with Customizable Visualizations</div>
        <div>Wizetables lets you easily create dynamic and interactive charts from your Notion databases. Take control of your data and gain insights that matter to you.</div>
    </div>
  )
}

export default Landing