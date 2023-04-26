import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie } from 'recharts';
import * as dayjs from 'dayjs'
import { Dropdown } from 'primereact/dropdown';

const Editor = ({databaseId}) => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()
  const [notionDatabaseInfo, setNotionDatabaseInfo] = useState(null)
  const [notionDatabaseItems, setNotionDatabaseItems] = useState([])
  const [graphSettings, setGraphSettings] = useState({
    XAxisId: null,
    YAxisId: null,
    YAxisAggregationId: 'count',
    colorRotation: ['red', 'green', 'blue', 'yellow'],
    chartType: 'bar'
  })

  const YAxisAggregationOptions = [
    {name: 'Count', id: 'count'},
    {name: 'Sum', id: 'sum'},
    {name: 'Average', id: 'avg'},
    {name: 'Minimum', id: 'min'},
    {name: 'Maximum', id: 'max'},
  ]

  const chartOptions = [
    {name: 'Bar Chart', id: 'bar'},
    {name: 'Line Chart', id: 'line'},
    {name: 'Doughnut chart', id: 'dough'},
    // TODO add other options
  ]

  const updateChartType = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.chartType = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateXAxis = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.XAxisId = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateYAxis = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.YAxisId = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateYAxisAggregation = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.YAxisAggregationId = e.value
    setGraphSettings(newGraphSettings)
  }

  // Notion types :
  // - checkbox
  const notionGetcheckbox = item => {
    const data = item.checkbox

    // TODO
    return 0
  }
  // - created_by
  const notionGetcreated_by = item => {
    const data = item.created_by

    // TODO
    return 0
  }
  // - created_time
  const notionGetcreated_time = item => {
    const data = item.created_time

    // TODO
    return 0
  }
  // - date
  const notionGetdate = item => {
    const data = item.date

    // TODO
    return 0
  }
  // - email
  const notionGetemail = item => {
    const data = item.email

    // TODO
    return 0
  }
  // - files
  const notionGetfiles = item => {
    const data = item.files

    // TODO
    return 0
  }
  // - formula
  const notionGetformula = item => {
    const data = item.formula

    // TODO
    return 0
  }
  // - last_edited_by
  const notionGetlast_edited_by = item => {
    const data = item.last_edited_by

    // TODO
    return 0
  }
  // - last_edited_time
  const notionGetlast_edited_time = item => {
    const data = item.last_edited_time

    // TODO
    return 0
  }
  // - multi_select
  const notionGetmulti_select = item => {
    const data = item.multi_select

    // TODO
    return 0
  }
  // - number
  const notionGetnumber = item => {
    const data = item.number

    return data || 0
  }
  // - people
  const notionGetpeople = item => {
    const data = item.people

    // TODO
    return 0
  }
  // - phone_number
  const notionGetphone_number = item => {
    const data = item.phone_number

    // TODO
    return 0
  }
  // - relation
  const notionGetrelation = item => {
    const data = item.relation

    // TODO
    return 0
  }
  // - rollup
  const notionGetrollup = item => {
    const data = item.rollup

    // TODO
    return 0
  }
  // - rich_text
  const notionGetrich_text = item => {
    const data = item.rich_text

    if(data === null || data === undefined ||data?.length === 0) {
      return ''
    }

    return data[0]?.text?.content
  }
  // - select
  const notionGetselect = item => {
    const data = item.select

    return data?.name || ''
  }
  // - status
  const notionGetstatus = item => {
    const data = item.status

    // TODO
    return 0
  }
  // - title
  const notionGettitle = item => {
    const data = item.title

    if(data === null || data === undefined ||data?.length === 0) {
      return ''
    }
  
    return data[0]?.text?.content
  }
  // - url
  const notionGeturl = item => {
    const data = item.url

    // TODO
    return 0
  }

  const getNotionParamValue = item => {
    const typeFormatMap = {
      number: notionGetnumber,
      rich_text: notionGetrich_text,
      select: notionGetselect,
      title: notionGettitle,
    }
  
    const itemType = item.type 
    if(!Object.keys(typeFormatMap).includes(itemType)) {
      return 0
    }

    return typeFormatMap[itemType](item)
  }

  useEffect(() => {
    if(user !== null && user.id !== null && user.id.length > 0 && databaseId !== null && databaseId !== undefined) {
      getNotionDbData()
    }
  }, [session, databaseId])
  
  const getNotionDbData = async () => {
    let { data, error, status } = await supabase
      .from('NOTION_INTEGRATIONS')
      .select('id, notion_token, notion_data, created_at')
      .eq('id_user', user.id)
    
    if(data.length <= 0) {
      return
    }

    const notion_token = data[0].notion_token
      
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/database`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId})
    })

    const response = await res.json()
    console.log({response})
    setNotionDatabaseInfo(response)


    const res2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/dashboardInfo`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId})
    })

    const response2 = await res2.json()
    console.log({response2})
    setNotionDatabaseItems(response2?.results || [])
  }

  const getPropertiesArray = () => {
    if(notionDatabaseInfo?.properties === null || notionDatabaseInfo?.properties === undefined) {
      return []
    }
    const res = []
    Object.keys(notionDatabaseInfo?.properties).forEach(property => {
      res.push(notionDatabaseInfo.properties[property])
    })

    return res
  }

  const getNewAggegValue = (currentValue, newItem) => {
    const newAggregValueFunctionByIdMap = {
      count: () => currentValue + 1,
      sum: () => currentValue + newItem,
      avg: () => [...currentValue, newItem],
      min: () => Math.min(currentValue, newItem),
      max: () => Math.max(currentValue, newItem),
    }

    return newAggregValueFunctionByIdMap[graphSettings.YAxisAggregationId]()
  }

  const getInitAggegValue = firstItem => {
    const initAggregValueByIdMap = {
      count: 1,
      sum: firstItem,
      avg: [firstItem],
      min: firstItem,
      max: firstItem,
    }

    return initAggregValueByIdMap[graphSettings.YAxisAggregationId]
  }

  const getGraphData = () => {
    if(
      notionDatabaseInfo?.properties === null || 
      notionDatabaseInfo?.properties === undefined ||
      graphSettings?.XAxisId === null || 
      graphSettings?.XAxisId === undefined ||
      graphSettings?.YAxisId === null || 
      graphSettings?.YAxisId === undefined ||
      graphSettings?.YAxisAggregationId === null || 
      graphSettings?.YAxisAggregationId === undefined
    ) {
      return []
    }

    const res = []
    const dataObject = {}

    console.log({notionDatabaseItems})
    notionDatabaseItems?.forEach(notionDbItem => {
      let XProperty = null
      let YProperty = null

      Object.keys(notionDbItem?.properties)?.forEach(notionDbItemPropertyKey => {
        const notionDbItemProperty = notionDbItem.properties[notionDbItemPropertyKey]
        if(notionDbItemProperty?.id === graphSettings.XAxisId) {
          XProperty = notionDbItemProperty
        }
        if(notionDbItemProperty?.id === graphSettings.YAxisId) {
          YProperty = notionDbItemProperty
        }
      })

      const XValue = getNotionParamValue(XProperty)
      const YValue = getNotionParamValue(YProperty)
      
      if(!Object.keys(dataObject).includes(XValue)) {
        dataObject[XValue] = getInitAggegValue(YValue)
      } else {
        dataObject[XValue] = getNewAggegValue(dataObject[XValue], YValue)
      }
    })

    Object.keys(dataObject)?.sort()?.forEach(XItemData => {
      const YItemData = graphSettings.YAxisAggregationId === 'avg' ? dataObject[XItemData].reduce((partialSum, a) => partialSum + a, 0)/dataObject[XItemData].length : dataObject[XItemData]
      res.push({
        XItemData,
        YItemData,
      })
    })

    return res
  }

  const porpertiesOptions = getPropertiesArray()
  const graphData = getGraphData()
  console.log({graphData})
  
  // TODO integrate color rotations
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={graphData}>
        <Line type="monotone" dataKey="YItemData" stroke="#8884d8" />
        <XAxis dataKey="XItemData" />
        <YAxis dataKey="YItemData" />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
  
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={graphData}>
        <XAxis dataKey="XItemData" />
        <YAxis dataKey="YItemData" />
        <Bar dataKey="YItemData" fill="#8884d8" />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
  
  const renderDoughnutChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={graphData} dataKey="YItemData" nameKey="XItemData" cx="50%" cy="50%" innerRadius={50} outerRadius={90} fill="#8884d8" />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderCharts = () => {
    if(graphData === null || graphData === undefined || graphData.length === 0) {
      return <div>No data to display</div>
    }

    const renderChartFunctionMap = {
      line: renderLineChart,
      bar: renderBarChart,
      dough: renderDoughnutChart,
    }

    return renderChartFunctionMap[graphSettings?.chartType]()
  }

  return (
    <div>
      {notionDatabaseInfo?.properties !== null && notionDatabaseInfo?.properties !== undefined && (
        <div>
          <div>Chart type :</div>
          <Dropdown value={graphSettings?.chartType} onChange={updateChartType} options={chartOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
          <div>X Axis :</div>
          <Dropdown value={graphSettings?.XAxisId} onChange={updateXAxis} options={porpertiesOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
          <div>Y Axis :</div>
          <Dropdown value={graphSettings?.YAxisId} onChange={updateYAxis} options={porpertiesOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
          <div>Y Axis aggregation :</div>
          <Dropdown value={graphSettings?.YAxisAggregationId} onChange={updateYAxisAggregation} options={YAxisAggregationOptions} optionLabel="name" optionValue="id" placeholder="Select an Aggregation" />
        </div>
        // TODO : data filters
      )}
      {renderCharts()}
    </div>
  )
}

export default Editor