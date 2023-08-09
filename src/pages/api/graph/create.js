import { NextApiHandler } from 'next'
import { createClient } from '@supabase/supabase-js'


const handler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    console.log('BODY : ', req.body)

    const data = req.body?.data
    const settings = req.body?.settings
    let separator = req.body?.separator || ";"

    const rows = data.split('\n')
    
    if (rows.length <= 1) {
        res.status(405).send({ message: 'Data not correctly formatted' })
        return
    }
    
    const keys = []
    const items = []
    let cptRow = 0
    let cptRowItem = 0
    
    rows.forEach(row => {
        cptRowItem = 0
        let currentItem = {}
        if(cptRow === 0) {
            if(separator === ";" && row.split(separator).length <= 1 &&  row.split(",").length > 1 ) {
                separator = ","
            }
            if(separator === "," && row.split(separator).length <= 1 &&  row.split(";").length > 1 ) {
                separator = ";"
            }
        }

        row.split(separator).forEach(rowItem => {
            if(cptRow === 0) {
                keys.push(rowItem)
            } else {
                currentItem[keys[cptRowItem]] = rowItem
            }
            cptRowItem += 1
        })

        if(cptRow > 0) {
            items.push(currentItem)
        }

        cptRow += 1
    });

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    let { data: supabaseResponse, error } = await supabase
      .from('GPT_GRAPHS')
      .insert({ data: items, settings})
      .select()

    const gptGraphId = supabaseResponse[0]?.id

    const screenshotAPIRes = await fetch(`https://europe-west2-wize-tables.cloudfunctions.net/screenshot_function?graph_id=${gptGraphId}`)
    const screenshotAPIResponse = await screenshotAPIRes.json()

    res.status(200).json({ 
        preview_url: `${process.env.NEXT_PUBLIC_BASE_URL}/view/${gptGraphId}`,
        edit_url: `${process.env.NEXT_PUBLIC_BASE_URL}/edit/${gptGraphId}`,
        image_url: screenshotAPIResponse?.screenshotUrl
    })
}

export default handler