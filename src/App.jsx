import { useCallback, useEffect, useRef, useState } from 'react'
import { CONFIG } from './config'
import { useCamera } from './hooks/useCamera'
import { captureFrame } from './lib/capture'
import { composeStrip } from './lib/strip'
import { downloadCanvas } from './lib/output'
import CameraView from './components/CameraView'
import ResultView from './components/ResultView'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function App() {
  const { videoRef, ready, error } = useCamera()

  const [phase, setPhase] = useState('idle') // idle | shooting | result
  const [takes, setTakes] = useState(CONFIG.defaultTakes)
  const [shotCount, setShotCount] = useState(0)
  const [countdown, setCountdown] = useState(null)
  const [flash, setFlash] = useState(false)
  const [stripUrl, setStripUrl] = useState(null)
  const [musicOn, setMusicOn] = useState(true)

  const stripCanvasRef = useRef(null)
  const runningRef = useRef(false)
  const audioRef = useRef(null)

  const startSession = useCallback(async () => {
    if (runningRef.current || !ready) return
    runningRef.current = true

    setPhase('shooting')
    setShotCount(0)
    if (musicOn) audioRef.current?.play().catch(() => { })

    const shots = []
    for (let i = 0; i < takes; i++) {
      for (let s = CONFIG.countdownSeconds; s > 0; s--) {
        setCountdown(s)
        await wait(1000)
      }
      setCountdown(null)

      shots.push(captureFrame(videoRef.current))
      setShotCount(i + 1)

      setFlash(true)
      await wait(150)
      setFlash(false)

      if (i < takes - 1) await wait(CONFIG.pauseBetweenTakes)
    }

    const strip = composeStrip(shots)
    stripCanvasRef.current = strip
    setStripUrl(strip.toDataURL('image/png'))
    setPhase('result')
    runningRef.current = false
  }, [ready, takes, musicOn, videoRef])

  const handleDownload = useCallback(() => {
    if (stripCanvasRef.current) downloadCanvas(stripCanvasRef.current)
  }, [])

  const handlePrint = useCallback(() => window.print(), [])

  const retake = useCallback(() => {
    setStripUrl(null)
    setShotCount(0)
    setPhase('idle')
  }, [])

  const toggleMusic = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      a.play().catch(() => { })
      setMusicOn(true)
    } else {
      a.pause()
      setMusicOn(false)
    }
  }

  // Shortcut keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return
      if (e.code === 'Space') {
        e.preventDefault()
        document.activeElement?.blur()
        if (phase === 'idle') startSession()
        return
      }
      if (phase === 'result') {
        const k = e.key.toLowerCase()
        if (k === 'd') handleDownload()
        if (k === 'p') handlePrint()
        if (k === 'r') retake()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, startSession, handleDownload, handlePrint, retake])

  return (
    <div className="app">
      {/* Kamera tetap hidup di belakang saat preview, supaya "Foto lagi" instan */}
      <div className={'stage no-print' + (phase === 'result' ? ' stage--hidden' : '')}>
        <CameraView
          videoRef={videoRef}
          ready={ready}
          error={error}
          shooting={phase === 'shooting'}
          countdown={countdown}
          flash={flash}
          takes={takes}
          onTakesChange={setTakes}
          shotCount={shotCount}
          onShutter={startSession}
        />
      </div>

      {phase === 'result' && (
        <ResultView
          stripUrl={stripUrl}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onRetake={retake}
        />
      )}

      {CONFIG.music && <audio ref={audioRef} src={CONFIG.music} loop />}
      {CONFIG.music && (
        <button className="music-btn no-print" onClick={toggleMusic}>
          MUSIC {musicOn ? 'ON' : 'OFF'}
        </button>
      )}
    </div>
  )
}