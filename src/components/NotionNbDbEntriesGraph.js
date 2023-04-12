import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { LineChart, Line } from 'recharts';

const NotionNbDbEntriesGraph = ({databaseId}) => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()
  const [notionDatabaseInfo, setNotionDatabaseInfo] = useState([])
  const [mode, setMode] = useState('month')

  useEffect(() => {
    if(user !== null && user.id !== null && user.id.length > 0) {
      getNotionDbData()
    }
  }, [session])

  const getWeek = dateString => {
    const year = dateString.split('-')[0]
    const date = dayjs(dateString)
    
    return `${year} W${date.week()}`
  }

  const getMonth = dateString => {
    const splitDate = dateString.split('-')
    return `${splitDate[1]} ${splitDate[0]}`
  }

  const getQuarter = dateString => {
    const year = dateString.split('-')[0]
    const date = dayjs(dateString)
    
    return `${year} Q${date.quarter()}`
  }

  const getYear = dateString => {
    return dateString.split('-')[0]
  }

  const compareWeek = (dateString1, dateString2) => {
    const splitDate1 = dateString1.split(' W')
    const splitDate2 = dateString2.split(' W')
    const year1 = parseInt(splitDate1[0], 10)
    const year2 = parseInt(splitDate2[0], 10)
    if(year1 < year2) {
      return -1
    }
    if(year1 > year2) {
      return 1
    }
    const week1 = parseInt(splitDate1[1], 10)
    const week2 = parseInt(splitDate2[1], 10)
    if(week1 < week2) {
      return -1
    }
    if(week1 > week2) {
      return 1
    }

    return 0
  }

  const compareMonth = (dateString1, dateString2) => {
    const splitDate1 = dateString1.split(' ')
    const splitDate2 = dateString2.split(' ')
    const year1 = parseInt(splitDate1[1], 10)
    const year2 = parseInt(splitDate2[1], 10)
    if(year1 < year2) {
      return -1
    }
    if(year1 > year2) {
      return 1
    }
    const month1 = parseInt(splitDate1[0], 10)
    const month2 = parseInt(splitDate2[0], 10)
    if(month1 < month2) {
      return -1
    }
    if(month1 > month2) {
      return 1
    }

    return 0
  }

  const compareQuarter = (dateString1, dateString2) => {
    const splitDate1 = dateString1.split(' Q')
    const splitDate2 = dateString2.split(' Q')
    const year1 = parseInt(splitDate1[0], 10)
    const year2 = parseInt(splitDate2[0], 10)
    if(year1 < year2) {
      return -1
    }
    if(year1 > year2) {
      return 1
    }
    const quarter1 = parseInt(splitDate1[1], 10)
    const quarter2 = parseInt(splitDate2[1], 10)
    if(quarter1 < quarter2) {
      return -1
    }
    if(quarter1 > quarter2) {
      return 1
    }

    return 0
  }

  const compareYear = (dateString1, dateString2) => {
    const year1 = parseInt(dateString1, 10)
    const year2 = parseInt(dateString2, 10)
    if(year1 < year2) {
      return -1
    }
    if(year1 > year2) {
      return 1
    }

    return 0
  }

  // created_time: "2023-01-25T16:56:00.000Z"
  const getChartData = () => {
    const formatFunctionByMode = {
      'week': getWeek,
      'month': getMonth,
      'quarter': getQuarter,
      'year': getYear
    }
    const orderFunctionByMode = {
      'week': compareWeek,
      'month': compareMonth,
      'quarter': compareQuarter,
      'year': compareYear
    }

    const formatFunction = formatFunctionByMode[mode]
    const compareFunction = orderFunctionByMode[mode]
    const nbElementsByFormattedDate = {}

    notionDatabaseInfo.forEach(dbElement => {
      const formattedDbElement = formatFunction(dbElement?.created_time)
      if(!Object.keys(nbElementsByFormattedDate).includes(formattedDbElement)) {
        nbElementsByFormattedDate[formattedDbElement] = 0
      }

      nbElementsByFormattedDate[formattedDbElement] += 1
    })

    const res = []
    Object.keys(nbElementsByFormattedDate).sort(compareFunction).forEach(element => {
      res.push({
        formattedDate: element,
        nbItemsAdded: nbElementsByFormattedDate[element]
      })
    })

    return res
  }

  const chartData = getChartData()
  console.log({chartData})

  const renderLineChart = () => (
    <LineChart width={400} height={400} data={chartData}>
      <Line type="monotone" dataKey="nbItemsAdded" stroke="#8884d8" />
    </LineChart>
  );

  
  const getNotionDbData = async () => {
    let { data, error, status } = await supabase
      .from('NOTION_INTEGRATIONS')
      .select('id, notion_token, notion_data, created_at')
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      return
    }

    const notion_token = data[0].notion_token
      
    const res = await fetch('http://localhost:3000/api/notion/dashboardInfo', {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId})
    })

    console.log({res})
    const response = await res.json()
    console.log({response})
    setNotionDatabaseInfo(response?.results || [])
  }

  return (
    <div>
      {renderLineChart()}
    </div>
  )
}

export default NotionNbDbEntriesGraph