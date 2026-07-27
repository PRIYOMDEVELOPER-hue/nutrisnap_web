// All SVG icons used in the app
export function HomeIcon({ size = 24, filled = false, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {filled
        ? <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
        : <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      }
    </svg>
  )
}

export function ChartBarIcon({ size = 24, filled = false, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {filled
        ? <><rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor"/>
            <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor"/>
            <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor"/></>
        : <><rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="17" y="4" width="4" height="17" rx="1" stroke="currentColor" strokeWidth="1.8"/></>
      }
    </svg>
  )
}

export function UserIcon({ size = 24, filled = false, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {filled
        ? <><circle cx="12" cy="8" r="4" fill="currentColor"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor"/></>
        : <><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" fill="none"/></>
      }
    </svg>
  )
}

export function PlusIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export function FlameIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C9 7 6 9.5 6 14a6 6 0 0012 0c0-2.5-1-5-2-6-1 2.5-2.5 3-2.5 3S14 9 12 2z"
        fill="currentColor"/>
    </svg>
  )
}

export function ProteinIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <ellipse cx="10" cy="11" rx="6" ry="7" fill="currentColor" opacity="0.9"/>
      <circle cx="10" cy="6" r="3" fill="currentColor"/>
    </svg>
  )
}

export function CarbsIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 2c-1 2-4 4-4 7a4 4 0 008 0c0-3-3-5-4-7z" fill="currentColor"/>
      <path d="M7 16c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

export function FatIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="8" cy="10" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="14" cy="10" r="3.5" fill="currentColor"/>
    </svg>
  )
}

export function WaterIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 2C7 7 4 10 4 13a6 6 0 0012 0c0-3-3-6-6-11z" fill="currentColor"/>
    </svg>
  )
}

export function CameraIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}

export function BarcodeIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 9V5h4M17 5h4v4M3 15v4h4M17 19h4v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="7" y1="8" x2="7" y2="16" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="9.5" y1="8" x2="9.5" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
      <line x1="14.5" y1="8" x2="14.5" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="17" y1="8" x2="17" y2="16" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
}

export function MicIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function SearchIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M16 16l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function ChevronRightIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function SunIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="4" fill="currentColor"/>
      <line x1="10" y1="2" x2="10" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="2" y1="10" x2="4" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="14.36" y1="14.36" x2="15.78" y2="15.78" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="14.36" y1="5.64" x2="15.78" y2="4.22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="4.22" y1="15.78" x2="5.64" y2="14.36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function MoonIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M17.5 12A7.5 7.5 0 018 2.5a7.5 7.5 0 100 15 7.5 7.5 0 009.5-5.5z" fill="currentColor"/>
    </svg>
  )
}

export function XIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function CheckIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10l5 5 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ArrowRightIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ImageIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ShareIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 3v10M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 13v3a1 1 0 001 1h10a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export function TrashIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M2 4h14M6 4V2h6v2M7 8v6M11 8v6M3 4l1 12h10L15 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
