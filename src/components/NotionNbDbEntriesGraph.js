import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import * as dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)

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

  const getAllWeeks = (formattedStartDate, formattedEndDate) => {
    const splitDateStart = formattedStartDate.split(' W')
    const splitDateEnd = formattedEndDate.split(' W')
    const yearStart = parseInt(splitDateStart[0], 10)
    const yearEnd = parseInt(splitDateEnd[0], 10)
    
    const weekStart = parseInt(splitDateStart[1], 10)
    const weekEnd = parseInt(splitDateEnd[1], 10)

    let cptYear = yearStart
    let cptWeek = weekStart
    const res = []

    while((cptYear < yearEnd || cptWeek <= weekEnd) && cptYear < yearEnd + 1) {
      res.push(`${cptYear} W${cptWeek}`)
      cptWeek += 1

      const currentDate = dayjs(`12-31-${cptYear}`, "MM-DD-YYYY").subtract(1, 'hour')
      const nbWeeksInYear = currentDate.week()

      if(cptWeek > nbWeeksInYear) {
        cptYear += 1
        cptWeek = 1
      }
    }

    return res
  }

  const getAllMonths = (formattedStartDate, formattedEndDate) => {
    const splitDateStart = formattedStartDate.split(' ')
    const splitDateEnd = formattedEndDate.split(' ')
    const yearStart = parseInt(splitDateStart[1], 10)
    const yearEnd = parseInt(splitDateEnd[1], 10)
    
    const monthStart = parseInt(splitDateStart[0], 10)
    const monthEnd = parseInt(splitDateEnd[0], 10)

    let cptYear = yearStart
    let cptMonth = monthStart
    const res = []

    while((cptYear < yearEnd || cptMonth <= monthEnd) && cptYear < yearEnd + 1) {
      res.push(`${cptMonth < 10 ? '0' : ''}${cptMonth} ${cptYear}`)
      cptMonth += 1
      if(cptMonth > 12) {
        cptYear += 1
        cptMonth = 1
      }
    }

    return res
  }

  const getAllQuarters = (formattedStartDate, formattedEndDate) => {
    const splitDateStart = formattedStartDate.split(' Q')
    const splitDateEnd = formattedEndDate.split(' Q')
    const yearStart = parseInt(splitDateStart[0], 10)
    const yearEnd = parseInt(splitDateEnd[0], 10)
    
    const quarterStart = parseInt(splitDateStart[1], 10)
    const quarterEnd = parseInt(splitDateEnd[1], 10)

    let cptYear = yearStart
    let cptQuarter = quarterStart
    const res = []

    while((cptYear < yearEnd || cptQuarter <= quarterEnd) && cptYear < yearEnd + 1) {
      res.push(`${cptYear} Q${cptQuarter}`)
      cptQuarter += 1
      if(cptQuarter > 4) {
        cptYear += 1
        cptQuarter = 1
      }
    }

    return res
  }

  const getAllYears = (formattedStartDate, formattedEndDate) => {
    const yearStart = parseInt(formattedStartDate, 10)
    const yearEnd = parseInt(formattedEndDate, 10)

    let cpt = yearStart
    const res = []

    while(cpt <= yearEnd) {
      res.push(cpt)
      cpt ++
    }
    
    return res
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
    const fillFunctionByMode = {
      'week': getAllWeeks,
      'month': getAllMonths,
      'quarter': getAllQuarters,
      'year': getAllYears
    }

    const formatFunction = formatFunctionByMode[mode]
    const compareFunction = orderFunctionByMode[mode]
    const fillFunction = fillFunctionByMode[mode]
    const nbElementsByFormattedDate = {}
    let firstKey = null
    let lastKey = null

    notionDatabaseInfo.forEach(dbElement => {
      const formattedDbElement = formatFunction(dbElement?.created_time)
      if(!Object.keys(nbElementsByFormattedDate).includes(formattedDbElement)) {
        nbElementsByFormattedDate[formattedDbElement] = 0
      }

      nbElementsByFormattedDate[formattedDbElement] += 1
      if(firstKey == null) {
        firstKey = formattedDbElement
      }
      if(lastKey == null) {
        lastKey = formattedDbElement
      }

      if(compareFunction(formattedDbElement, firstKey) < 0) {
        firstKey = formattedDbElement
      }
      if(compareFunction(formattedDbElement, lastKey) > 0) {
        lastKey = formattedDbElement
      }
    })

    if(firstKey == null) {
      return []
    }

    console.log({nbElementsByFormattedDate})
  
    const allKeys = fillFunction(firstKey, formatFunction(dayjs().format()))

    const res = []

    allKeys.forEach(key => {
      res.push({
        formattedDate: key,
        nbItemsAdded: nbElementsByFormattedDate?.[key] || 0
      })
    })

    // Object.keys(nbElementsByFormattedDate).sort(compareFunction).forEach(element => {
    //   res.push({
    //     formattedDate: element,
    //     nbItemsAdded: nbElementsByFormattedDate[element]
    //   })
    // })

    return res
  }

  const chartData = getChartData()
  console.log({chartData})

  const availableModes = ['week', 'month', 'quarter', 'year']

  const tooltipLabelFormatter = (tooltipData, tooltipData2) => {
    return tooltipData
  }

  const tooltipFormatter = (tooltipData, tooltipData2) => {
    return [tooltipData, "entrées"]
  }
  
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="nbItemsAdded" stroke="#8884d8" />
        <XAxis dataKey="formattedDate" />
        <YAxis dataKey="nbItemsAdded" />
        <Tooltip labelFormatter={tooltipLabelFormatter} formatter={tooltipFormatter} />
      </LineChart>
    </ResponsiveContainer>
  );

  
  const getNotionDbData = async () => {
    let { data, error, status } = await supabase
      .from('NOTION_INTEGRATIONS')
      .select('id, notion_token, notion_data, created_at')
      .order('id', { ascending: true })
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      return
    }

    const notion_token = data[data.length - 1].notion_token
      
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/dashboardInfo`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId})
    })

    const response = await res.json()
    console.log({response})
    setNotionDatabaseInfo(response?.results || [])
  }

  return (
    <div>
      {availableModes?.map(mode => (
        <div key={`md-${mode}`} onClick={() => setMode(mode)}>
          {mode}
        </div>
      ))}
      {renderLineChart()}
    </div>
  )
}

export default NotionNbDbEntriesGraph