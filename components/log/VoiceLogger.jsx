import { useState, useRef, useEffect } from 'react'
import { MicIcon, CheckIcon } from '../icons/Icons'

// Simulates NLP parsing of voice input
function parseVoiceInput(text) {
  const lower = text.toLowerCase()
  // Very basic keyword matching — in prod this uses OpenAI Whisper + GPT-4
  const foods = [
    { keywords: ['oatmeal', 'oats'], name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
    { keywords: ['banana'], name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
    { keywords: ['chicken', 'grilled chicken'], name: 'Grilled Chicken', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { keywords: ['salad', 'caesar'], name: 'Caesar Salad', calories: 330, protein: 8, carbs: 20, fat: 18 },
    { keywords: ['egg', 'eggs'], name: 'Scrambled Eggs (2)', calories: 180, protein: 12, carbs: 2, fat: 14 },
    { keywords: ['rice'], name: 'White Rice (1 cup)', calories: 206, protein: 4, carbs: 45, fat: 0.4 },
    { keywords: ['protein shake', 'shake', 'whey'], name: 'Protein Shake', calories: 130, protein: 25, carbs: 5, fat: 2 },
    { keywords: ['pizza'], name: 'Pizza Slice', calories: 285, protein: 12, carbs: 36, fat: 10 },
    { keywords: ['burger', 'hamburger'], name: 'Burger', calories: 540, protein: 28, carbs: 40, fat: 28 },
    { keywords: ['apple'], name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
    { keywords: ['yogurt', 'greek yogurt'], name: 'Greek Yogurt', calories: 150, protein: 17, carbs: 12, fat: 1 },
    { keywords: ['almond milk'], name: 'Almond Milk (250ml)', calories: 30, protein: 1, carbs: 1, fat: 2.5 },
    { keywords: ['coffee'], name: 'Black Coffee', calories: 5, protein: 0, carbs: 0, fat: 0 },
    { keywords: ['sandwich'], name: 'Turkey Sandwich', calories: 350, protein: 22, carbs: 38, fat: 12 },
  ]

  const matched = foods.filter(f => f.keywords.some(k => lower.includes(k)))

  if (matched.length === 0) {
    return { name: text, calories: 200, protein: 10, carbs: 20, fat: 8 }
  }

  // Combine all matched items
  return {
    name: matched.map(m => m.name).join(' + '),
    calories: matched.reduce((s, m) => s + m.calories, 0),
    protein: matched.reduce((s, m) => s + m.protein, 0),
    carbs: matched.reduce((s, m) => s + m.carbs, 0),
    fat: matched.reduce((s, m) => s + m.fat, 0),
  }
}

export default function VoiceLogger({ onResult, onBack }) {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')
  const [manualText, setManualText] = useState('')
  const recognitionRef = useRef(null)
  const [level, setLevel] = useState(0)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  // Animate voice level when recording
  useEffect(() => {
    if (!recording) return
    const interval = setInterval(() => {
      setLevel(Math.random() * 100)
    }, 150)
    return () => clearInterval(interval)
  }, [recording])

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Please type your meal below.')
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setRecording(true)
    recognition.onresult = (e) => {
      const t = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('')
      setTranscript(t)
    }
    recognition.onend = () => {
      setRecording(false)
      if (transcript || recognitionRef.current._finalTranscript) {
        const result = parseVoiceInput(transcript)
        setParsed(result)
      }
    }
    recognition.onerror = () => {
      setRecording(false)
      setError('Could not hear you. Please try again or type below.')
    }

    recognition.start()
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setRecording(false)
    if (transcript) {
      setParsed(parseVoiceInput(transcript))
    }
  }

  const handleManualParse = () => {
    if (!manualText.trim()) return
    setTranscript(manualText)
    setParsed(parseVoiceInput(manualText))
  }

  return (
    <div className="px-5 pb-6">
      {/* Voice visualizer */}
      <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 mb-4 flex flex-col items-center gap-4">
        {/* Animated bars */}
        <div className="flex items-end gap-1 h-12">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-100
                ${recording ? 'bg-brand-400' : 'bg-gray-600'}`}
              style={{
                height: recording
                  ? `${Math.max(8, Math.random() * level * 0.48 + 8)}px`
                  : '8px',
                transitionDelay: `${i * 20}ms`,
              }}
            />
          ))}
        </div>

        {transcript && (
          <p className="text-white text-sm text-center italic">
            &ldquo;{transcript}&rdquo;
          </p>
        )}

        {!recording && !transcript && (
          <p className="text-gray-400 text-sm text-center">
            Tap the mic and say what you ate
            <br />
            <span className="text-xs text-gray-600">
              e.g. &ldquo;200 grams of oatmeal with a banana&rdquo;
            </span>
          </p>
        )}

        {/* Mic button */}
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all
            ${recording
              ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/30'
              : 'bg-brand-500 hover:bg-brand-600'}`}
        >
          {recording ? (
            <div className="w-5 h-5 bg-white rounded-sm" />
          ) : (
            <MicIcon size={28} className="text-white" />
          )}
        </button>
        <p className="text-xs text-gray-500">
          {recording ? 'Tap to stop' : 'Tap to speak'}
        </p>
      </div>

      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30
                      px-3 py-2 rounded-xl mb-4">
          {error}
        </p>
      )}

      {/* Manual text fallback */}
      <div className="flex gap-2 mb-4">
        <input
          className="input flex-1"
          placeholder='Or type: "2 eggs and toast"'
          value={manualText}
          onChange={e => setManualText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleManualParse()}
        />
        <button onClick={handleManualParse} className="btn-primary px-4 text-sm">
          Parse
        </button>
      </div>

      {/* Parsed result */}
      {parsed && (
        <div className="bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800
                        rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckIcon size={16} className="text-brand-600 dark:text-brand-400" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{parsed.name}</p>
          </div>
          <div className="flex gap-4">
            <span className="text-xs font-bold text-flame">🔥 {Math.round(parsed.calories)} cal</span>
            <span className="text-xs text-red-500">🍗 {Math.round(parsed.protein)}g</span>
            <span className="text-xs text-amber-500">🌾 {Math.round(parsed.carbs)}g</span>
            <span className="text-xs text-blue-500">🫐 {Math.round(parsed.fat)}g</span>
          </div>
          <button
            onClick={() => onResult(parsed)}
            className="mt-3 w-full btn-primary py-2 text-sm"
          >
            Log This Meal
          </button>
        </div>
      )}

      <button onClick={onBack} className="w-full btn-secondary py-2.5 text-sm">Back</button>
    </div>
  )
}
