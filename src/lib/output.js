export function downloadCanvas(canvas, name = 'photobooth') {
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${name}-${Date.now()}.png`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, 'image/png')
}

export const todayLabel = () =>
    new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })