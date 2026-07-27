import { useState } from 'react'
import useStore from '../store/useStore'
import { ArrowRightIcon, CheckIcon } from '../components/icons/Icons'

const STEPS = [
  { id: 'goal',    title: 'What\'s your goal?',        subtitle: 'Choose what matters most to you' },
  { id: 'name',    title: 'Let\'s get acquainted',     subtitle: 'Tell us your name' },
  { id: 'metrics', title: 'Your body stats',           subtitle: 'Help us personalize your plan' },
  { id: 'target',  title: 'Set your targets',          subtitle: 'Based on your goals and activity' },
  { id: 'ready',   title: 'Ready to start',            subtitle: 'Your journey begins now' },
]

const GOALS = [
  { id: 'lose_weight',  emoji: '📉', label: 'Lose Weight',    desc: 'Calorie deficit to shed fat' },
  { id: 'maintain',     emoji: '⚖️', label: 'Maintain',       desc: 'Eat at maintenance calories' },
  { id: 'build_muscle', emoji: '💪', label: 'Build Muscle',   desc: 'Calorie surplus for growth' },
]

function calcTDEE({ weight, height, age, sex, activity, goal }) {
  // Mifflin-St Jeor
  const bmr = sex === 'male'
    ? 10 * (weight * 0.453592) + 6.25 * (height * 2.54) - 5 * age + 5
    : 10 * (weight * 0.453592) + 6.25 * (height * 2.54) - 5 * age - 161
  const actMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  const tdee = Math.round(bmr * (actMap[activity] || 1.375))
  if (goal === 'lose_weight') return tdee - 500
  if (goal === 'build_muscle') return tdee + 300
  return tdee
}

export default function OnboardingPage() {
  const { setUser, setOnboardingComplete } = useStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    goal_type: 'lose_weight',
    weight: '',
    height: '',
    age: '',
    sex: 'male',
    activity: 'moderate',
    goal_weight: '',
  })

  const calories = form.weight && form.height && form.age
    ? calcTDEE(form)
    : 2000
  const protein = form.weight ? Math.round(form.weight * 0.8) : 150
  const fat = Math.round(calories * 0.25 / 9)
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4)

  const canProceed = () => {
    if (step === 0) return form.goal_type
    if (step === 1) return form.name.trim().length > 0
    if (step === 2) return form.weight && form.height && form.age
    if (step === 3) return form.goal_weight
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return
    
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setUser({
        id: 'u1',
        email: 'user@nutrisnap.com',
        name: form.name,
        goal_type: form.goal_type,
        current_weight: Number(form.weight),
        goal_weight: Number(form.goal_weight),
        height: Number(form.height),
        age: Number(form.age),
        sex: form.sex,
        goal_calories: calories,
        goal_protein: protein,
        goal_carbs: carbs,
        goal_fat: fat,
        units: 'imperial',
      })
      setOnboardingComplete(true)
    }
  }

  const pct = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-amber-50 
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200/50 dark:bg-gray-800/50">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700 ease-out
                     shadow-lg shadow-brand-500/30"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex-1 px-5 pt-12 pb-8 flex flex-col max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-brand-100 dark:bg-brand-950/30 rounded-full">
              <p className="text-xs text-brand-700 dark:text-brand-400 font-bold">
                Step {step + 1} of {STEPS.length}
              </p>
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
            {STEPS[step].title}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">{STEPS[step].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto">
          {step === 0 && (
            <div className="space-y-4">
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setForm(f => ({ ...f, goal_type: g.id }))}
                  className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 text-left 
                    transition-all duration-300 group
                    ${form.goal_type === g.id
                      ? 'border-brand-500 bg-gradient-to-r from-brand-50 to-amber-50 dark:from-brand-950/30 dark:to-amber-950/30 shadow-xl scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-800 hover:border-brand-300 hover:shadow-lg hover:scale-[1.01]'}`}
                >
                  <div className={`text-5xl transition-transform duration-300 
                    ${form.goal_type === g.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {g.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">{g.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{g.desc}</p>
                  </div>
                  {form.goal_type === g.id && (
                    <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center
                                  shadow-lg shadow-brand-500/50">
                      <CheckIcon size={18} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full
                               flex items-center justify-center text-4xl mx-auto mb-4
                               shadow-2xl shadow-brand-500/30 animate-float">
                  👋
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">Nice to meet you!</p>
              </div>
              <Field 
                label="What's your name?" 
                type="text" 
                placeholder="e.g. Alex Johnson"
                value={form.name}
                onChange={v => setForm(f => ({ ...f, name: v }))} 
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Current Weight" type="number" placeholder="lbs"
                  value={form.weight}
                  onChange={v => setForm(f => ({ ...f, weight: v }))} />
                <Field label="Height" type="number" placeholder="inches"
                  value={form.height}
                  onChange={v => setForm(f => ({ ...f, height: v }))} />
                <Field label="Age" type="number" placeholder="years"
                  value={form.age}
                  onChange={v => setForm(f => ({ ...f, age: v }))} />
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">Gender</label>
                  <select
                    value={form.sex}
                    onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}
                    className="input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  Activity Level
                </label>
                <select
                  value={form.activity}
                  onChange={e => setForm(f => ({ ...f, activity: e.target.value }))}
                  className="input"
                >
                  <option value="sedentary">🪑 Sedentary (desk job, no exercise)</option>
                  <option value="light">🚶 Light (1-3 days/week exercise)</option>
                  <option value="moderate">🏃 Moderate (3-5 days/week exercise)</option>
                  <option value="active">💪 Active (6-7 days/week exercise)</option>
                  <option value="very_active">🏋️ Very Active (athlete level)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="card-glass p-6 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your Personalized Plan
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <TargetCard emoji="🔥" label="Calories" value={`${calories} cal`} />
                  <TargetCard emoji="🍗" label="Protein" value={`${protein}g`} />
                  <TargetCard emoji="🌾" label="Carbs" value={`${carbs}g`} />
                  <TargetCard emoji="🫐" label="Fat" value={`${fat}g`} />
                </div>
              </div>
              <Field 
                label="Target Weight" 
                type="number" 
                placeholder="lbs"
                value={form.goal_weight}
                onChange={v => setForm(f => ({ ...f, goal_weight: v }))} 
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-float">🎉</div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  You&apos;re All Set, {form.name}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Start your nutrition journey</p>
              </div>
              <div className="card-glass p-6 space-y-3">
                {['📸 Snap photos to log meals','🤖 AI identifies food & macros','📊 Track your progress','🏆 Earn achievement badges'].map(f => (
                  <div key={f} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/30 
                                  flex items-center justify-center flex-shrink-0">
                      <CheckIcon size={16} className="text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next button */}
        <button 
          onClick={handleNext} 
          disabled={!canProceed()}
          className="btn-primary w-full py-4 text-lg mt-8 flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1 ? 'Start Tracking' : 'Continue'}
          <ArrowRightIcon size={20} />
        </button>

        {step > 0 && step < STEPS.length - 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 
                       mt-3 w-full text-center transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">{label}</label>
      <input 
        className="input text-lg" 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  )
}

function TargetCard({ emoji, label, value }) {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 text-center
                    border border-gray-200/50 dark:border-gray-700/50">
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-black text-brand-600 dark:text-brand-400">{value}</p>
    </div>
  )
}
