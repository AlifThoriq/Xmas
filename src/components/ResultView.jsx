export default function ResultView({ stripUrl, onDownload, onPrint, onRetake }) {
    return (
        <>
            <div className="result no-print">
                <img className="result__strip" src={stripUrl} alt="Photo strip" />
                <div className="result__actions">
                    <h2>Hasil kamu</h2>
                    <button className="btn btn--primary" onClick={onDownload}>
                        Download PNG <kbd>D</kbd>
                    </button>
                    <button className="btn" onClick={onPrint}>
                        Print <kbd>P</kbd>
                    </button>
                    <button className="btn btn--ghost" onClick={onRetake}>
                        Foto lagi <kbd>R</kbd>
                    </button>
                </div>
            </div>

            {/* hanya muncul saat print */}
            <div className="print-only">
                <img src={stripUrl} alt="" />
            </div>
        </>
    )
}