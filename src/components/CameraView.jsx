import { CONFIG } from '../config'
import TakeSelector from './TakeSelector'
import StripSettings from './StripSettings'
import StripPreview from './StripPreview'

export default function CameraView({
    videoRef,
    ready,
    error,
    shooting,
    countdown,
    flash,
    takes,
    onTakesChange,
    shotCount,
    onShutter,
    settings,
}) {
    return (
        <div className="booth-layout">
            {/* kolom kiri kosong, supaya kamera tepat di tengah layar */}
            <div />

            <div className="booth">
                <div className="frame">
                    <video
                        ref={videoRef}
                        className={'frame__video' + (CONFIG.mirror ? ' mirror' : '')}
                        playsInline
                        muted
                    />
                    {!ready && !error && <div className="frame__msg">Menyalakan kamera…</div>}
                    {error && <div className="frame__msg frame__msg--error">{error}</div>}
                    {countdown !== null && (
                        <div key={countdown} className="frame__count">
                            {countdown}
                        </div>
                    )}
                    <div className={'frame__flash' + (flash ? ' on' : '')} />
                </div>

                <div className="dots">
                    {Array.from({ length: takes }, (_, i) => (
                        <span key={i} className={'dot' + (i < shotCount ? ' dot--done' : '')} />
                    ))}
                </div>

                <button
                    className="shutter"
                    onClick={onShutter}
                    disabled={!ready || shooting}
                    aria-label="Mulai foto"
                />

                <p className="hint">
                    {shooting
                        ? `Foto ${Math.min(shotCount + 1, takes)} / ${takes}`
                        : 'Tekan SPACE untuk mulai'}
                </p>

                <TakeSelector
                    options={CONFIG.takeOptions}
                    value={takes}
                    onChange={onTakesChange}
                    disabled={shooting}
                />
            </div>

            {/* panel kanan: template (atas) + preview (bawah) */}
            <aside className="side">
                <StripSettings {...settings} disabled={shooting} />
                <StripPreview templateId={settings.templateId} takes={takes} />
            </aside>
        </div>
    )
}