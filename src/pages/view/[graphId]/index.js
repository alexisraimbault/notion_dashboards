import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';
import Image from 'next/image'

import GraphRenderer from '@/components/GraphRender';

const GraphDisplay = () => {
    const {query, push} = useRouter()
    const {graphId} = query

    const [graphData, setGraphData] = useState([])
    const [graphSettings, setGraphSettings] = useState({})
    const [isInitialized, setIsInitialized] = useState(false)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    useEffect(() => {
        initGraphData()
    }, [supabase, graphId])

    const initGraphData = async () => {
        if(isInitialized || !graphId || !supabase) {
            return
        }

        let { data, error, status } = await supabase
          .from('GPT_GRAPHS')
          .select()
          .eq('id', graphId)
        
        if(data.length !== 1) {
          return
        }

        setIsInitialized(true)
        setGraphData(data[0]?.data)
        setGraphSettings(data[0]?.settings)
    }

    return (
        <div className='graph-view__wrapper'>
            <GraphRenderer
                graphData={graphData}
                graphSettings={graphSettings}
            />
        </div>
    )
}

export default GraphDisplay