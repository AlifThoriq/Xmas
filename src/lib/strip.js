import { CONFIG } from '../config'
import { getTemplate } from '../templates'

// PRNG deterministik: salju tidak "berkedip" tiap strip dirender ulang
function mulberry32(seed) {
    return function () {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// Kecilkan font sampai teks muat di lebar maksimum
function fitFont(ctx, text, maxWidth, size, weight, family) {
    let s = size
    ctx.font = `${weight} ${s}px ${family}`
    while (ctx.measureText(text).width > maxWidth && s > 12) {
        s -= 2
        ctx.font = `${weight} ${s}px ${family}`
    }
}

export function composeStrip(shots, { templateId, title = '', subtitle = '', scale = 1 } = {}) {
    const tpl = getTemplate(templateId)
    const W = CONFIG.stripWidth
    const P = tpl.padding
    const SP = tpl.sidePadding ?? P
    const G = tpl.gap

    const n = shots.length
    const pw = W - SP * 2
    const ph = Math.round(pw / CONFIG.photoAspect)

    const text1 = tpl.uppercase ? title.trim().toUpperCase() : title.trim()
    const text2 = tpl.uppercase ? subtitle.trim().toUpperCase() : subtitle.trim()
    const hasText = Boolean(text1 || text2)

    const y0 = P + n * ph + (n - 1) * G // awal area footer
    const H = y0 + (hasText ? tpl.footerHeight : P)

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(W * scale)
    canvas.height = Math.round(H * scale)
    const ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)

    // Latar
    ctx.fillStyle = tpl.paper
    ctx.fillRect(0, 0, W, H)

    // Dekorasi (digambar sebelum foto)
    if (tpl.decor === 'film') {
        ctx.fillStyle = tpl.holeColor
        const hw = 20
        const hh = 28
        for (let y = 18; y < H - hh; y += 46) {
            ctx.beginPath()
            ctx.roundRect((SP - hw) / 2, y, hw, hh, 5)
            ctx.roundRect(W - SP + (SP - hw) / 2, y, hw, hh, 5)
            ctx.fill()
        }
    }

    if (tpl.decor === 'snow') {
        const rnd = mulberry32(7)
        ctx.fillStyle = tpl.ink
        for (let i = 0; i < 90; i++) {
            const x = rnd() * W
            const y = rnd() * H
            const r = 1.2 + rnd() * 3
            ctx.globalAlpha = 0.25 + rnd() * 0.5
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.globalAlpha = 1
    }

    if (tpl.decor === 'frame') {
        ctx.strokeStyle = tpl.ink
        ctx.lineWidth = 3
        ctx.strokeRect(12, 12, W - 24, H - 24)
        ctx.lineWidth = 1
        ctx.strokeRect(20, 20, W - 40, H - 40)
    }

    // Foto
    shots.forEach((shot, i) => {
        const y = P + i * (ph + G)
        ctx.drawImage(shot, SP, y, pw, ph)
        if (tpl.border) {
            ctx.strokeStyle = tpl.border
            ctx.lineWidth = tpl.borderWidth
            ctx.strokeRect(SP, y, pw, ph)
        }
    })

    // Teks
    if (hasText) {
        const spacingOk = 'letterSpacing' in ctx
        const maxW = W - SP * 2
        const pos = text1 && text2 ? [0.36, 0.72] : [0.5, 0.5]

        ctx.fillStyle = tpl.ink
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        if (text1) {
            if (spacingOk) ctx.letterSpacing = `${tpl.spacing}px`
            fitFont(ctx, text1, maxW, tpl.titleSize, tpl.titleWeight, tpl.font)
            ctx.fillText(text1, W / 2, y0 + tpl.footerHeight * pos[0])
        }
        if (text2) {
            if (spacingOk) ctx.letterSpacing = `${Math.max(1, tpl.spacing / 2)}px`
            fitFont(ctx, text2, maxW, tpl.subSize, 400, tpl.font)
            ctx.fillText(text2, W / 2, y0 + tpl.footerHeight * pos[1])
        }
        if (spacingOk) ctx.letterSpacing = '0px'
    }

    return canvas
}