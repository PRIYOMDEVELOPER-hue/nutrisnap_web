import { useState } from 'react'
import { BarcodeIcon, SearchIcon } from '../icons/Icons'

// Mock barcode database
const BARCODE_DB = {
  '012000030918': { name: 'Pepsi Cola (355ml)', calories: 150, protein: 0, carbs: 41, fat: 0 },
  '038000138416': { name: 'Kellogg\'s Corn Flakes (30g)', calories: 100, protein: 2, carbs: 24, fat: 0 },
  '021130126026': { name: 'Quaker Oats (40g)', calories: 150, protein: 5, carbs: 27, fat: 3 },
  '070038636892': { name: 'Peanut Butter (2 tbsp)', calories: 190, protein: 8, carbs: 6, fat: 16 },
}

export default function BarcodeScanner({ onResult, onBack }) {
  const [manualCode, setManualCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [searching, setSearching] = useState(false)

  const lookup = async (code) => {
    setError('')
    setSearching(true)
    await new Promise(r => setTimeout(r, 600))
    setSearching(false)

    const found = BARCODE_DB[code]
    if (found) {
      setResult(found)
    } else {
      // Try Open Food Facts
      setError('Product not found. Try entering manually below.')
    }
  }

  return (
    <div className="px-5 pb-6">
      {/* Viewfinder mockup */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-4"
           style={{ aspectRatio: '4/3' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <BarcodeIcon size={64} className="text-white/20" />
        </div>
        {/* Scanner line animation */}
        <div className="absolute left-8 right-8 h-0.5 bg-brand-400 top-1/2 animate-pulse" />
        {/* Corner markers */}
        {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
          <div key={i} className={`absolute w-6 h-6 border-2 border-white/60 ${pos}
            ${i < 2 ? 'border-b-0' : 'border-t-0'}
            ${i % 2 === 0 ? 'border-r-0' : 'border-l-0'}`} />
        ))}
        <p className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs">
          Point camera at barcode
        </p>
      </div>

      {/* Manual code input */}
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          placeholder="Enter barcode manually..."
          value={manualCode}
          onChange={e => setManualCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup(manualCode)}
        />
        <button
          onClick={() => lookup(manualCode)}
          disabled={!manualCode || searching}
          className="btn-primary px-4"
        >
          {searching ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <SearchIcon size={18} className="text-white" />
          )}
        </button>
      </div>

      {/* Quick test barcodes */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Quick test:</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(BARCODE_DB).slice(0, 3).map(([code, item]) => (
            <button
              key={code}
              onClick={() => { setManualCode(code); lookup(code) }}
              className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
                         px-2 py-1 rounded-lg font-mono hover:bg-brand-50 hover:text-brand-600
                         dark:hover:bg-brand-950/30 transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl mb-4">
          {error}
        </p>
      )}

      {result && (
        <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800
                        rounded-2xl p-4 mb-4">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{result.name}</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs font-bold text-flame">🔥 {result.calories} cal</span>
            <span className="text-xs text-red-500">🍗 {result.protein}g</span>
            <span className="text-xs text-amber-500">🌾 {result.carbs}g</span>
            <span className="text-xs text-blue-500">🫐 {result.fat}g</span>
          </div>
          <button
            onClick={() => onResult(result)}
            className="mt-3 w-full btn-primary py-2 text-sm"
          >
            Use This
          </button>
        </div>
      )}

      <button onClick={onBack} className="w-full btn-secondary py-2.5 text-sm">Back</button>
    </div>
  )
}
