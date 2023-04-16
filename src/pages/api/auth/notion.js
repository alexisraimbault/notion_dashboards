export default async function handler(req, res) {
    const body = JSON.parse(req.body)
    const notionCode = body.code

    const notionIntegrationClientId = "e1ec6c09-bbde-449f-a5e1-d9e8a4aa582d"
    const notionIntegrationClientSecret = "secret_mILEebhBUG7gUshPxnNRIPZN2ZAiO5vet9yPDdxCmGL"

    try {
        const notionRes = await fetch('https://api.notion.com/v1/oauth/token', {
            method: 'post',
            headers: new Headers({
                'Authorization': `Basic ${btoa(`${notionIntegrationClientId}:${notionIntegrationClientSecret}`)}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }),
            body: JSON.stringify({
                grant_type: "authorization_code",
                code: notionCode, 
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/notioncallback`
            })
        })

        const response = await notionRes.json()
        console.log({response})

        res.status(200).json({...response})
    } catch(e) {
        console.log(e)
        res.status(401).json({ error: e })
    }
}
