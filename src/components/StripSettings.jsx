import { TEMPLATES } from '../templates'

export default function StripSettings({ templateId, onTemplate, disabled }) {
    return (
        <div className="settings">
            <div className="settings__group">
                <span className="settings__label">TEMPLATE</span>
                <div className="tpls">
                    {TEMPLATES.map((t) => (
                        <button
                            key={t.id}
                            className={'tpl' + (t.id === templateId ? ' tpl--active' : '')}
                            onClick={() => onTemplate(t.id)}
                            disabled={disabled}
                        >
                            <span
                                className="tpl__preview"
                                style={{
                                    background: t.paper,
                                    boxShadow:
                                        t.decor === 'frame'
                                            ? `inset 0 0 0 2px ${t.paper}, inset 0 0 0 3px ${t.ink}`
                                            : 'none',
                                }}
                            >
                                <i />
                                <i />
                                <i />
                                <b style={{ background: t.ink }} />
                            </span>
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}