import CircularProgress from './CircularProgress'

const MACRO_CONFIG = {
  protein: { color: '#ef4444', label: 'Protein', unit: 'g' },
  carbs:   { color: '#f59e0b', label: 'Carbs',   unit: 'g' },
  fat:     { color: '#3b82f6', label: 'Fat',      unit: 'g' },
}

export default function MacroRing({ type, value, max }) {
  const cfg = MACRO_CONFIG[type]
  return (
    <div className="flex flex-col items-center gap-2">
      <CircularProgress value={value} max={max} size={80} strokeWidth={7} color={cfg.color}>
        <span className="text-lg" role="img" aria-label={type}>
          {type === 'protein' ? '🍗' : type === 'carbs' ? '🌾' : '🫐'}
        </span>
      </CircularProgress>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-900 dark:text-white">
          <span style={{ color: cfg.color }}>{value}</span>
          <span className="text-gray-400">/{max}{cfg.unit}</span>
        </p>
        <p className="text-[10px] text-gray-400">{cfg.label} eaten</p>
      </div>
    </div>
  )
}
