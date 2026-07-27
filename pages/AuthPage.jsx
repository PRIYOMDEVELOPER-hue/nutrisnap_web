import { useState } from 'react'
import useStore from '../store/useStore'

export default function AuthPage() {
  const { setUser, setSession } = useStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 800))

    // Demo login — replace with Supabase auth when project is created
    if (mode === 'login') {
      if (email && password) {
        setUser({ id: 'u1', email, name: name || email.split('@')[0], goal_calories: 2500,
                  goal_protein: 150, goal_carbs: 275, goal_fat: 70, goal_weight: 175,
                  current_weight: 185, goal_type: 'lose_weight', units: 'imperial' })
        setSession({ user: { email } })
      } else {
        setError('Please enter your email and password.')
      }
    } else {
      if (email && password && name) {
        setUser({ id: 'u1', email, name, goal_calories: 2500,
                  goal_protein: 150, goal_carbs: 275, goal_fat: 70, goal_weight: 175,
                  current_weight: 185, goal_type: 'lose_weight', units: 'imperial' })
        setSession({ user: { email } })
      } else {
        setError('Please fill all fields.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍎</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            NutriSnap
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Snap a photo. Know your macros.
          </p>
        </div>

        {/* Card */}
        <div className="card p-6">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all
                  ${mode === m
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-400'}`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Full Name
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                Email
              </label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                Password
              </label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30
                            px-3 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full
                               animate-spin mx-auto" />
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-brand-600 dark:text-brand-400 font-semibold"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Connect Supabase to enable real authentication
        </p>
      </div>
    </div>
  )
}
