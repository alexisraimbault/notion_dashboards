import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend } from 'recharts';
import * as dayjs from 'dayjs'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image'

const Editor = ({databaseId, initialDashboardId, isEmbed}) => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser()
  const {push} = useRouter()

  const onNavigateToDashboard = () => {
    push(`${process.env.NEXT_PUBLIC_BASE_URL}`)
  }

  const [notionDatabaseInfo, setNotionDatabaseInfo] = useState(null)
  const [notionDatabaseItems, setNotionDatabaseItems] = useState([])
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [dashboardId, setDashboardId] = useState(initialDashboardId !== undefined && initialDashboardId !== null ? parseInt(initialDashboardId) : null)
  const [isInitialLoaded, setIsInitialLoaded] = useState(false)
  const [dashboardName, setDashboardName] = useState('')
  const [editorMode, setEditorMode] = useState('general')

  const [graphSettings, setGraphSettings] = useState({
    XAxisId: null,
    YAxisId: null,
    YAxisAggregationId: 'count',
    colorRotation: ['red', 'green', 'blue', 'yellow'],
    chartType: 'bar'
  })

  const getPropertyData = propertyId => {
    if(notionDatabaseInfo?.properties === null || notionDatabaseInfo?.properties === undefined || !propertyId) {
      return null
    }

    let res = null

    Object.keys(notionDatabaseInfo?.properties).forEach(property => {
      if (notionDatabaseInfo?.properties[property]?.id === propertyId) {
        res = notionDatabaseInfo?.properties[property]
      }
    })

    return res
  }

  const xAxisProperty = getPropertyData(graphSettings?.XAxisId)
  const yAxispProperty = getPropertyData(graphSettings?.YAxisId)
  const xSecondaryAxisProperty = getPropertyData(graphSettings?.XAxisSecondaryId)
  
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
    {name: 'Pie chart', id: 'dough'},
    // TODO add other options
  ]

  const onEditDashboardName = e => setDashboardName(e.target.value)
  
  const usedDashboardId = (initialDashboardId !== null && initialDashboardId !== undefined) ? parseInt(initialDashboardId) : dashboardId
  
  const onCopyEmbedLink = () => {
    const textArea = document.createElement("textarea");
  
    // Place in the top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
  
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
  
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
  
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
  
    // Avoid flash of the white box if rendered for any reason.
    textArea.style.background = 'transparent';
  
  
    textArea.value = `${process.env.NEXT_PUBLIC_BASE_URL}/notion/embed/${usedDashboardId}`;
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  
    document.body.removeChild(textArea);
  }

  const onSave = async () => {
    setIsSaveLoading(true)
    if(usedDashboardId === null || usedDashboardId === undefined) {
      const dashboardObject = {
        id_user: user.id, 
        notion_database_id: databaseId,
        dashboard_settings: graphSettings,
        name: dashboardName
      }

      const { data, error } = await supabase
        .from('DASHBOARD')
        .insert(dashboardObject)
        .select()

      const dashboardId = data[0]?.id
      setDashboardId(dashboardId)
    } else {
      const dashboardObject = {
        dashboard_settings: graphSettings,
        name: dashboardName
      }

      const { data: dataTest } = await supabase
        .from('DASHBOARD')
        .select()
        .eq('id', usedDashboardId)

      const { data, error } = await supabase
        .from('DASHBOARD')
        .update(dashboardObject)
        .eq('id', usedDashboardId)
        .select()
    }

    setIsSaveLoading(false)
  }

  const updateChartType = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.chartType = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateXAxis = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.XAxisId = e.value
    setGraphSettings(newGraphSettings)
    deleteOrderByIfNecessary()
  }

  const updateYAxis = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.YAxisId = e.value
    setGraphSettings(newGraphSettings)
    deleteOrderByIfNecessary()
  }

  const deleteOrderByIfNecessary = () => {
    if(!graphSettings?.orderById) {
      return
    }

    if(![graphSettings?.XAxisId, graphSettings?.YAxisId].includes(graphSettings?.orderById)) {
      const newGraphSettings = {...graphSettings}
      newGraphSettings.orderById = undefined
      setGraphSettings(newGraphSettings)
    }
  }

  const updateOrderBy = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.orderById = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateOrderByAsc = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.orderByDirection = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateSecondaryOrderByAsc = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.secondaryOrderByDirection = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateYAxisAggregation = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.YAxisAggregationId = e.value
    setGraphSettings(newGraphSettings)
  }

  const updateXAxisSecondary = e => {
    const newGraphSettings = {...graphSettings}
    newGraphSettings.XAxisSecondaryId = e.value

    if(newGraphSettings?.orderById === newGraphSettings?.YAxisId) {
      newGraphSettings?.orderById === null
    }
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
    return data.start
    // TODO group by week / month / year input
    // TODO add dates without data with a '0' value checkbox
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

    return data?.name || ''
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
      date: notionGetdate,
      'status': notionGetstatus,
    }
  
    const itemType = item.type 
    if(!Object.keys(typeFormatMap).includes(itemType)) {
      return 0
    }

    return typeFormatMap[itemType](item)
  }

  useEffect(() => {
    if(!isInitialLoaded && user !== null && user.id !== null && user.id.length > 0 && databaseId !== null && databaseId !== undefined) {
      getNotionDbData()
    }
    if(!isInitialLoaded && isEmbed && initialDashboardId !== null && initialDashboardId !== undefined) {
      initDashboardData()
    }
    if(!isInitialLoaded && !isEmbed && user !== null && user.id !== null && user.id.length > 0 && initialDashboardId !== null && initialDashboardId !== undefined) {
      initDashboardData()
    }
  }, [session, databaseId, initialDashboardId])

  const hasSecondaryXAxis = graphSettings?.XAxisSecondaryId !== null && graphSettings?.XAxisSecondaryId !== undefined

  const initDashboardData = async () => {
    let { data:data1, error1, status1 } = await supabase
    .from('DASHBOARD')
    .select('id, id_user, notion_database_id, dashboard_settings, name')
    .eq('id', initialDashboardId)
    
    if(data1.length <= 0) {
      return
    }
    
    const dasbhoardData = data1[0]
    const notionDatabaseId = dasbhoardData.notion_database_id
    const dashboardGraphSettings = dasbhoardData.dashboard_settings
    const dashboardInitialName = dasbhoardData.name

    let { data:data2, error2, status2 } = await supabase
      .from('NOTION_INTEGRATIONS')
      .select('id, notion_token, notion_data, created_at')
      .order('id', { ascending: true })
      .eq('id_user', dasbhoardData.id_user)
    
    if(data2.length <= 0) {
      return
    }

    const notion_token = data2[data2.length - 1].notion_token

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/database`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId: notionDatabaseId})
    })

    const response = await res.json()
    setNotionDatabaseInfo(response)


    const res2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/dashboardInfo`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId: notionDatabaseId})
    })

    const response2 = await res2.json()
    setNotionDatabaseItems(response2?.results || [])

    setGraphSettings(dashboardGraphSettings)
    setDashboardName(dashboardInitialName)
    setIsInitialLoaded(true)
  }
  
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
      
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/database`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId})
    })

    const response = await res.json()
    setNotionDatabaseInfo(response)

    if(dashboardName?.length === 0) {
      setDashboardName(response?.title[0]?.text?.content)
    }

    const res2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notion/dashboardInfo`, {
      method: 'post',
      body: JSON.stringify({notionApiKey: notion_token, databaseId})
    })

    const response2 = await res2.json()
    setNotionDatabaseItems(response2?.results || [])
    setIsInitialLoaded(true)
  }

  const getPropertiesArray = () => {
    if(notionDatabaseInfo?.properties === null || notionDatabaseInfo?.properties === undefined) {
      return []
    }
    const res = [{id: null, name: 'None'}]
    Object.keys(notionDatabaseInfo?.properties).forEach(property => {
      res.push(notionDatabaseInfo.properties[property])
    })

    return res
  }

  const getSortPropertiesArray = () => {
    if(notionDatabaseInfo?.properties === null || notionDatabaseInfo?.properties === undefined || !(graphSettings?.XAxisId || graphSettings?.YAxisId)) {
      return []
    }

    const res = []
    Object.keys(notionDatabaseInfo?.properties).forEach(property => {
      if(notionDatabaseInfo.properties[property]?.id === graphSettings?.XAxisId) {
        res.push(notionDatabaseInfo.properties[property])
      }
      
      if((graphSettings?.XAxisSecondaryId === null || graphSettings?.XAxisSecondaryId === undefined) && notionDatabaseInfo.properties[property]?.id === graphSettings?.YAxisId) {
        res.push(notionDatabaseInfo.properties[property])
      }
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

  const compareFunctionGeneric = (itemProperty, orderByDirectionSet) => (valueA, valueB) => {
    let valueToCompareA = valueA
    let valueToCompareB = valueB
    let orderByDirectionToUse = orderByDirectionSet
    
    const isSelect = itemProperty?.type === 'select'
    const isNumber = itemProperty?.type === 'number'

    // TODO other sort behaviours for different data types
    if(isSelect) {
      orderByDirectionToUse = orderByDirectionSet === 'desc' ? 'asc' : 'desc'
      valueToCompareA = itemProperty?.select?.options?.findIndex(element => element?.name === valueA)
      valueToCompareB = itemProperty?.select?.options?.findIndex(element => element?.name === valueB)
    }

    if(isNumber) {
      orderByDirectionToUse = orderByDirectionSet === 'desc' ? 'asc' : 'desc'
    }

    if(orderByDirectionToUse === 'desc') {
      return valueToCompareA === valueToCompareB ? 0 : 
        valueToCompareA > valueToCompareB ? 1 : -1
    }

    return valueToCompareA === valueToCompareB ? 0 : 
      valueToCompareA > valueToCompareB ? -1 : 1
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

    const secondaryXAxisId = graphSettings?.XAxisSecondaryId

    const res = []
    const dataObject = {}
    const XSecondaryValues = []

    notionDatabaseItems?.forEach(notionDbItem => {
      let XProperty = null
      let YProperty = null
      let XSecondaryProperty = null

      Object.keys(notionDbItem?.properties)?.forEach(notionDbItemPropertyKey => {
        const notionDbItemProperty = notionDbItem.properties[notionDbItemPropertyKey]
        if(notionDbItemProperty?.id === graphSettings.XAxisId) {
          XProperty = notionDbItemProperty
        }
        if(notionDbItemProperty?.id === graphSettings.YAxisId) {
          YProperty = notionDbItemProperty
        }
        if(hasSecondaryXAxis && notionDbItemProperty?.id === secondaryXAxisId) {
          XSecondaryProperty = notionDbItemProperty
        }
      })

      const XValue = getNotionParamValue(XProperty)
      const YValue = getNotionParamValue(YProperty)
      const XSecondaryValue = hasSecondaryXAxis ? getNotionParamValue(XSecondaryProperty) : null

      if(hasSecondaryXAxis && !XSecondaryValues.includes(XSecondaryValue)) {
        XSecondaryValues.push(XSecondaryValue)
      }
      
      if(!Object.keys(dataObject).includes(XValue)) {
        if(hasSecondaryXAxis) {
          dataObject[XValue] = {}
          dataObject[XValue][XSecondaryValue] = getInitAggegValue(YValue)
        } else {
          dataObject[XValue] = getInitAggegValue(YValue)
        }
      } else {
        if(hasSecondaryXAxis) {
          if(!Object.keys(dataObject[XValue]).includes(XSecondaryValue)) {
            dataObject[XValue][XSecondaryValue] = getInitAggegValue(YValue)
          } else {
            dataObject[XValue][XSecondaryValue] = getNewAggegValue(dataObject[XValue][XSecondaryValue], YValue)
          }
        } else { 
          dataObject[XValue] = getNewAggegValue(dataObject[XValue], YValue)
        }
      }
    })

    const compareFunction = (itemProperty, orderByDirection) => (a, b) => {
      if(!graphSettings?.orderById) {
        return 0
      }

      if(graphSettings?.orderById === graphSettings?.XAxisId) {
        return compareFunctionGeneric(itemProperty, orderByDirection)(a.XItemData, b.XItemData)
      }

      if(graphSettings?.orderById === graphSettings?.YAxisId) {
        return compareFunctionGeneric(itemProperty, orderByDirection)(a.YItemData, b.YItemData)
      }
      
      return 0
    }

    Object.keys(dataObject)?.sort()?.forEach(XItemData => {
      if(hasSecondaryXAxis) {
        const tmpRes = {XItemData}
        Object.keys(dataObject[XItemData])?.sort()?.forEach(XSecondaryItemData => {
          const YItemData = graphSettings.YAxisAggregationId === 'avg' ? dataObject[XItemData][XSecondaryItemData].reduce((partialSum, a) => partialSum + a, 0)/dataObject[XItemData][XSecondaryItemData].length : dataObject[XItemData][XSecondaryItemData]
          tmpRes[XSecondaryItemData] = YItemData
        })

        res.push(tmpRes)
      } else {
        const YItemData = graphSettings.YAxisAggregationId === 'avg' ? dataObject[XItemData].reduce((partialSum, a) => partialSum + a, 0)/dataObject[XItemData].length : dataObject[XItemData]
        res.push({
          XItemData,
          YItemData,
        })
      }
    })

    if(!hasSecondaryXAxis) {
      const sortProperty = graphSettings?.orderById === graphSettings?.YAxisId ? yAxispProperty : xAxisProperty
      res.sort(compareFunction(sortProperty, graphSettings?.orderByDirection))
    } else {
      // TODO sort with x axis property if defined, but sorting has to be done differently
    }

    return {chartData: res, XSecondaryValues}
  }

  const sortPorpertiesOptions = getSortPropertiesArray()
  const porpertiesOptions = getPropertiesArray()
  const graphDataObject = getGraphData()
  const graphData = graphDataObject.chartData
  const secondaryValues = graphDataObject.XSecondaryValues

  const CustomTooltip = ({ active, payload, label }) => {
    let formattedName = 'Y'

    porpertiesOptions.forEach(propertyItem => {
      if(propertyItem.id === graphSettings?.YAxisId) {
        formattedName = propertyItem?.name
      }
    })

    return (
      <div className='editor__tooltip-wrapper'>
        <div className='editor__tooltip-title'>{formattedName}</div>
        {payload?.map((itemData, itemIndex) => (
          <div 
            className={`editor__tooltip-value${itemIndex !== payload?.length - 1 ? ' editor__tooltip-value--spaced' : ''}`}
            key={`tooltip-data-${itemIndex}`}
          >
            {`${payload?.length > 1 ? `${itemData?.name} : ` : ''}${itemData?.value}`}
          </div>
        ))}
      </div>
    )

    return [value, formattedName]
  }

  // Divergent
  const palette1 = [
    '#00876c',
    '#4b9c70',
    '#78b076',
    '#a3c37f',
    '#cfd68d',
    '#fae89f',
    '#f5ca7f',
    '#f1aa67',
    '#eb8857',
    '#e16551',
    '#d43d51',
  ]

  // Blues
  const palette2 = [
    '#004c6d',
    '#005e81',
    '#007094',
    '#0083a7',
    '#0096ba',
    '#00aacc',
    '#00bede',
    '#00d3ef',
    '#00e8ff',
  ]

  // Palette
  const palette3 = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
  ]
  
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={"100%"}>
      <LineChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        {!hasSecondaryXAxis && (
          <Line type="monotone" dataKey="YItemData" stroke={palette3[0]} />
        )}
        {hasSecondaryXAxis && secondaryValues?.sort(compareFunctionGeneric(xSecondaryAxisProperty, graphSettings?.secondaryOrderByDirection))?.map((XSecondaryValue, index) => {
          return (
            <Line key={`line-${index}`} type="monotone" dataKey={`${XSecondaryValue}`} stroke={palette3[index % palette3.length]} />
          )
        })}
        
        <XAxis dataKey="XItemData" />
        <YAxis />
        {/* <YAxis dataKey="YItemData" /> */}
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
  
  const renderBarChart = () => {
    return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <BarChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="XItemData" />
        <YAxis />
        {/* <YAxis dataKey="YItemData" /> */}
        {!hasSecondaryXAxis && (
          <Bar dataKey="YItemData" fill="var(--custom-red)" >
            {
              graphData.map((entry, index) => <Cell key={`color-bar-${index}`} fill={palette3[index % palette3.length]}/>)
            }
          </Bar>
        )}
        {hasSecondaryXAxis && secondaryValues?.sort(compareFunctionGeneric(xSecondaryAxisProperty, graphSettings?.secondaryOrderByDirection))?.map((XSecondaryValue, index) => {
          return (
            <Bar key={`color-bar-${index}`} dataKey={`${XSecondaryValue}`} fill={palette3[index % palette3.length]} />
          )
        })}
        <Tooltip content={<CustomTooltip />} />
      </BarChart>
    </ResponsiveContainer>
  )};
  
  // TODO render donut chart with evolution (several donuts)
  const renderDoughnutChart = () => (
    <ResponsiveContainer width="100%" height={"100%"}>
      <PieChart>
        {!hasSecondaryXAxis && (
          <Pie 
          data={graphData} 
          dataKey="YItemData" 
          nameKey="XItemData" 
          cx="50%" 
          cy="50%" 
          innerRadius={0} 
          outerRadius={"80%"} 
          // fill="var(--custom-red)" 
        >
          {
            graphData.map((entry, index) => <Cell key={`color-cell-${index}`} fill={palette3[index % palette3.length]}/>)
          }
        </Pie>
        )}
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderCharts = () => {
    if(graphData === null || graphData === undefined || graphData.length === 0) {
      return <div className='charts-wrapper'>No data to display</div>
    }

    const renderChartFunctionMap = {
      line: renderLineChart,
      bar: renderBarChart,
      dough: renderDoughnutChart,
    }

    return (
      <div className='editor__charts-wrapper'>
        {renderChartFunctionMap[graphSettings?.chartType]()}
      </div>
    )
  }

  const renderEditorTab = () => {
    const tabsRenderer = {
      general: (
        <div className='editor__options-inner-container'>
          <div className='editor__option-container'>
            <div className='editor__option-title'>Chart type :</div>
            <Dropdown value={graphSettings?.chartType} onChange={updateChartType} options={chartOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
          </div>
          <div className='editor__option-container'>
            <div className='editor__option-title'>X Axis :</div>
            <Dropdown value={graphSettings?.XAxisId} onChange={updateXAxis} options={porpertiesOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
          </div>
          <div className='editor__option-container'>
            <div className='editor__option-title'>Y Axis :</div>
            <Dropdown value={graphSettings?.YAxisId} onChange={updateYAxis} options={porpertiesOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
          </div>
          <div className='editor__option-container'>
            <div className='editor__option-title'>Graph title</div>
            <InputText 
              value={dashboardName} 
              onChange={onEditDashboardName}
              placeholder="My Graph"
            />
          </div>
        </div>
      ),
      advanced: (
        <div className='editor__options-inner-container'>
          <div className='editor__option-container'>
            <div className='editor__option-title'>Y Axis aggregation :</div>
            <Dropdown value={graphSettings?.YAxisAggregationId} onChange={updateYAxisAggregation} options={YAxisAggregationOptions} optionLabel="name" optionValue="id" placeholder="Select an Aggregation" />
          </div>
          <div className='editor__option-container'>
            <div className='editor__option-title'>Sort by :</div>
            <Dropdown value={graphSettings?.orderById} onChange={updateOrderBy} options={sortPorpertiesOptions} optionLabel="name" optionValue="id" placeholder="None" />
            <div className='editor__vertical-space' />
            <Dropdown value={graphSettings?.orderByDirection} onChange={updateOrderByAsc} options={[
              {id: 'asc', name: 'Ascending'},
              {id: 'desc', name: 'Descending'}
            ]} optionLabel="name" optionValue="id" placeholder="Ascending" />
          </div>
          <div className='editor__option-container'>
            <div className='editor__option-title'>Secondary X Axis</div>
            <Dropdown value={graphSettings?.XAxisSecondaryId} onChange={updateXAxisSecondary} options={porpertiesOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
            <div className='editor__vertical-space' />
            <Dropdown value={graphSettings?.secondaryOrderByDirection} onChange={updateSecondaryOrderByAsc} options={[
              {id: 'asc', name: 'Ascending'},
              {id: 'desc', name: 'Descending'}
            ]} optionLabel="name" optionValue="id" placeholder="Ascending" />
          </div>
        </div>
      )
    }

    return tabsRenderer[editorMode]
  }

  return (
    <div className={`editor__wrapper${isEmbed ? ' editor__wrapper--embed' : ''}`}>
      {(notionDatabaseInfo?.properties !== null && notionDatabaseInfo?.properties !== undefined) ? (
        <div className='editor__inner-wrapper'>
          {!isEmbed && (
            <div className='editor__options-wrapper'>
              <div className='editor__options-container'>
                <div className={`editor__options-tabs-selector`}>
                  <div
                    className={`editor__options-tab-option${editorMode === 'general' ? ' editor__options-tab-active' : ''}`}
                    onClick={() => setEditorMode('general')}
                  >
                    {'General'}
                    <div className='editor__options-dash'/>
                  </div>
                  <div className='editor__horizontal-space' />
                  <div
                    className={`editor__options-tab-option${editorMode === 'advanced' ? ' editor__options-tab-active' : ''}`}
                    onClick={() => setEditorMode('advanced')}
                  >
                    {'Advanced'}
                    <div className='editor__options-dash'/>
                  </div>
                </div>
                {renderEditorTab()}
                {/* <div className='editor__option-container'>
                  <div className='editor__option-title'>[WIP] data filters</div>
                </div> */}
                <div 
                  className="editor__cta"
                  onClick={onSave}
                >
                  {"Save"}
                </div>
                {/* <div className='editor__option-container'>
                  <Button label="Save" loading={isSaveLoading} onClick={onSave} />
                </div> */}
              </div>
            </div>
          )}
          <div className={`editor__right-container${isEmbed ? ' editor__right-container--embed' : ''}`}>
            {!isEmbed && (
              <div className='editor__right-top-container'>
                <div 
                  className='editor__go-back-container'
                  onClick={onNavigateToDashboard}
                >
                  <i 
                    className="pi pi-arrow-circle-left" 
                    style={{ color: 'var(--custom-color-secondary)', fontSize: '1rem' }}
                  />
                  <div>{'Back to dashboard'}</div>
                </div>
                {(usedDashboardId !== null && usedDashboardId !== undefined) && (
                  <div className='editor__copy-embed-container'>
                    <Button label="Copy Embed Link" onClick={onCopyEmbedLink} />
                    {/* TODO popup, be able to make link not avaibable for privacy */}
                    {/* <div className="editor__subtitle">{'Paste this Link into Notion and choose the "Create Embed" option'}</div> */}
                  </div>
                )}
                <div className='editor__logo-container'>
                  <Image src="/iron_notes.svg" alt="Logo" width="43" height="43" />
                </div>
              </div>
            )}
            {renderCharts()}
          </div>
        </div>
      ) : <ProgressSpinner />}
    </div>
  )
}

export default Editor