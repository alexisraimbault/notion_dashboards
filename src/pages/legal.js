import React from 'react'

const Legal = () => {
  return (
    <div className="legal__container">
        <div className="legal__title">{"Privacy Policy"}</div>
        <div className="legal__content">{"At WizeCharts, we respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information."}</div>
        <div className="legal__title">{"Information We Collect"}</div>
        <div className="legal__content">{"We only collect information necessary to provide our service. This includes the chart data and the chart settings that are registered by ChatGPT or the user himself."}</div>
        <div className="legal__title">{"How We Use Your Information"}</div>
        <div className="legal__content">{"We use the information we collect to generate the charts as per your request. We do not share your information with third parties unless it's necessary to provide our service or we're legally obligated to do so."}</div>
        <div className="legal__title">{"How We Protect Your Information"}</div>
        <div className="legal__content">{"We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential."}</div>
        <div className="legal__title">{"Terms of Service"}</div>
        <div className="legal__subcontent">{"By using WizeCharts, you agree to the following terms and conditions:"}</div>
        <div className="legal__subcontent legal__subcontent--spaced">{"1 - You will not use WizeCharts for any unlawful purposes or to conduct any unlawful activity."}</div>
        <div className="legal__subcontent legal__subcontent--spaced">{"2 - You are responsible for all the data and information you input into WizeCharts."}</div>
        <div className="legal__subcontent legal__subcontent--spaced">{"3 - We reserve the right to modify or terminate the service for any reason, without notice at any time."}</div>
        <div className="legal__subcontent legal__subcontent--spaced legal__subcontent--bottom-spaced">{"4 - We reserve the right to alter these Terms of Service at any time."}</div>
        <div className="legal__title">{"Cookie Policy"}</div>
        <div className="legal__content">{"WizeCharts does not use cookies."}</div>
        <div className="legal__title">{"Disclaimer"}</div>
        <div className="legal__content">{"WizeCharts is provided on an 'as is' basis without any warranties of any kind. We disclaim all liability for damages of any kind arising out of the use or inability to use our services. While we strive to provide accurate chart generation, we do not guarantee the accuracy or completeness of any information provided by our plugin."}</div>
    </div>
  )
}

export default Legal
