export default function TextFields({ title, onTitle, subtitle, onSubtitle }) {
    // Enter / Esc melepas fokus, supaya shortcut D / P / R aktif lagi
    const releaseFocus = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur()
    }

    return (
        <div className="settings">
            <div className="settings__group">
                <span className="settings__label">JUDUL</span>
                <input
                    className="field"
                    value={title}
                    maxLength={32}
                    placeholder="Judul di bawah strip"
                    onChange={(e) => onTitle(e.target.value)}
                    onKeyDown={releaseFocus}
                />
            </div>

            <div className="settings__group">
                <span className="settings__label">SUB-JUDUL</span>
                <input
                    className="field"
                    value={subtitle}
                    maxLength={32}
                    placeholder="Tanggal / nama / apa saja"
                    onChange={(e) => onSubtitle(e.target.value)}
                    onKeyDown={releaseFocus}
                />
            </div>

            <p className="hint">Tekan Enter kalau sudah selesai mengetik</p>
        </div>
    )
}