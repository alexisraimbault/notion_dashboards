export default async function handler(req, res) {
    const body = JSON.parse(req.body)
    console.log({body})
    const notionApiKey = body.notionApiKey
    const queryText = body.queryText
    console.log({notionApiKey})

    const notionIntegrationClientId = "e1ec6c09-bbde-449f-a5e1-d9e8a4aa582d"
    const notionIntegrationClientSecret = "secret_mILEebhBUG7gUshPxnNRIPZN2ZAiO5vet9yPDdxCmGL"

    try {
        const notionRes = await fetch('https://api.notion.com/v1/search', {
            method: 'post',
            headers: new Headers({
                'Authorization': `Bearer ${notionApiKey}`,
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*',
                'Notion-Version': '2022-06-28'
            }),
            body: JSON.stringify({
                'query': queryText,
                'filter': {
                    'value': 'database',
                    'property': 'object'
                }
            })
        })

        console.log({notionRes})
        const response = await notionRes.json()
        console.log({response})

        res.status(200).json({...response})
    } catch(e) {
        console.log(e)
        res.status(401).json({ error: e })
    }
}
