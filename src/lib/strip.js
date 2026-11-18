import { CONFIG } from '../config'

// Susun array canvas foto jadi 1 canvas strip vertikal
export function composeStrip(shots) {
    const { stripWidth: W, stripPadding: P, stripGap: G, footerHeight: F, photoAspect, paper, ink, footerText } = CONFIG

    const n = shots.length
    const pw = W - P * 2
    const ph = Math.round(pw / photoAspect)
    const footer = footerText ? F : P
    const y0 = P + n * ph + (n - 1) * G // posisi awal footer
    const H = y0 + footer

    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = paper
    ctx.fillRect(0, 0, W, H)

    shots.forEach((shot, i) => {
        const y = P + i * (ph + G)
        ctx.drawImage(shot, P, y, pw, ph)
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'
        ctx.lineWidth = 2
        ctx.strokeRect(P, y, pw, ph)
    })

    if (footerText) {
        const date = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        ctx.fillStyle = ink
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        if ('letterSpacing' in ctx) ctx.letterSpacing = '6px'
        ctx.font = '600 30px "Courier New", monospace'
        ctx.fillText(footerText, W / 2, y0 + F * 0.38)

        if ('letterSpacing' in ctx) ctx.letterSpacing = '3px'
        ctx.font = '22px "Courier New", monospace'
        ctx.fillText(date.toUpperCase(), W / 2, y0 + F * 0.7)
    }

    return canvas
}