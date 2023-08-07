import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import GraphRenderer from '@/components/GraphRender';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image'

const GraphEditor = () => {
    const {query, push} = useRouter()
    const {graphId} = query

    const [graphData, setGraphData] = useState([])
    const [graphSettings, setGraphSettings] = useState({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [editorMode, setEditorMode] = useState('general')
    const [isUpdateLoading, setIsUpdateLoading] = useState(false)

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

    const onSave = async () => {
        setIsUpdateLoading(true)
        const { error } = await supabase
            .from('GPT_GRAPHS')
            .update({ settings: graphSettings })
            .eq('id', graphId)

        setIsUpdateLoading(false)
    }

    const getPropertiesArray = () => {
        const res = []

        graphData.forEach(item => {
            Object.keys(item).forEach(itemProperty => {
                if(!res.includes(itemProperty)) {
                    res.push(itemProperty)
                }                
            })
        })

        return res
    }

    const getSortPropertiesArray = () => {
      const res = []
      
      if(graphSettings?.XAxis) {
        res.push(graphSettings?.XAxis)
      }
      
      if(graphSettings?.YAxis) {
        res.push(graphSettings?.YAxis)
      }
  
      return res
    }

    const properties = getPropertiesArray()
    const sortPorpertiesOptions = getSortPropertiesArray()

    const chartOptions = [
        {name: 'Bar Chart', id: 'bar'},
        {name: 'Line Chart', id: 'line'},
        {name: 'Pie chart', id: 'pie'},
        // TODO add other options
    ]

    const YAxisAggregationOptions = [
      {name: 'Count', id: 'count'},
      {name: 'Sum', id: 'sum'},
      {name: 'Average', id: 'avg'},
      {name: 'Minimum', id: 'min'},
      {name: 'Maximum', id: 'max'},
    ]

    const updateChartType = e => {
      const newGraphSettings = {...graphSettings}
      newGraphSettings.type = e.value
      setGraphSettings(newGraphSettings)
    }

    const updateXAxis = e => {
      const newGraphSettings = {...graphSettings}
      newGraphSettings.XAxis = e.value
      setGraphSettings(newGraphSettings)
      deleteOrderByIfNecessary()
    }
  
    const updateYAxis = e => {
      const newGraphSettings = {...graphSettings}
      newGraphSettings.YAxis = e.value
      setGraphSettings(newGraphSettings)
      deleteOrderByIfNecessary()
    }

    const onEditDashboardName = e => {
        const newGraphSettings = {...graphSettings}
        newGraphSettings.name = e.target.value
        setGraphSettings(newGraphSettings)
        deleteOrderByIfNecessary()   
    }

    const updateYAxisAggregation = e => {
      const newGraphSettings = {...graphSettings}
      newGraphSettings.aggregation = e.value
      setGraphSettings(newGraphSettings)
    }

    const updateOrderBy = e => {
      const newGraphSettings = {...graphSettings}
      newGraphSettings.orderBy = e.value
      setGraphSettings(newGraphSettings)
    }

    const updateOrderByDirection = e => {
        const newGraphSettings = {...graphSettings}
        newGraphSettings.orderByDirection = e.value
        setGraphSettings(newGraphSettings)
    }

    const deleteOrderByIfNecessary = () => {
        if(!graphSettings?.orderBy) {
          return
        }
    
        if(![graphSettings?.XAxis, graphSettings?.YAxis].includes(graphSettings?.orderBy)) {
          const newGraphSettings = {...graphSettings}
          newGraphSettings.orderBy = undefined
          setGraphSettings(newGraphSettings)
        }
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
                <Dropdown value={graphSettings?.XAxis} onChange={updateXAxis} options={properties} placeholder="Select a Property" />
              </div>
              <div className='editor__option-container'>
                <div className='editor__option-title'>Y Axis :</div>
                <Dropdown value={graphSettings?.YAxis} onChange={updateYAxis} options={properties} placeholder="Select a Property" />
              </div>
              <div className='editor__option-container'>
                <div className='editor__option-title'>Graph title</div>
                <InputText 
                  value={graphSettings?.name || ""} 
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
                <Dropdown value={graphSettings?.aggregation || 'sum'} onChange={updateYAxisAggregation} options={YAxisAggregationOptions} optionLabel="name" optionValue="id" placeholder="Select an Aggregation" />
              </div>
              <div className='editor__option-container'>
                <div className='editor__option-title'>Sort by :</div>
                <Dropdown value={graphSettings?.orderBy} onChange={updateOrderBy} options={sortPorpertiesOptions} placeholder="None" />
                <div className='editor__vertical-space' />
                <Dropdown value={graphSettings?.orderByDirection} onChange={updateOrderByDirection} options={[
                  {id: 'asc', name: 'Ascending'},
                  {id: 'desc', name: 'Descending'}
                ]} optionLabel="name" optionValue="id" placeholder="Ascending" />
              </div>
              {/* <div className='editor__option-container'>
                <div className='editor__option-title'>Secondary X Axis</div>
                <Dropdown value={graphSettings?.XAxisSecondaryId} onChange={updateXAxisSecondary} options={porpertiesOptions} optionLabel="name" optionValue="id" placeholder="Select a Property" />
                <div className='editor__vertical-space' />
                <Dropdown value={graphSettings?.secondaryOrderByDirection} onChange={updateSecondaryOrderByAsc} options={[
                  {id: 'asc', name: 'Ascending'},
                  {id: 'desc', name: 'Descending'}
                ]} optionLabel="name" optionValue="id" placeholder="Ascending" />
              </div> */}
            </div>
          )
        }
    
        return tabsRenderer[editorMode]
      }

    return (
        <div className='graph-view__wrapper'>
            <div className='graph-view__editor-container'>
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
                <div 
                  className="graph-view__cta"
                  onClick={onSave}
                >
                  {!isUpdateLoading && "Save"}
                  {isUpdateLoading && <ProgressSpinner />}
                </div>
            </div>
            <div className='graph-view__right-container'>
                <div className='graph-view__actions'>
                </div>
                <GraphRenderer
                    graphData={graphData}
                    graphSettings={graphSettings}
                />
            </div>
        </div>
    )
}

export default GraphEditor