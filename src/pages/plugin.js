
import React, {useState, useEffect} from 'react'
import Image from 'next/image'

const Landing = () => {
  return (
    <div className="plugin-landing__container">
        <div className="plugin-landing__topbar">
            <div className='plugin-landing__logo-container'>
                <Image src="/iron_notes.svg" alt="Logo" width="43" height="43" />
            </div>
            <div className='plugin-landing__app-name'>
                {"WizeCharts"}
            </div>
            <div className='plugin-landing__app-secondary'>
                {"Chat GPT Plugin"}
            </div>
        </div>
        <div className='plugin-landing__content-container'>
            <div className="plugin-landing__title">{"Powerful Data Visualisation inside ChatGPT"}</div>
            <div className="plugin-landing__subtitle">{"Create and share beatiful and highly customizable charts in seconds !"}</div>
            <div className="plugin-landing__card">
                <div className="plugin-landing__flow">
                    <div className="plugin-landing__flow-item">
                        <Image src="/ChatGPT_logo.png" alt="Logo" width="83" height="83" />
                        <div className="plugin-landing__flow-name">{'Chat GPT'}</div>
                    </div>
                    <i 
                        className="pi pi-arrows-h plugin-landing__arrows" 
                        style={{ fontSize: '5rem' }}
                    />
                    <div className="plugin-landing__flow-item">
                        <div className="plugin-landing__flow-logo">
                            <Image src="/iron_notes.svg" alt="Logo" width="80" height="80" />
                        </div>
                        <div className="plugin-landing__flow-name">{'WizeCharts'}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="plugin-landing__install-section">
            <div className="plugin-landing__section-title">{"How to install it ?"}</div>
            <div className="plugin-landing__install-inner">
                <div className="plugin-landing__git-container">
                    <Image src="/zoomed_installl_gif.gif" alt="install_gif" width="640" height="360" />
                </div>
                <div className="plugin-landing__install-instructions">
                    {/* <div className="plugin-landing__section-subtitle">{'Nothing Easier !'}</div> */}
                    <div className="plugin-landing__section-item">{'Go to the plugin store'}</div>
                    <div className="plugin-landing__section-item">{'Search for "WizeCharts"'}</div>
                    <div className="plugin-landing__section-item">{'Click "Install"'}</div>
                </div>
            </div>
        </div>
        <div className="plugin-landing__use-section">
            <div className="plugin-landing__section-title">{"How to use it ?"}</div>
            <div className="plugin-landing__section-subtitle">{'Just talk to Chat GPT !'}</div>
            <div className="plugin-landing__section-item">{'He will understand when the answer to your question can be enriched with a chart'}</div>
            <div className='plugin-landing__gpt-preview'>
                <div className='plugin-landing__gpt-profile'>{'A'}</div>
                <div className='plugin-landing__gpt-question'>{'Can you show me the repartition of the population by continent ?'}</div>
            </div>
            <div className="plugin-landing__section-item">{'You can be more specific about what kind of chart you want, and the data you want to be displayed'}</div>
            <div className='plugin-landing__gpt-preview'>
                <div className='plugin-landing__gpt-profile'>{'A'}</div>
                <div className='plugin-landing__gpt-question'>{'Show me a pie chart of my expenses grouped by category'}</div>
            </div>
            <div className="plugin-landing__section-item">{'You can also provide your detailled data or ask him to do research for you'}</div>
            <div className="plugin-landing__section-item">{'Then you can go even further and ask for an edition link.'}</div>
            <div className="plugin-landing__section-item">{'You will be able to edit your chart, change its type, the Axis sorting, the visuals, the data grouping, and a lot more !'}</div>
            <div className="plugin-landing__bottom-img">
                <Image src="/iron_notes.svg" alt="Logo" width="60" height="60" />
            </div>
        </div>
        <div className="plugin-landing__bottombar">
            <div className="plugin-landing__bottombar-rights">{"© 2023 WizeCharts. All rights reserved."}</div>
        </div>
    </div>
  )
}

export default Landing