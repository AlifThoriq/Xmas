import { CONFIG } from '../config'
import { applyBoothFilter } from './filter'

// Ambil 1 frame dari <video>: crop tengah sesuai aspect, mirror, lalu filter
export function captureFrame(video) {
    const vw = video.videoWidth
    const vh = video.videoHeight
    const aspect = CONFIG.photoAspect

    let cw, ch
    if (vw / vh > aspect) {
        ch = vh
        cw = Math.round(vh * aspect)
    } else {
        cw = vw
        ch = Math.round(vw / aspect)
    }
    const sx = Math.round((vw - cw) / 2)
    const sy = Math.round((vh - ch) / 2)

    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (CONFIG.mirror) {
        ctx.translate(cw, 0)
        ctx.scale(-1, 1)
    }
    ctx.drawImage(video, sx, sy, cw, ch, 0, 0, cw, ch)
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    applyBoothFilter(ctx, cw, ch, CONFIG.filter)
    return canvas
}