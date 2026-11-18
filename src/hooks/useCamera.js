import { useEffect, useRef, useState } from 'react'

export function useCamera() {
    const videoRef = useRef(null)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let stream = null
        let cancelled = false

        async function start() {
            if (!navigator.mediaDevices?.getUserMedia) {
                setError('Kamera tidak tersedia. Buka lewat http://localhost atau HTTPS.')
                return
            }
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        facingMode: 'user',
                    },
                    audio: false,
                })
                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop())
                    return
                }
                const video = videoRef.current
                video.srcObject = stream
                await video.play()
                setReady(true)
            } catch (e) {
                if (cancelled) return
                if (e.name === 'NotAllowedError') setError('Izin kamera ditolak. Aktifkan di pengaturan browser.')
                else if (e.name === 'NotFoundError') setError('Kamera tidak ditemukan.')
                else if (e.name === 'NotReadableError') setError('Kamera sedang dipakai aplikasi lain.')
                else setError('Gagal membuka kamera: ' + e.message)
            }
        }

        start()
        return () => {
            cancelled = true
            stream?.getTracks().forEach((t) => t.stop())
        }
    }, [])

    return { videoRef, ready, error }
}