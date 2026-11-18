import { useMemo } from 'react'
import { CONFIG } from '../config'
import { composeStrip } from '../lib/strip'
import { todayLabel } from '../lib/output'

// Foto contoh (siluet), dibuat sekali saja
let placeholder = null
function getPlaceholder() {
    if (placeholder) return placeholder

    const w = 240
    const h = Math.round(w / CONFIG.photoAspect)
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')

    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, '#b8ad9a')
    g.addColorStop(1, '#6d6558')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#2b2620'
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.42, w * 0.17, 0, Math.PI * 2) // kepala
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 1.02, w * 0.42, h * 0.3, 0, Math.PI, 0) // bahu
    ctx.fill()

    placeholder = c
    return c
}

export default function StripPreview({ templateId, takes }) {
    const url = useMemo(() => {
        const canvas = composeStrip(Array(takes).fill(getPlaceholder()), {
            templateId,
            title: CONFIG.defaultTitle,
            subtitle: todayLabel(),
            scale: 0.3,
        })
        return canvas.toDataURL('image/png')
    }, [templateId, takes])

    return (
        <div className="preview">
            <span className="settings__label">PREVIEW</span>
            <img className="preview__img" src={url} alt="Preview strip" />
        </div>
    )
}