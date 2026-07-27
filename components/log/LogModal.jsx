import { useState, useRef, useEffect } from 'react'
import useStore from '../../store/useStore'
import { CameraIcon, BarcodeIcon, MicIcon, SearchIcon, XIcon, FlameIcon, CheckIcon } from '../icons/Icons'
import BarcodeScanner from './BarcodeScanner'
import VoiceLogger from './VoiceLogger'
import FoodSearch from './FoodSearch'

const MODES = [
  { id: 'camera',  label: 'Scan Food',   icon: CameraIcon,  color: 'bg-brand-500' },
  { id: 'barcode', label: 'Barcode',      icon: BarcodeIcon, color: 'bg-blue-500' },
  { id: 'voice',   label: 'Voice',        icon: MicIcon,     color: 'bg-purple-500' },
  { id: 'search',  label: 'Search',       icon: SearchIcon,  color: 'bg-amber-500' },
]

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export default function LogModal() {
  const { setLogModalOpen, addMealEntry } = useStore()
  const [mode, setMode] = useState(null)
  const [mealType, setMealType] = useState('lunch')
  const [pendingEntry, setPendingEntry] = useState(null)
  const [done, setDone] = useState(false)

  const handleConfirm = () => {
    if (!pendingEntry) return
    addMealEntry({
      ...pendingEntry,
      id: `m${Date.now()}`,
      meal_type: mealType,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    })
    setDone(true)
    setTimeout(() => setLogModalOpen(false), 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: '100vw' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setLogModalOpen(false)}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl
                      shadow-2xl overflow-hidden"
           style={{ maxHeight: '92vh' }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Log Food</h2>
          <button
            onClick={() => setLogModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <XIcon size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Meal type selector */}
        <div className="px-5 mb-4">
          <div className="flex gap-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
            {MEAL_TYPES.map(mt => (
              <button
                key={mt}
                onClick={() => setMealType(mt)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all
                  ${mealType === mt
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400'}`}
              >
                {mt}
              </button>
            ))}
          </div>
        </div>

        {/* Mode selector */}
        {!mode && !done && (
          <div className="px-5 pb-8">
            <div className="grid grid-cols-2 gap-3">
              {MODES.map(m => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`${m.color} rounded-2xl p-5 flex flex-col items-center gap-3
                      text-white hover:opacity-90 active:scale-95 transition-all shadow-lg`}
                  >
                    <Icon size={32} className="text-white" />
                    <span className="text-sm font-bold">{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Subcomponents */}
        {mode === 'camera' && !pendingEntry && (
          <CameraLogger onResult={setPendingEntry} onBack={() => setMode(null)} />
        )}
        {mode === 'barcode' && !pendingEntry && (
          <BarcodeScanner onResult={setPendingEntry} onBack={() => setMode(null)} />
        )}
        {mode === 'voice' && !pendingEntry && (
          <VoiceLogger onResult={setPendingEntry} onBack={() => setMode(null)} />
        )}
        {mode === 'search' && !pendingEntry && (
          <FoodSearch onResult={setPendingEntry} onBack={() => setMode(null)} />
        )}

        {/* Pending entry confirm */}
        {pendingEntry && !done && (
          <div className="px-5 pb-8 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            <NutritionPreview entry={pendingEntry} onChange={setPendingEntry} />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setPendingEntry(null)}
                className="flex-1 btn-secondary py-3"
              >
                ✦ Fix Results
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 btn-primary py-3"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {done && (
          <div className="flex flex-col items-center justify-center py-12 px-5">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mb-4">
              <CheckIcon size={32} className="text-white" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Logged!</p>
            <p className="text-sm text-gray-400 mt-1">Added to your {mealType}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Camera Logger (photo upload) ----
function CameraLogger({ onResult, onBack }) {
  const fileRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [stream, setStream] = useState(null)

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera on mobile
      })
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setStream(mediaStream)
      setCameraActive(true)
    } catch (err) {
      alert('Camera access denied. Please allow camera permission or upload a photo instead.')
      console.error('Camera error:', err)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setCameraActive(false)
    }
  }

  // Capture photo from video
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob)
      setPreview(url)
      stopCamera()
      analyzePhoto(url)
    }, 'image/jpeg', 0.9)
  }

  // Analyze photo
  const analyzePhoto = async (url) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)

    onResult({
      name: 'Caesar Salad with Cherry Tomatoes',
      calories: 330,
      protein: 8,
      carbs: 20,
      fat: 18,
      image_url: url,
      items: [
        { name: 'Lettuce', calories: 20, quantity: '1.5 cups' },
        { name: 'Cherry Tomatoes', calories: 30, quantity: '½ cup' },
        { name: 'Parmesan', calories: 80, quantity: '2 tbsp' },
        { name: 'Croutons', calories: 80, quantity: '¼ cup' },
        { name: 'Caesar Dressing', calories: 120, quantity: '2 tbsp' },
      ],
    })
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    analyzePhoto(url)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [])

  return (
    <div className="px-5 pb-6">
      {/* Camera view or preview */}
      {cameraActive ? (
        <div className="relative rounded-2xl overflow-hidden mb-4 bg-black" style={{ aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera controls overlay */}
          <div className="absolute inset-0 flex flex-col">
            {/* Top bar */}
            <div className="flex justify-between p-4">
              <button
                onClick={stopCamera}
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full
                         flex items-center justify-center text-white"
              >
                ✕
              </button>
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                🍎 NutriSnap
              </div>
              <div className="w-10" />
            </div>

            {/* Capture button */}
            <div className="flex-1" />
            <div className="flex justify-center pb-8">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300
                         shadow-xl hover:scale-110 active:scale-95 transition-all"
              />
            </div>
          </div>
        </div>
      ) : preview ? (
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
          <img src={preview} alt="Food" className="w-full h-full object-cover" />
          {loading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <p className="text-white text-sm font-semibold">Analyzing your meal...</p>
              <p className="text-white/70 text-xs">This may take a few seconds</p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700
                     flex flex-col items-center justify-center py-16 gap-4 mb-4
                     hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 
                     transition-all group"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full
                         flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-950/50
                         transition-colors">
            <CameraIcon size={36} className="text-gray-400 group-hover:text-brand-600 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">
              Upload or capture a photo
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI will identify your food instantly
            </p>
          </div>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1 py-3 text-sm">
          Back
        </button>
        {!cameraActive && !preview && (
          <button
            onClick={startCamera}
            className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
          >
            <CameraIcon size={18} />
            Open Camera
          </button>
        )}
        {preview && !loading && (
          <button
            onClick={() => { setPreview(null); startCamera() }}
            className="btn-primary flex-1 py-3 text-sm"
          >
            Retake
          </button>
        )}
      </div>
    </div>
  )
}

// ---- Nutrition Preview / Editor ----
function NutritionPreview({ entry, onChange }) {
  const handleField = (field, value) => {
    onChange(prev => ({ ...prev, [field]: Number(value) }))
  }

  return (
    <div>
      {/* Photo */}
      {entry.image_url && (
        <div className="rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
          <img src={entry.image_url} alt={entry.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Name + serving */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <input
            className="input text-base font-semibold mb-1 w-full"
            value={entry.name}
            onChange={e => onChange(p => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl ml-3">
          <button className="px-3 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">−</button>
          <span className="px-2 text-sm font-semibold text-gray-900 dark:text-white">1</span>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">+</button>
        </div>
      </div>

      {/* Calories big card */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 mb-3">
        <FlameIcon size={28} className="text-gray-700 dark:text-gray-300 flex-shrink-0" />
        <div>
          <p className="text-xs text-gray-400">Calories</p>
          <input
            type="number"
            className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent w-28
                       focus:outline-none"
            value={entry.calories}
            onChange={e => handleField('calories', e.target.value)}
          />
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { field: 'protein', label: 'Protein', emoji: '🍗', color: 'text-red-500' },
          { field: 'carbs',   label: 'Carbs',   emoji: '🌾', color: 'text-amber-500' },
          { field: 'fat',     label: 'Fats',    emoji: '🫐', color: 'text-blue-500' },
        ].map(m => (
          <div key={m.field} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <p className="text-[10px] text-gray-400 mb-1">{m.emoji} {m.label}</p>
            <div className="flex items-baseline gap-0.5">
              <input
                type="number"
                className={`text-lg font-bold bg-transparent w-12 focus:outline-none ${m.color}`}
                value={entry[m.field]}
                onChange={e => handleField(m.field, e.target.value)}
              />
              <span className="text-xs text-gray-400">g</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ingredients list */}
      {entry.items && entry.items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Ingredients</p>
            <button className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
              + Add more
            </button>
          </div>
          <div className="space-y-2">
            {entry.items.map((item, i) => (
              <div key={i}
                className="flex items-center justify-between py-2.5 px-3
                           bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{item.calories} cal</span>
                  <span className="text-xs text-gray-400">{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
