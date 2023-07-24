import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';

const LeetsyMapping = () => {
    const [mappingName, setMappingName] = useState('')
    const [synonyms, setSynonyms] = useState([])
    const [companies, setCompanies] = useState([])
    const [activeBlock, setActiveBlock] = useState(null)
    const [editingSynonym, setEditingSynonym] = useState('')
    const [editingCompany, setEditingCompany] = useState('')

    const onEditMappingName = e => {
        setMappingName(e.target.value)
    }

    const onEditCurrentSynonym = e => {
        setEditingSynonym(e.target.value)
    }

    const onEditCurrentCompany = e => {
        setEditingCompany(e.target.value)
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
        }
    }

    const onActivateBlock = blockId => e => {
        e.stopPropagation()
        setActiveBlock(blockId)
    }

    const onBackgroundClick = e => {
        setActiveBlock(null)
    }

    const renderSynonyms = () => {
        return (
            <>
                <div className='mapping_block-explanation'>
                    {"Fill all the different job titles and their synonyms that could match the job. Don't forget about the different translations, genres, ..."}
                </div>
                {synonyms?.length > 0 && (
                    <div className='mapping__subelements'>
                        {synonyms?.map((synonym, synonymIndex) => {
                            return (
                                <div 
                                    key={`syn-${synonymIndex}`}
                                    className='mapping__subelement-container'
                                >
                                    <div className='mapping__subelement-title'>{synonym}</div>
                                    <i 
                                        onClick={onDeleteSynonym(synonymIndex)}
                                        className="pi pi-times mapping__delete-icon" 
                                        style={{ fontSize: '1rem' }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
                <InputText 
                    value={editingSynonym} 
                    onChange={onEditCurrentSynonym}
                    onKeyUp={onDetectEnter('syn')}
                    placeholder="New synonym"
                    className='mapping__input'
                />
            </>
        )
    }

    const renderCompanies = () => {
        return (
            <>
                <div className='mapping_block-explanation'>
                    {"List all the conccurent companies you can find. It will help you better understand the market, gather new keywords, and find more candidates."}
                </div>
                {companies?.length > 0 && (
                    <div className='mapping__subelements'>
                        {companies?.map((company, companyIndex) => {
                            return (
                                <div 
                                    key={`syn-${companyIndex}`}
                                    className='mapping__subelement-container'
                                >
                                    <div className='mapping__subelement-title'>{company}</div>
                                    <i 
                                        onClick={onDeleteCompany(companyIndex)}
                                        className="pi pi-times mapping__delete-icon" 
                                        style={{ fontSize: '1rem' }}
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
                <InputText 
                    value={editingCompany} 
                    onChange={onEditCurrentCompany}
                    onKeyUp={onDetectEnter('comp')}
                    placeholder="New company"
                    className='mapping__input'
                />
            </>
        )
    }

    const blocks = [
        {
            label: 'Synonyms',
            id: 'syn',
            renderFunction: renderSynonyms,
        }, {
            label: 'Companies',
            id: 'comp',
            renderFunction: renderCompanies,
        }
    ]

    return (
        <div 
            className="mapping__container" style={{ padding: '50px 100px' }}
            onClick={onBackgroundClick}    
        >
            <div className='mapping__inner-container'>
                <div className='mapping__column'>
                    <InputText 
                        value={mappingName} 
                        onChange={onEditMappingName}
                        onKeyUp={onDetectEnter('mapingName')}
                        placeholder="Mapping Name"
                        className='mapping__input'
                    />
                    {blocks.map(block => (
                        <div 
                            key={`block-${block?.id}`} 
                            className={`mapping__block-container`}
                            onClick={onActivateBlock(block?.id)}
                        >
                            <div className='mapping__block-link-up' />
                            <div className={`mapping__block-inner${activeBlock === block?.id ? ' mapping__block-inner--active' : ''}`}>
                                {block?.label}
                                <div className={`mapping__block-content${activeBlock === block?.id ? ' mapping__block-content--active' : ''}`}>
                                    {block?.renderFunction()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <div className='mapping__blocks-container'>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default LeetsyMapping