import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const GraphRenderer = ({graphData, graphSettings}) => {
    // PALETTES

    // Divergent
    const palette1 = ["#00876c", "#4b9d72", "#79b37a", "#a5c884", "#d2dd92", "#fff1a5", "#fad083", "#f4af69", "#ed8b58", "#e36651", "#d43d51"]

    // Blues
    const palette2 = ['#004c6d','#005e81','#007094','#0083a7','#0096ba','#00aacc','#00bede','#00d3ef','#00e8ff']

    // Palette
    const palette3 = ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43','#ffa600']

    // pastels
    const palette4 = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]

    // colored retro
    const palette5 = ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"]

    // colored bright
    const palette6 = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"]

    // blue to yellow
    const palette7 = ["#115f9a", "#1984c5", "#22a7f0", "#48b5c4", "#76c68f", "#a6d75b", "#c9e52f", "#d0ee11", "#d0f400"]

    const palettes = [palette3, palette2, palette1, palette4, palette5, palette6, palette7]

    const isNumeric = toTest => {
        return !isNaN(toTest)
    }

    const getYAxis = () => {
        const XProperty = graphSettings?.XAxis
        const defaultProperty = graphSettings?.YAxis
        const numericProperties = {}
        graphData.forEach(item => {
            Object.keys(item).forEach(property => {
                if(property !== XProperty) {
                    const propertyValue = item[property]

                    if(propertyValue.length > 0 ) {
                        const isNumericProperty = isNumeric(propertyValue)
                        const tmpValue = propertyValue?.split('')?.join('');
                        const isSubNumericProperty = /\d/.test(tmpValue)
            
                        if(isNumericProperty || isSubNumericProperty) {
                            if(!Object.keys(numericProperties).includes(property)) {
                                numericProperties[property] = 0
                            }
                            numericProperties[property] += isNumericProperty ? 2 : 1
                        }
                    }
                }
            } )
        })

        const numericPropertiesAll = Object.keys(numericProperties)

        for(let otherProperty of numericPropertiesAll) {
            if(otherProperty.includes(defaultProperty) || defaultProperty.includes(otherProperty)) {
                return {
                    property: otherProperty,
                    isNumeric: true
                }
            }
        }

        if(numericPropertiesAll.includes(defaultProperty)) {
            return {
                property: defaultProperty,
                isNumeric: true
            }
        }

        let res = null
        let resScore = null
        numericPropertiesAll.forEach(numericProperty => {
            if(resScore === null || numericProperties[numericProperty] > resScore) {
                resScore = numericProperties[numericProperty]
                res = numericProperty
            }
        })
        
        if (res !== null) {
            return {
                property: res,
                isNumeric: true
            }
        }

        return {
            property: defaultProperty,
            isNumeric: false
        }
    }

    const getXAxis = () => {
        const defaultProperty = graphSettings?.XAxis
        const properties = []
        graphData.forEach(item => {
            Object.keys(item).forEach(property => {
                if(!properties.includes(property)) {
                    properties.push(property)
                }
            } )
        })

        if(properties.includes(defaultProperty)) {
            return defaultProperty
        }

        for(let otherProperty of properties) {
            if(defaultProperty.includes(otherProperty) || otherProperty.includes(defaultProperty)) {
                return otherProperty
            }
        }

        return defaultProperty
    }

    const XProperty = getXAxis()
    const YaxisData = getYAxis()
    const YProperty = YaxisData?.property
    const isYPropertyNumeric = YaxisData?.isNumeric
    const aggregationType = !isYPropertyNumeric ? 'count' : graphSettings?.aggregation || 'sum'
    const chartTypeRaw = graphSettings?.type || 'line'

    let paletteIndex = parseInt(graphSettings?.palette || 1)
    const availablePalettes = [...Array(palettes.length).keys()]

    if(!availablePalettes.includes(paletteIndex - 1)) {
        paletteIndex = 1
    }

    const paletteToUse = palettes[paletteIndex - 1]

    const availableTypes = ['line', 'bar', 'pie', 'radar']
    const chartType = availableTypes.includes(chartTypeRaw) ? chartTypeRaw : 'line'

    const extractNumericValue = value => {
        if(isNumeric(value)) {
            return +value
        }

        const tmpValue = value?.split('')?.join('');

        if(/\d/.test(tmpValue)) {
            return tmpValue.replace(/[^0-9]/g, "")
        }

        return value
    }

    const getNewAggegValue = (currentValue, newItem) => {
        const newAggregValueFunctionByIdMap = {
            count: () => currentValue + 1,
            sum: () => currentValue + newItem,
            avg: () => [...currentValue, newItem],
            min: () => Math.min(currentValue, newItem),
            max: () => Math.max(currentValue, newItem),
        }
    
        return newAggregValueFunctionByIdMap[aggregationType]()
    }
  
    const getInitAggegValue = firstItem => {
        const initAggregValueByIdMap = {
            count: 1,
            sum: firstItem,
            avg: [firstItem],
            min: firstItem,
            max: firstItem,
        }
    
        return initAggregValueByIdMap[aggregationType]
    }

    const compareFunctionGeneric = (property, orderByDirection) => (a, b) => {
        let valueToCompareA = a[property]
        let valueToCompareB = b[property]

        if(orderByDirection === 'desc') {
            return valueToCompareA === valueToCompareB ? 0 : 
            valueToCompareA > valueToCompareB ? -1 : 1
        }

        return valueToCompareA === valueToCompareB ? 0 : 
            valueToCompareA > valueToCompareB ? 1 : -1
      
        return 0
    }

    const formatGraphData = () => {
        const res = []
        const dataObject = {}

        graphData?.forEach(itemDataObject => {
            const XValue = itemDataObject[XProperty]
            const YValue = extractNumericValue(itemDataObject[YProperty])

            if(!Object.keys(dataObject).includes(XValue)) {
                dataObject[XValue] = getInitAggegValue(YValue)
            } else {
                dataObject[XValue] = getNewAggegValue(dataObject[XValue], YValue)
            }
        })

        Object.keys(dataObject)?.forEach(XItemData => {
            const YItemData = aggregationType === 'avg' ? dataObject[XItemData].reduce((partialSum, a) => partialSum + a, 0)/dataObject[XItemData].length : dataObject[XItemData]
            res.push({
                XItemData,
                YItemData,
            })
        })

        if(graphSettings?.orderBy) {
            const sortProperty = graphSettings?.orderBy === graphSettings?.XAxis ? 'XItemData' : 'YItemData'
            res.sort(compareFunctionGeneric(sortProperty, graphSettings?.orderByDirection))
        }

        return res
    }

    const formattedData = formatGraphData()

    const CustomTooltip = ({ active, payload, label }) => {
        return (
            <div className='graph-view__tooltip-wrapper'>
                <div 
                    className={`graph-view__tooltip-value`}
                >
                    {`${YProperty} : ${payload[0]?.payload?.YItemData}`}
                </div>
            </div>
        )
      }

    const renderLineChart = () => (
        <ResponsiveContainer width="100%" height={"100%"}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="YItemData" stroke={paletteToUse[0]} />
            <XAxis dataKey="XItemData" />
            <YAxis />
            {/* <YAxis dataKey="YItemData" /> */}
            <Tooltip content={<CustomTooltip />} />
            {/* <Tooltip /> */}
          </LineChart>
        </ResponsiveContainer>
    );
    
    const renderBarChart = () => {
        return (
            <ResponsiveContainer width="100%" height={"100%"}>
                <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="XItemData" />
                <YAxis />
                <Bar dataKey="YItemData" fill="var(--custom-red)" >
                {
                    formattedData.map((entry, index) => <Cell key={`color-bar-${index}`} fill={paletteToUse[index % paletteToUse.length]}/>)
                }
                </Bar>
                <Tooltip content={<CustomTooltip />} />
                {/* <Tooltip /> */}
                </BarChart>
            </ResponsiveContainer>
        )
    };
    
    const renderDoughnutChart = () => (
        <ResponsiveContainer width="100%" height={"100%"}>
            <PieChart>
            <Pie 
                data={formattedData} 
                dataKey="YItemData" 
                nameKey="XItemData" 
                cx="50%" 
                cy="50%" 
                innerRadius={0} 
                outerRadius={"80%"} 
            >
                {
                formattedData.map((entry, index) => <Cell key={`color-cell-${index}`} fill={paletteToUse[index % paletteToUse.length]}/>)
                }
            </Pie>
            <Tooltip />
            <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
    
    const renderRadarChart = () => (
        <ResponsiveContainer width="100%" height={"100%"}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="XItemData" />
                <PolarRadiusAxis />
                <Radar dataKey="YItemData" stroke={paletteToUse[0]} fill={paletteToUse[0]} fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );

    const renderCharts = () => {
        if(formattedData === null || formattedData === undefined || formattedData.length === 0) {
          return <div className='graph-view__empty'>No data to display</div>
        }
    
        const renderChartFunctionMap = {
          line: renderLineChart,
          bar: renderBarChart,
          pie: renderDoughnutChart,
          radar: renderRadarChart,
        }
    
        return (
          <div className='graph-view__charts-wrapper'>
            {graphSettings.name && <div className='graph-view__charts-title'>{graphSettings.name}</div>}
            {renderChartFunctionMap[chartType]()}
          </div>
        )
      }

    return (
        <div className='graph-view__wrapper'>
            {renderCharts()}
        </div>
    )
}

export default GraphRenderer