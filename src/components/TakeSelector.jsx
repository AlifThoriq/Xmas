export default function TakeSelector({ options, value, onChange, disabled }) {
    return (
        <div className="takes">
            <span className="takes__label">TAKES</span>
            {options.map((n) => (
                <button
                    key={n}
                    className={'pill' + (n === value ? ' pill--active' : '')}
                    disabled={disabled}
                    onClick={() => onChange(n)}
                >
                    {n}
                </button>
            ))}
        </div>
    )
}