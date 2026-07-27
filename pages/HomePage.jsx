import { useState } from 'react'
import { format, addDays, subDays, startOfWeek } from 'date-fns'
import useStore from '../store/useStore'
import CircularProgress from '../components/ui/CircularProgress'
import MacroRing from '../components/ui/MacroRing'
import { FlameIcon, WaterIcon, TrashIcon } from '../components/icons/Icons'

function getWeekDays(baseDate) {
  const start = startOfWeek(baseDate, { weekStartsOn: 0 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export default function HomePage() {
  const { user, todayLog, streak, removeMealEntry, addWater } = useStore()
  const [selectedDate, setSelectedDate] = useState(new Date())

  const weekDays = getWeekDays(selectedDate)
  const today = new Date()

  const calPct = todayLog.calories / user.goal_calories
  const calRemaining = Math.max(0, user.goal_calories - todayLog.calories)

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { key: 'lunch',     label: 'Lunch',     emoji: '☀️' },
    { key: 'dinner',    label: 'Dinner',    emoji: '🌙' },
    { key: 'snack',     label: 'Snack',     emoji: '🍎' },
  ]

  const recentMeals = [...todayLog.meals]
    .sort((a, b) => b.time?.localeCompare(a.time ?? '') ?? 0)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍎</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              NutriSnap
            </h1>
          </div>
          {/* Streak badge */}
          <button className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/50
                             border border-orange-200 dark:border-orange-800
                             px-3 py-1.5 rounded-full">
            <FlameIcon size={16} className="text-flame" />
            <span className="text-sm font-bold text-flame">{streak.current}</span>
          </button>
        </div>

        {/* Week strip */}
        <div className="flex items-center justify-between">
          {weekDays.map((day, i) => {
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            const logged = streak.thisWeek[i]
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-medium">
                  {format(day, 'EEE').slice(0, 3)}
                </span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-150
                  ${isSelected && !logged ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : ''}
                  ${logged ? 'bg-brand-500 text-white' : ''}
                  ${!isSelected && !logged ? 'text-gray-500 dark:text-gray-400' : ''}
                  ${isToday && !isSelected && !logged ? 'ring-2 ring-gray-300 dark:ring-gray-600' : ''}
                `}>
                  {format(day, 'd')}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Calories Card */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900 dark:text-white font-mono">
                {todayLog.calories.toLocaleString()}
              </span>
              <span className="text-base text-gray-400 font-medium">
                /{user.goal_calories.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Calories eaten</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">
              {calRemaining > 0 ? `${calRemaining} remaining` : 'Goal reached! 🎉'}
            </p>
          </div>
          <CircularProgress
            value={todayLog.calories}
            max={user.goal_calories}
            size={88}
            strokeWidth={8}
            color="#22c55e"
          >
            <FlameIcon size={28} className="text-gray-800 dark:text-white" />
          </CircularProgress>
        </div>

        {/* Macro rings */}
        <div className="card p-5">
          <div className="flex items-center justify-around">
            <MacroRing type="protein" value={todayLog.protein} max={user.goal_protein} />
            <MacroRing type="carbs"   value={todayLog.carbs}   max={user.goal_carbs} />
            <MacroRing type="fat"     value={todayLog.fat}     max={user.goal_fat} />
          </div>
        </div>

        {/* Water tracker */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <WaterIcon size={18} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Water</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {todayLog.water}ml / 2000ml
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(todayLog.water / 2000 * 100, 100)}%` }}
            />
          </div>
          <div className="flex gap-2">
            {[250, 500, 750].map(ml => (
              <button
                key={ml}
                onClick={() => addWater(ml)}
                className="flex-1 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400
                           bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900
                           rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                +{ml}ml
              </button>
            ))}
          </div>
        </div>

        {/* Meal sections */}
        {mealTypes.map(mt => {
          const meals = todayLog.meals.filter(m => m.meal_type === mt.key)
          return (
            <div key={mt.key} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{mt.emoji}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {mt.label}
                  </span>
                </div>
                {meals.length > 0 && (
                  <span className="text-xs text-gray-400 font-mono">
                    {meals.reduce((s, m) => s + m.calories, 0)} cal
                  </span>
                )}
              </div>
              {meals.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 pl-1">
                  No entries yet — tap + to log
                </p>
              ) : (
                <div className="space-y-2">
                  {meals.map(meal => (
                    <MealRow key={meal.id} meal={meal} onDelete={() => removeMealEntry(meal.id)} />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Recently uploaded */}
        {recentMeals.length > 0 && (
          <div className="pb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 px-1">
              Recently uploaded
            </h2>
            <div className="space-y-3">
              {recentMeals.map(meal => (
                <RecentMealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MealRow({ meal, onDelete }) {
  return (
    <div className="flex items-center gap-3 group">
      {meal.image_url ? (
        <img
          src={meal.image_url}
          alt={meal.name}
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0
                       flex items-center justify-center text-base">
          🍽️
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{meal.name}</p>
        <div className="flex gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400">
            <span className="text-red-400 font-medium">🍗{meal.protein}g</span>
          </span>
          <span className="text-[10px] text-gray-400">
            <span className="text-amber-400 font-medium">🌾{meal.carbs}g</span>
          </span>
          <span className="text-[10px] text-gray-400">
            <span className="text-blue-400 font-medium">🫐{meal.fat}g</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
          {meal.calories}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1
                     text-gray-400 hover:text-red-500"
          aria-label="Delete entry"
        >
          <TrashIcon size={14} />
        </button>
      </div>
    </div>
  )
}

function RecentMealCard({ meal }) {
  return (
    <div className="card p-4 flex gap-3">
      {meal.image_url ? (
        <img
          src={meal.image_url}
          alt={meal.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0
                       flex items-center justify-center text-2xl">
          🍽️
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {meal.name}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{meal.time}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <FlameIcon size={13} className="text-flame" />
          <span className="text-sm font-bold text-flame">{meal.calories} Calories</span>
        </div>
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-red-500">🍗 {meal.protein}g</span>
          <span className="text-xs text-amber-500">🌾 {meal.carbs}g</span>
          <span className="text-xs text-blue-500">🫐 {meal.fat}g</span>
        </div>
      </div>
    </div>
  )
}
