// Grayscale -> kontras -> S-curve -> peta warna duotone (sepia) -> grain
export function applyBoothFilter(ctx, w, h, opts) {
    const { contrast, brightness, grain, shadow, highlight } = opts
    const img = ctx.getImageData(0, 0, w, h)
    const d = img.data

    const [sr, sg, sb] = shadow
    const dr = highlight[0] - sr
    const dg = highlight[1] - sg
    const db = highlight[2] - sb

    for (let i = 0; i < d.length; i += 4) {
        let v = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255
        v = (v - 0.5) * contrast + 0.5 + brightness
        v = v < 0 ? 0 : v > 1 ? 1 : v
        v = v * v * (3 - 2 * v) // S-curve (smoothstep)

        const n = (Math.random() - 0.5) * grain
        // Uint8ClampedArray otomatis clamp 0..255
        d[i] = sr + dr * v + n
        d[i + 1] = sg + dg * v + n
        d[i + 2] = sb + db * v + n
    }

    ctx.putImageData(img, 0, 0)
}