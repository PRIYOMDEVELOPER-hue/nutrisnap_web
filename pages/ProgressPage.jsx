import { useState, useRef } from 'react'
import { format } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar
} from 'recharts'
import useStore from '../store/useStore'
import { FlameIcon, CheckIcon, ShareIcon, ArrowRightIcon } from '../components/icons/Icons'
import { mockWeeklyCalories } from '../lib/mockData'

const STREAK_BADGES = [3, 7, 14, 21, 30, 100]
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function ProgressPage() {
  const { user, streak, weightHistory, addWeightEntry, progressPhotos, addProgressPhoto, badges } = useStore()
  const [weightInput, setWeightInput] = useState('')
  const [chartRange, setChartRange] = useState('6M')
  const [compareLeft, setCompareLeft] = useState(0)
  const [compareRight, setCompareRight] = useState(progressPhotos.length - 1)
  const [hideWeight, setHideWeight] = useState(false)
  const fileRef = useRef(null)
  const [addingPhoto, setAddingPhoto] = useState(false)

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight ?? user.current_weight
  const startWeight = weightHistory[0]?.weight ?? user.current_weight
  const lostSoFar = Math.max(0, startWeight - latestWeight)
  const goalDiff = latestWeight - user.goal_weight
  const progressPct = Math.min(100, Math.round((lostSoFar / (startWeight - user.goal_weight)) * 100)) || 0

  // Filter weight chart data
  const now = new Date()
  const rangeMap = { '90D': 90, '6M': 180, '1Y': 365, 'ALL': 9999 }
  const days = rangeMap[chartRange]
  const chartData = weightHistory
    .filter(w => (now - new Date(w.date)) / 86400000 <= days)
    .map(w => ({ ...w, label: format(new Date(w.date), 'MMM d') }))

  const handleLogWeight = () => {
    const val = parseFloat(weightInput)
    if (!val || val < 50 || val > 500) return
    addWeightEntry({ date: new Date().toISOString().split('T')[0], weight: val })
    setWeightInput('')
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    addProgressPhoto({
      id: `p${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight: latestWeight,
      url,
      label: 'New Photo',
    })
    setAddingPhoto(false)
  }

  const earnedBadges = badges.filter(b => b.earned)
  const lockedBadges = badges.filter(b => !b.earned)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                        rounded-xl px-3 py-2 shadow-lg text-sm">
          <p className="font-bold text-gray-900 dark:text-white">{payload[0].value} lbs</p>
          <p className="text-gray-400 text-xs">{payload[0].payload.label}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Weight + Streak row */}
        <div className="flex gap-3">
          {/* Weight card */}
          <div className="card p-4 flex-1">
            <p className="text-xs text-gray-400 mb-0.5">Your Weight</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
              {latestWeight} <span className="text-base font-normal text-gray-400">lbs</span>
            </p>
            <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full my-2">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">Goal {user.goal_weight} lbs</p>
            <button
              onClick={() => document.getElementById('weight-input')?.focus()}
              className="mt-3 w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900
                         text-xs font-bold rounded-xl flex items-center justify-center gap-1.5
                         hover:opacity-90 transition-opacity active:scale-95"
            >
              Log Weight <ArrowRightIcon size={14} />
            </button>
          </div>

          {/* Streak card */}
          <div className="card p-4 w-36 flex flex-col items-center justify-center
                          bg-gradient-to-br from-orange-50 to-amber-50
                          dark:from-orange-950/30 dark:to-amber-950/30">
            <div className="relative">
              <span className="text-5xl">🔥</span>
              <span className="absolute -top-1 -right-1 text-xl font-black text-orange-500
                               drop-shadow-sm">{streak.current}</span>
            </div>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-1">
              Day Streak
            </p>
            {/* This week dots */}
            <div className="flex gap-1 mt-2">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[8px] text-gray-400">{d}</span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center
                    ${streak.thisWeek[i]
                      ? 'bg-orange-500'
                      : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {streak.thisWeek[i] && <CheckIcon size={10} className="text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Log weight input */}
        <div className="card p-4 flex gap-2">
          <input
            id="weight-input"
            type="number"
            placeholder={`Enter weight (lbs)`}
            value={weightInput}
            onChange={e => setWeightInput(e.target.value)}
            className="input flex-1"
            min="50" max="500" step="0.1"
          />
          <button
            onClick={handleLogWeight}
            className="btn-primary px-4 py-2.5 text-sm"
          >
            Log
          </button>
        </div>

        {/* Weight Progress Chart */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Weight Progress</h2>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              🏁 {progressPct}% of goal
            </span>
          </div>

          <div className="h-44 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={user.goal_weight}
                  stroke="#22c55e"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#22c55e', stroke: 'white', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Range selector */}
          <div className="flex gap-1 mt-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
            {['90D', '6M', '1Y', 'ALL'].map(r => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all
                  ${chartRange === r
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                {r}
              </button>
            ))}
          </div>

          {lostSoFar > 0 && (
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-3 font-medium text-center">
              Great job! You&apos;ve lost {lostSoFar.toFixed(1)} lbs so far 💪
            </p>
          )}
        </div>

        {/* Daily Avg Calories */}
        <div className="card p-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            Daily Average Calories
          </h2>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
              {Math.round(mockWeeklyCalories.reduce((s, d) => s + d.calories, 0) / mockWeeklyCalories.length)}
            </span>
            <span className="text-sm text-brand-500 font-semibold">↑90%</span>
            <span className="text-xs text-gray-400">of goal</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyCalories} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Bar dataKey="calories" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Streak milestones */}
        <div className="card p-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
            🔥 Streak Milestones
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STREAK_BADGES.map(days => {
              const reached = streak.current >= days || streak.longest >= days
              return (
                <div
                  key={days}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl min-w-[60px]
                    ${reached
                      ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
                      : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 opacity-50'}`}
                >
                  <span className="text-2xl">{reached ? '🔥' : '⭕'}</span>
                  <span className={`text-xs font-bold ${reached ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`}>
                    {days}d
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              🏆 Achievements
            </h2>
            <span className="text-xs text-gray-400">{earnedBadges.length}/{badges.length} earned</span>
          </div>

          {/* Earned */}
          {earnedBadges.length > 0 && (
            <>
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-2">Earned</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {earnedBadges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} earned />
                ))}
              </div>
            </>
          )}

          {/* Locked */}
          {lockedBadges.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-400 mb-2">Locked</p>
              <div className="grid grid-cols-3 gap-2">
                {lockedBadges.slice(0, 6).map(badge => (
                  <BadgeCard key={badge.id} badge={badge} earned={false} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Before / After Photo Compare */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              📸 Progress Photos
            </h2>
            <button
              onClick={() => { setAddingPhoto(true); fileRef.current?.click() }}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400
                         bg-brand-50 dark:bg-brand-950/30 px-3 py-1.5 rounded-lg"
            >
              + Add Photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          {progressPhotos.length >= 2 ? (
            <>
              {/* Compare two photos */}
              <div className="flex gap-3 mb-3">
                <PhotoSlot
                  photo={progressPhotos[compareLeft]}
                  hideWeight={hideWeight}
                  label="Before"
                  selected
                />
                <PhotoSlot
                  photo={progressPhotos[compareRight]}
                  hideWeight={hideWeight}
                  label="After"
                  selected
                />
              </div>

              {/* Hide weight toggle */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">Hide weight</span>
                <button
                  onClick={() => setHideWeight(h => !h)}
                  className={`w-11 h-6 rounded-full transition-colors duration-200 relative
                    ${hideWeight ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow
                    transition-transform duration-200
                    ${hideWeight ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {progressPhotos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => {
                      if (i !== compareRight) setCompareLeft(compareRight)
                      setCompareRight(i)
                    }}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden
                      border-2 transition-all
                      ${compareLeft === i || compareRight === i
                        ? 'border-brand-500'
                        : 'border-transparent'}`}
                  >
                    {photo.url ? (
                      <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800
                                     flex items-center justify-center text-lg">
                        👤
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button className="mt-3 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900
                                 text-sm font-bold rounded-xl flex items-center justify-center gap-2
                                 hover:opacity-90 transition-opacity">
                <ShareIcon size={16} /> Share
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl">📸</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Add your first progress photo to start comparing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BadgeCard({ badge, earned }) {
  return (
    <div
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl text-center
        overflow-hidden transition-all duration-200
        ${earned
          ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 hover:scale-105 cursor-default'
          : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50'
        }`}
      title={badge.desc}
    >
      <span className={`text-2xl ${!earned && 'grayscale opacity-40'}`}>{badge.icon}</span>
      <p className={`text-[10px] font-semibold leading-tight
        ${earned ? 'text-amber-700 dark:text-amber-400' : 'text-gray-400'}`}>
        {badge.name}
      </p>
      {earned && badge.earnedDate && (
        <p className="text-[9px] text-amber-500/70">
          {format(new Date(badge.earnedDate), 'MMM d')}
        </p>
      )}
    </div>
  )
}

function PhotoSlot({ photo, hideWeight, label }) {
  return (
    <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
         style={{ aspectRatio: '3/4' }}>
      {photo?.url ? (
        <img src={photo.url} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-5xl opacity-30">👤</span>
        </div>
      )}
      {/* Weight overlay */}
      {!hideWeight && photo && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent
                        p-3">
          <p className="text-white text-sm font-bold">{photo.weight} lbs</p>
          <p className="text-white/70 text-xs">
            {photo.date ? format(new Date(photo.date), 'MMM d, yyyy') : ''}
          </p>
        </div>
      )}
      {/* Label chip */}
      <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded-full">
        <span className="text-[10px] text-white font-semibold">{label || photo?.label}</span>
      </div>
    </div>
  )
}
