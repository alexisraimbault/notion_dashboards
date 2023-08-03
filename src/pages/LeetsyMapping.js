import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

import Flow from '@/components/Flow';

const LeetsyMapping = () => {
    const [mappingName, setMappingName] = useState('')
    const [synonyms, setSynonyms] = useState([])
    const [companies, setCompanies] = useState([])
    const [courses, setCourses] = useState([])
    const [socials, setSocials] = useState([])
    const [keywords, setKeywords] = useState([])
    const [localisations, setLocalisations] = useState([])
    const [activeBlock, setActiveBlock] = useState(null)
    const [editingSynonym, setEditingSynonym] = useState('')
    const [editingCompany, setEditingCompany] = useState('')
    const [editingCourse, setEditingCourse] = useState('')
    const [editingSocial, setEditingSocial] = useState('')
    const [editingKeyword, setEditingKeyword] = useState('')
    const [editingLocalisation, setEditingLocalisation] = useState('')
    const [displayModal, setDisplayModal] = useState(false)
    
    const [booleanSearches, setBooleanSearches] = useState([])

    const getNodesAndEdges = () => {
        const RADIUS = 300

        const nodes = []
        const edges = []

        nodes.push({ 
            id: 'middle', 
            type: 'custom',
            position: { x: RADIUS, y: RADIUS }, 
            data: { label: mappingName } 
        })

        const hasSynonyms = synonyms?.length > 0
        const hasCompanies = companies?.length > 0
        const hasCourses = courses?.length > 0
        const hasSocials = socials?.length > 0
        const hasKeywords = keywords?.length > 0
        const hasLocalisations = localisations?.length > 0

        const nbCircleNodes = (hasSynonyms ? 1 : 0) +
            (hasCompanies ? 1 : 0) +
            (hasCourses ? 1 : 0) +
            (hasSocials ? 1 : 0) +
            (hasKeywords ? 1 : 0) +
            (hasLocalisations ? 1 : 0)

        let cpt = 0

        const getCoordinates = (index, nbNodes, radius, label) => {
            const angle = (360/nbNodes * index)
            const normalizedAngle = angle % 90
            const normalizedAngleInRadians = normalizedAngle * Math.PI/180
            const adjacent = Math.abs(Math.cos(normalizedAngleInRadians) * radius)
            const opposite = Math.abs(Math.sin(normalizedAngleInRadians) * radius)
            
            let x = adjacent
            let y = opposite
            let sourceHandleSuffix = 't'
            let targetHandleSuffix = 't'

            if(0 <= angle && angle < 90) {
                x = radius + adjacent
                y = radius - opposite
                if(normalizedAngle <= 45) {
                    sourceHandleSuffix = 'r'
                    targetHandleSuffix = 'l'
                } else {
                    sourceHandleSuffix = 't'
                    targetHandleSuffix = 'b'
                }
            }
            
            if(90 <= angle && angle < 180) {
                x = radius - opposite
                y = radius - adjacent
                if(normalizedAngle <= 45) {
                    sourceHandleSuffix = 't'
                    targetHandleSuffix = 'b'
                } else {
                    sourceHandleSuffix = 'l'
                    targetHandleSuffix = 'r'
                }
            }
            
            if(180 <= angle && angle < 270) {
                x = radius - adjacent
                y = radius + opposite
                if(normalizedAngle <= 45) {
                    sourceHandleSuffix = 'l'
                    targetHandleSuffix = 'r'
                } else {
                    sourceHandleSuffix = 'b'
                    targetHandleSuffix = 't'
                }
            }
            
            if(270 <= angle && angle <= 380) {
                x = radius + opposite
                y = radius + adjacent
                if(normalizedAngle <= 45) {
                    sourceHandleSuffix = 'b'
                    targetHandleSuffix = 't'
                } else {
                    sourceHandleSuffix = 'r'
                    targetHandleSuffix = 'l'
                }
            }
            
            return {x, y, sourceHandleSuffix, targetHandleSuffix}
        }

        if (hasSynonyms) {
            const label = 'Synonyms'
            const coordinates = getCoordinates(cpt, nbCircleNodes, RADIUS, label)
            nodes.push({
                id: label, 
                position: {x: coordinates?.x, y: coordinates?.y},
                type: 'custom',
                data: {
                    label: label,
                    data: synonyms,
                }
            })
            edges.push({
                id: `e-${label}`,
                source: 'middle',
                target: label,
                sourceHandle: `${mappingName}-${coordinates?.sourceHandleSuffix}`,
                targetHandle: `${label}-${coordinates?.targetHandleSuffix}`,
            })

            cpt ++;
        }

        if (hasCompanies) {
            const label = 'Companies'
            const coordinates = getCoordinates(cpt, nbCircleNodes, RADIUS, label)
            nodes.push({
                id: label, 
                position: coordinates,
                type: 'custom',
                data: {
                    label: label,
                    data: companies,
                }
            })
            edges.push({
                id: `e-${label}`,
                source: 'middle',
                target: label,
                sourceHandle: `${mappingName}-${coordinates?.sourceHandleSuffix}`,
                targetHandle: `${label}-${coordinates?.targetHandleSuffix}`,
            })

            cpt ++;
        }

        if (hasCourses) {
            const label = 'Courses'
            const coordinates = getCoordinates(cpt, nbCircleNodes, RADIUS, label)
            nodes.push({
                id: label, 
                position: coordinates,
                type: 'custom',
                data: {
                    label: label,
                    data: courses,
                }
            })
            edges.push({
                id: `e-${label}`,
                source: 'middle',
                target: label,
                sourceHandle: `${mappingName}-${coordinates?.sourceHandleSuffix}`,
                targetHandle: `${label}-${coordinates?.targetHandleSuffix}`,
            })

            cpt ++;
        }

        if (hasSocials) {
            const label = 'Socials'
            const coordinates = getCoordinates(cpt, nbCircleNodes, RADIUS, label)
            nodes.push({
                id: label, 
                position: coordinates,
                type: 'custom',
                data: {
                    label: label,
                    data: socials,
                }
            })
            edges.push({
                id: `e-${label}`,
                source: 'middle',
                target: label,
                sourceHandle: `${mappingName}-${coordinates?.sourceHandleSuffix}`,
                targetHandle: `${label}-${coordinates?.targetHandleSuffix}`,
            })

            cpt ++;
        }

        if (hasKeywords) {
            const label = 'Keywords'
            const coordinates = getCoordinates(cpt, nbCircleNodes, RADIUS, label)
            nodes.push({
                id: label, 
                position: coordinates,
                type: 'custom',
                data: {
                    label: label,
                    data: keywords,
                }
            })
            edges.push({
                id: `e-${label}`,
                source: 'middle',
                target: label,
                sourceHandle: `${mappingName}-${coordinates?.sourceHandleSuffix}`,
                targetHandle: `${label}-${coordinates?.targetHandleSuffix}`,
            })

            cpt ++;
        }

        if (hasLocalisations) {
            const label = 'Localisations'
            const coordinates = getCoordinates(cpt, nbCircleNodes, RADIUS, label)
            nodes.push({
                id: label, 
                position: coordinates,
                type: 'custom',
                data: {
                    label: label,
                    data: localisations,
                }
            })
            edges.push({
                id: `e-${label}`,
                source: 'middle',
                target: label,
                sourceHandle: `${mappingName}-${coordinates?.sourceHandleSuffix}`,
                targetHandle: `${label}-${coordinates?.targetHandleSuffix}`,
            })

            cpt ++;
        }
        
        const blockLabelToIdMap = {
            Synonyms: 'syn',
            Companies: 'comp',
            Courses: 'formations',
            Socials: 'social',
            Keywords: 'keywords',
            Localisations: 'loc',
        }
        
        return {nodes, edges, blockLabelToIdMap}
    }

    const graphData = getNodesAndEdges()

    const onEditMappingName = e => {
        setMappingName(e.target.value)
    }

    const onEditCurrentSynonym = e => {
        setEditingSynonym(e.target.value)
    }

    const onEditCurrentCompany = e => {
        setEditingCompany(e.target.value)
    }

    const onEditCurrentCourse = e => {
        setEditingCourse(e.target.value)
    }

    const onEditCurrentSocial = e => {
        setEditingSocial(e.target.value)
    }

    const onEditCurrentKeyword = e => {
        setEditingKeyword(e.target.value)
    }

    const onEditCurrentLocalisation = e => {
        setEditingLocalisation(e.target.value)
    }

    const onDeleteSynonym = synonymIndex => () => {
        const newSynonyms = [...synonyms]
        newSynonyms.splice(synonymIndex, 1)
        setSynonyms(newSynonyms)
    }

    const onDeleteCompany = companyIndex => () => {
        const newCompanies = [...companies]
        newCompanies.splice(companyIndex, 1)
        setCompanies(newCompanies)
    }

    const onDeleteCourse = courseIndex => () => {
        const newCourses = [...courses]
        newCourses.splice(courseIndex, 1)
        setCourses(newCourses)
    }

    const onDeleteSocial = socialsIndex => () => {
        const newSocials = [...socials]
        newSocials.splice(socialsIndex, 1)
        setSocials(newSocials)
    }

    const onDeleteKeyword = keywordsIndex => () => {
        const newKeywords = [...keywords]
        newKeywords.splice(keywordsIndex, 1)
        setKeywords(newKeywords)
    }

    const onDeleteLocalisation = locIndex => () => {
        const newLocalisations = [...localisations]
        newLocalisations.splice(locIndex, 1)
        setLocalisations(newLocalisations)
    }

    const onDetectEnter = input => e => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            if(input === 'mapingName') {
                setActiveBlock('syn')
                // TODO focus synonym input
            }
            if(input === 'syn') {
                const newSynonyms = [...synonyms]
                newSynonyms?.push(e.target.value)
                setSynonyms(newSynonyms)
                setEditingSynonym('')
            }
            if(input === 'comp') {
                const newCompanies = [...companies]
                newCompanies?.push(e.target.value)
                setCompanies(newCompanies)
                setEditingCompany('')
            }
            if(input === 'formations') {
                const newCourses = [...courses]
                newCourses?.push(e.target.value)
                setCourses(newCourses)
                setEditingCourse('')
            }
            if(input === 'social') {
                const newSocials = [...socials]
                newSocials?.push(e.target.value)
                setSocials(newSocials)
                setEditingSocial('')
            }
            if(input === 'keywords') {
                const newKeywords = [...keywords]
                newKeywords?.push(e.target.value)
                setKeywords(newKeywords)
                setEditingKeyword('')
            }
            if(input === 'loc') {
                const newLocalisations = [...localisations]
                newLocalisations?.push(e.target.value)
                setLocalisations(newLocalisations)
                setEditingLocalisation('')
            }
        }
    }

    const onActivateBlock = blockId => e => {
        e.stopPropagation()
        setActiveBlock(blockId)
    }

    const onBackgroundClick = e => {
        setActiveBlock(null)
    }

    const displaySearchDetails = booleanSearch => () => {
        setDisplayModal(true)
    }

    const renderListGroup = properties => {
        const { 
            blockExmplanation, 
            newInputValue,
            newInputEditFunction, 
            newInputKeyUpFunction,
            newInputPlaceholder,
            elementState,
            deleteFunction,
            suggestions
        } = properties

        return (
            <>
                <div className='mapping_block-explanation'>
                    {blockExmplanation}
                </div>
                {elementState?.length > 0 && (
                    <div className='mapping__subelements'>
                        {elementState?.map((element, elementIndex) => {
                            return (
                                <div 
                                    key={`syn-${elementIndex}`}
                                    className='mapping__subelement-container'
                                >
                                    <div className='mapping__subelement-title'>{element}</div>
                                    <i 
                                        onClick={deleteFunction(elementIndex)}
                                        className="pi pi-times mapping__delete-icon" 
                                        style={{ fontSize: '1rem' }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
                <InputText 
                    value={newInputValue} 
                    onChange={newInputEditFunction}
                    onKeyUp={newInputKeyUpFunction}
                    placeholder={newInputPlaceholder}
                    // className='mapping__input'
                />
                {suggestions?.length > 0 && (
                    <div className='mapping__suggestions-container'>
                        {suggestions?.map((suggestion, suggestionIndex) => (
                            <div 
                                className='mapping_suggestion-container'
                                key={`sugg-${suggestionIndex}`}
                            >
                                {suggestion}
                            </div>
                        ))}

                    </div>
                )}
            </>
        )
    }

    const renderListGroupSubtitle = items => {
        if(items?.length <= 0) {
            return
        }

        const MAX_ITEMS_SHOW = 2
        const itemsToShow = items.slice(0, MAX_ITEMS_SHOW)
        const nbMoreItemsToShow = items.length - MAX_ITEMS_SHOW

        return (
            <div className='mapping__block-subtitle'>
                {`${itemsToShow.join(', ')}${
                    nbMoreItemsToShow > 0 ? 
                        nbMoreItemsToShow > 1 ?
                            ` and ${nbMoreItemsToShow} more`
                            : ` and ${nbMoreItemsToShow} more`
                        : ''
                }`}
            </div>
        )
    }

    const renderListGroupWarning = (items, nbMinItems, warningText) => {
        if(items?.length <= 0 && nbMinItems === 0) {
            return
        }

        const hasEnoughItems = items?.length >= nbMinItems

        if(hasEnoughItems) {
            // TODO check green
            return {
                layout: 'inline',
                toRender: (
                    <div className='mapping__block-warning-container mapping__block-warning-container--inline'>
                        <div className='mapping__picto-container mapping__picto-container--green'>
                            <i 
                                className="pi pi-check mapping__check-icon" 
                                style={{ fontSize: '1rem' }}
                            />
                        </div>
                    </div>
                )
            }
        }

        const hasSomeItems = items?.length > 0
        // TODO check orange or red depending on hasSomeItems
        return {
            layout: 'full',
            toRender: (
                <div className='mapping__block-warning-container mapping__block-warning-container--full'>
                    <div className={`mapping__picto-container mapping__picto-container--${hasSomeItems ? 'orange' : 'red'}`}>
                        <i 
                            className="pi pi-check mapping__check-icon" 
                            style={{ fontSize: '1rem' }}
                        />
                    </div>
                    <div className={`mapping__block-warning-text mapping__block-warning-text--${hasSomeItems ? 'orange' : 'red'}`}>{warningText}</div>
                </div>
            )
        }
    }

    const renderSynonyms = () => {
        const properties = {
            blockExmplanation: "Fill all the different job titles and their synonyms that could match the job. Don't forget about the different translations, genres, ...",
            newInputValue: editingSynonym,
            newInputEditFunction: onEditCurrentSynonym, 
            newInputKeyUpFunction: onDetectEnter('syn'),
            newInputPlaceholder: "New synonym",
            elementState: synonyms,
            deleteFunction: onDeleteSynonym,
        }

        return renderListGroup(properties)
    }

    const renderCompanies = () => {
        const properties = {
            blockExmplanation: "List all the conccurent companies you can find. It will help you better understand the market, gather new keywords, and find more candidates.",
            newInputValue: editingCompany,
            newInputEditFunction: onEditCurrentCompany, 
            newInputKeyUpFunction: onDetectEnter('comp'),
            newInputPlaceholder: "New company",
            elementState: companies,
            deleteFunction: onDeleteCompany,
            // suggestions: ['Leets', 'AmazingHiring', 'PhantomBuster']
        }

        return renderListGroup(properties)
    }

    const renderCourses = () => {
        const properties = {
            blockExmplanation: "If relevant, list the courses you want to target. It can be very useful to find more candidates.",
            newInputValue: editingCourse,
            newInputEditFunction: onEditCurrentCourse, 
            newInputKeyUpFunction: onDetectEnter('formations'),
            newInputPlaceholder: "New course",
            elementState: courses,
            deleteFunction: onDeleteCourse,
        }

        return renderListGroup(properties)
    }

    const renderSocials = () => {
        const properties = {
            blockExmplanation: "Can you find online or online Social Spaces (events / communities / online groups, ...) ? ",
            newInputValue: editingSocial,
            newInputEditFunction: onEditCurrentSocial, 
            newInputKeyUpFunction: onDetectEnter('social'),
            newInputPlaceholder: "New Social Space",
            elementState: socials,
            deleteFunction: onDeleteSocial,
        }

        return renderListGroup(properties)
    }

    const renderKeywords = () => {
        const properties = {
            blockExmplanation: "Important keywords to define the profiles you are looking for. Skills, softwares, level of expertise, ... It can be anything. You can look for other similar job offers to find more keyords.",
            newInputValue: editingKeyword,
            newInputEditFunction: onEditCurrentKeyword, 
            newInputKeyUpFunction: onDetectEnter('keywords'),
            newInputPlaceholder: "New keyword",
            elementState: keywords,
            deleteFunction: onDeleteKeyword,
        }

        return renderListGroup(properties)
    }

    const renderLocalisations = () => {
        const properties = {
            blockExmplanation: "Different localisations when you want to look for profiles. You can add cities in order to target more volume.",
            newInputValue: editingLocalisation,
            newInputEditFunction: onEditCurrentLocalisation, 
            newInputKeyUpFunction: onDetectEnter('loc'),
            newInputPlaceholder: "New localisation",
            elementState: localisations,
            deleteFunction: onDeleteLocalisation,
        }

        return renderListGroup(properties)
    }

    const blocks = [
        {
            label: 'Intitulés de poste',
            id: 'syn',
            renderFunction: renderSynonyms,
            renderSubtitle: renderListGroupSubtitle(synonyms),
            renderWarning: renderListGroupWarning(synonyms, 3, "We advise you to find at least 3 synonyms"),
        }, {
            label: 'Mots clés',
            id: 'keywords',
            renderFunction: renderKeywords,
            renderSubtitle: renderListGroupSubtitle(keywords),
            renderWarning: renderListGroupWarning(keywords, 3, "We advise you to find at least 3 keywords"),
        }, {
            label: 'Localisations',
            id: 'loc',
            renderFunction: renderLocalisations,
            renderSubtitle: renderListGroupSubtitle(localisations),
            renderWarning: renderListGroupWarning(localisations, 2, "We advise you to find at least 2 different localisation keywords"),
        }, {
            label: 'Entreprises',
            id: 'comp',
            renderFunction: renderCompanies,
            renderSubtitle: renderListGroupSubtitle(companies),
            renderWarning: renderListGroupWarning(companies, 0, ''),
        }, {
            label: 'Formations',
            id: 'formations',
            renderFunction: renderCourses,
            renderSubtitle: renderListGroupSubtitle(courses),
            renderWarning: renderListGroupWarning(courses, 0, ''),
        }, {
            label: 'Espaces en ligne',
            id: 'social',
            renderFunction: renderSocials,
            renderSubtitle: renderListGroupSubtitle(socials),
            renderWarning: renderListGroupWarning(socials, 0, ''),
        }
    ]

    const generateBooleanRequests = () => {
        const linkedinPrefix = "site:linkedin.com/in"
        const titleSynonymsAgregation = synonyms.map(synonym => `intitle:"${synonym}"`).join(" OR ")
        const locsAgregation = localisations.map(loc => `"${loc}"`).join(" OR ")
        const keywordsAgregation = keywords.map(keyword => `"${keyword}"`).join(" OR ")
        const companiesAgregation = companies.map(company => `intitle:"${company}"`).join(" OR ")
        const coursesAgregation = courses.map(course => `"${course}"`).join(" OR ")
        const socialsAgregation = socials.map(social => `"${social}"`).join(" OR ")

        const baseAgregation = `(${titleSynonymsAgregation}) AND (${locsAgregation})`
        
        const keywordsRequest = `${linkedinPrefix} ${baseAgregation} AND (${keywordsAgregation})`
        const companiesRequest = `${linkedinPrefix} ${baseAgregation} AND (${companiesAgregation})`
        const coursesRequest = `${linkedinPrefix} ${baseAgregation} AND (${coursesAgregation})`
        const socialsRequest = `${linkedinPrefix} ${baseAgregation} AND (${socialsAgregation})`

        setBooleanSearches([
            ...(keywords?.length > 0 ? [keywordsRequest] : []),
            ...(companies?.length > 0 ? [companiesRequest] : []),
            ...(courses?.length > 0 ? [coursesRequest] : []),
            ...(socials?.length > 0 ? [socialsRequest] : []),
        ])

        // return {
        //     keywordsRequest,
        //     companiesRequest,
        //     coursesRequest,
        //     socialsRequest,
        // }
    }

    return (
        <div 
            className="mapping__container" style={{ padding: '50px 5%' }}
            onClick={onBackgroundClick}    
        >
            <div className='mapping__actions'>
                <InputText 
                    value={mappingName} 
                    onChange={onEditMappingName}
                    onKeyUp={onDetectEnter('mapingName')}
                    placeholder="Mapping Name"
                    className='mapping__input'
                />
                <Button 
                    label="Back" 
                    onClick={() => setBooleanSearches([])} 
                    className="mapping__action-btn p-button-secondary"
                />
                <Button 
                    label="Save" 
                    onClick={() => {{}}} 
                    className="mapping__action-btn"
                />
                <Button 
                    label="Generate Boolean requests" 
                    onClick={generateBooleanRequests} 
                    // className="mapping__action-btn"
                />
            </div>
            <div className='mapping__inner-container'>
                <div className='mapping__column'>
                    {blocks.map((block, blockIndex) => {
                        const isBlockActive = activeBlock === block?.id

                        return (
                            <div 
                                key={`block-${block?.id}`} 
                                className={`mapping__block-container`}
                            >
                                {blockIndex !== 0 && <div className='mapping__block-link-up' />}
                                <div 
                                    className={`mapping__block-inner${isBlockActive ? ' mapping__block-inner--active' : ''}`}
                                    onClick={onActivateBlock(block?.id)}    
                                >
                                    {block?.renderWarning?.layout === 'full' && block?.renderWarning?.toRender}
                                    <div className='mapping__block-top-container'>
                                        <div className='mapping__block-top-row'>
                                            {block?.renderWarning?.layout === 'inline' && block?.renderWarning?.toRender}
                                            <div className='mapping__block-title'>{block?.label}</div>
                                        </div>
                                        {!isBlockActive && block?.renderSubtitle}
                                    </div>
                                    <div className={`mapping__block-content${isBlockActive ? ' mapping__block-content--active' : ''}`}>
                                        {block?.renderFunction()}
                                    </div>
                                </div>
                            </div>
                        )}
                    )}
                </div>
                {graphData?.nodes && graphData?.edges && (
                    <Flow
                        nodes={graphData?.nodes}
                        edges={graphData?.edges}
                        blockLabelToIdMap={graphData?.blockLabelToIdMap}
                        activateBlock={onActivateBlock}
                    />
                )}
                {booleanSearches?.length > 0 && (
                    <div className='mapping__boolean-column'>
                        {booleanSearches?.map((booleanSearch, booleanSearchIndex) => (
                            <div 
                                className='mapping__boolean-search-container'
                                key={`search-${booleanSearchIndex}`}
                                onClick={displaySearchDetails(booleanSearch)}
                            >
                                <div className='mapping__boolean-search-title'>{booleanSearch}</div>
                                <div className='mapping__boolean-search-bottom-container'>
                                    <div className='mapping__boolean-search-approximation'>{`Around 120 profiles`}</div>
                                    <div className='mapping__boolean-search-preview'>{`Preview 10 profiles`}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Dialog 
                header="Search preview" 
                visible={displayModal} 
                style={{ width: '60%' }} 
                onHide={() => setDisplayModal(false)}
            >
                <div className='mapping__preview-title-row'>
                    <div className='mapping__preview-ittle-space' />
                    <div className='mapping__preview-title-item'>
                        Firstname
                    </div>
                    <div className='mapping__preview-title-item'>
                        Lastname
                    </div>
                    <div className='mapping__preview-title-item'>
                        Job title
                    </div>
                    <div className='mapping__preview-title-item'>
                        Company
                    </div>
                </div>
                <div className='mapping__preview-container'>
                    {[...Array(10).keys()].map((idx) => {

                        return (
                            <div 
                                className='mapping__preview-row'
                                key={`row-${idx}`}
                            >
                                <div 
                                    className='mapping__preview-icon-container'
                                >
                                    <i 
                                        className="pi pi-user mapping__preview-icon" 
                                        style={{ fontSize: '1rem' }}
                                    />
                                </div>
                                <div className='mapping__preview-row-item'>
                                    Jean
                                </div>
                                <div className='mapping__preview-row-item'>
                                    Dupont
                                </div>
                                <div className='mapping__preview-row-item'>
                                    Software engineer
                                </div>
                                <div className='mapping__preview-row-item'>
                                    PhantomBuster
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Dialog>
        </div>
    )
}

export default LeetsyMapping