import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CONFIG } from './config'
import { TEMPLATES } from './templates'
import { useCamera } from './hooks/useCamera'
import { captureFrame } from './lib/capture'
import { composeStrip } from './lib/strip'
import { downloadCanvas, todayLabel } from './lib/output'
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
  const [shots, setShots] = useState([]) // foto mentah (sudah difilter)
  const [musicOn, setMusicOn] = useState(true)

  // Template dipilih di awal; teks diisi di akhir
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id)
  const [title, setTitle] = useState(CONFIG.defaultTitle)
  const [subtitle, setSubtitle] = useState(todayLabel)

  const runningRef = useRef(false)
  const audioRef = useRef(null)

  // Strip dirender ulang setiap teks berubah (foto tidak diambil ulang)
  const dTitle = useDeferredValue(title)
  const dSubtitle = useDeferredValue(subtitle)

  const strip = useMemo(
    () =>
      shots.length
        ? composeStrip(shots, { templateId, title: dTitle, subtitle: dSubtitle })
        : null,
    [shots, templateId, dTitle, dSubtitle],
  )
  const stripUrl = useMemo(() => (strip ? strip.toDataURL('image/png') : null), [strip])

  const startSession = useCallback(async () => {
    if (runningRef.current || !ready) return
    runningRef.current = true

    setPhase('shooting')
    setShotCount(0)
    if (musicOn) audioRef.current?.play().catch(() => { })

    const taken = []
    for (let i = 0; i < takes; i++) {
      for (let s = CONFIG.countdownSeconds; s > 0; s--) {
        setCountdown(s)
        await wait(1000)
      }
      setCountdown(null)

      taken.push(captureFrame(videoRef.current))
      setShotCount(i + 1)

      setFlash(true)
      await wait(150)
      setFlash(false)

      if (i < takes - 1) await wait(CONFIG.pauseBetweenTakes)
    }

    setShots(taken)
    setPhase('result')
    runningRef.current = false
  }, [ready, takes, musicOn, videoRef])

  const handleDownload = useCallback(() => {
    if (strip) downloadCanvas(strip)
  }, [strip])

  const handlePrint = useCallback(() => window.print(), [])

  const retake = useCallback(() => {
    setShots([])
    setShotCount(0)
    setTitle(CONFIG.defaultTitle) // sesi berikutnya mulai dari teks bawaan
    setSubtitle(todayLabel())
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

      // Jangan ganggu saat mengetik di input
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

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

  const settings = { templateId, onTemplate: setTemplateId }

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
          settings={settings}
        />
      </div>

      {phase === 'result' && (
        <ResultView
          stripUrl={stripUrl}
          title={title}
          onTitle={setTitle}
          subtitle={subtitle}
          onSubtitle={setSubtitle}
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