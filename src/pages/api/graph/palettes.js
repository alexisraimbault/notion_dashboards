import { NextApiHandler } from 'next'
import { createClient } from '@supabase/supabase-js'


const handler = async (req, res) => {
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

    const palettes = [
        {
            number: 1,
            name: 'Purple Classic',
            colors: palette3,
            url: 'https://wizetables.com/classic.png'
        },
        {
            number: 2,
            name: 'Blues',
            colors: palette2,
            url: 'https://wizetables.com/blues.png'
        },
        {
            number: 3,
            name: 'Divergent',
            colors: palette1,
            url: 'https://wizetables.com/divergent.png'
        },
        {
            number: 4,
            name: 'Pastels',
            colors: palette4,
            url: 'https://wizetables.com/pastels.png'
        },
        {
            number: 5,
            name: 'Retro',
            colors: palette5,
            url: 'https://wizetables.com/retro.png'
        },
        {
            number: 6,
            name: 'Bright',
            colors: palette6,
            url: 'https://wizetables.com/bright.png'
        },
        {
            number: 7,
            name: 'Blue To Yellow',
            colors: palette7,
            url: 'https://wizetables.com/blue_to_yellow.png'
        },
    ]

    res.status(200).json({ 
        palettes,
    })
}

export default handler