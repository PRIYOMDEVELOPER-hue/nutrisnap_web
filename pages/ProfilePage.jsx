import { useState } from 'react'
import useStore from '../store/useStore'
import Toggle from '../components/ui/Toggle'
import { SunIcon, MoonIcon, ChevronRightIcon, FlameIcon } from '../components/icons/Icons'
import { allBadges } from '../lib/mockData'

const GOAL_LABELS = {
  lose_weight:   'Lose Weight',
  maintain:      'Maintain Weight',
  build_muscle:  'Build Muscle',
}

export default function ProfilePage() {
  const { user, theme, toggleTheme, streak, badges, logout, setUser, resetAll } = useStore()
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    goal_calories: user?.goal_calories || 2000,
    goal_protein: user?.goal_protein || 150,
    goal_carbs: user?.goal_carbs || 250,
    goal_fat: user?.goal_fat || 65,
    goal_weight: user?.goal_weight || 175,
  })

  const earnedCount = badges.filter(b => b.earned).length
  const topBadges = badges.filter(b => b.earned).slice(0, 3)

  const handleSave = () => {
    setUser({ ...user, ...editForm })
    setEditing(false)
  }

  const avatarInitials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Profile</h1>

        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center
                         text-white text-xl font-bold flex-shrink-0">
            {user.avatar_url
              ? <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
              : avatarInitials
            }
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                className="input text-base font-bold mb-1"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              />
            ) : (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h2>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
              ${editing
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-5">
          <StatPill label="Streak" value={`${streak.current}🔥`} />
          <StatPill label="Best" value={`${streak.longest}d`} />
          <StatPill label="Badges" value={`${earnedCount}🏆`} />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3 pb-8">

        {/* Theme toggle — the headline feature */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                ${theme === 'dark'
                  ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'bg-amber-100 text-amber-600'}`}>
                {theme === 'dark'
                  ? <MoonIcon size={18} />
                  : <SunIcon size={18} />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className="text-xs text-gray-400">
                  {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                </p>
              </div>
            </div>
            <Toggle
              id="theme-toggle"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
          </div>
        </div>

        {/* Goals */}
        <div className="card p-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Daily Goals</h3>
          <div className="space-y-3">
            <GoalRow
              label="Calories"
              emoji="🔥"
              value={editForm.goal_calories}
              editing={editing}
              onChange={v => setEditForm(f => ({ ...f, goal_calories: v }))}
              unit="cal"
              color="text-flame"
            />
            <GoalRow
              label="Protein"
              emoji="🍗"
              value={editForm.goal_protein}
              editing={editing}
              onChange={v => setEditForm(f => ({ ...f, goal_protein: v }))}
              unit="g"
              color="text-red-500"
            />
            <GoalRow
              label="Carbs"
              emoji="🌾"
              value={editForm.goal_carbs}
              editing={editing}
              onChange={v => setEditForm(f => ({ ...f, goal_carbs: v }))}
              unit="g"
              color="text-amber-500"
            />
            <GoalRow
              label="Fat"
              emoji="🫐"
              value={editForm.goal_fat}
              editing={editing}
              onChange={v => setEditForm(f => ({ ...f, goal_fat: v }))}
              unit="g"
              color="text-blue-500"
            />
            <GoalRow
              label="Target Weight"
              emoji="⚖️"
              value={editForm.goal_weight}
              editing={editing}
              onChange={v => setEditForm(f => ({ ...f, goal_weight: v }))}
              unit="lbs"
              color="text-purple-500"
            />
          </div>
        </div>

        {/* Badge showcase */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Badges</h3>
            <span className="text-xs text-gray-400">{earnedCount} earned</span>
          </div>
          {topBadges.length > 0 ? (
            <div className="flex gap-3">
              {topBadges.map(badge => (
                <div key={badge.id}
                  className="flex flex-col items-center gap-1 flex-1
                             bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3
                             border border-amber-100 dark:border-amber-900">
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 text-center leading-tight">
                    {badge.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">Log meals to earn your first badge!</p>
          )}
        </div>

        {/* Settings sections */}
        <div className="card overflow-hidden">
          <SettingsItem label="Units" value={user.units === 'imperial' ? 'Imperial (lbs, ft)' : 'Metric (kg, cm)'} />
          <SettingsItem label="Goal Type" value={GOAL_LABELS[user.goal_type] || 'Lose Weight'} />
          <SettingsItem label="Notifications" value="Enabled" />
          <SettingsItem label="Privacy" value="Private" />
        </div>

        <div className="card overflow-hidden">
          <SettingsItem label="Export Data" value="CSV" />
          <SettingsItem label="About NutriSnap" value="v1.0.0" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-3.5 text-red-500 font-semibold text-sm
                     bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900
                     rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors
                     active:scale-98 mb-3"
        >
          Log Out
        </button>

        {/* Reset button for testing */}
        <button
          onClick={() => {
            if (confirm('Reset all data and restart onboarding?')) {
              resetAll()
              window.location.reload()
            }
          }}
          className="w-full py-2.5 text-xs text-gray-400 hover:text-gray-600
                     bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                     rounded-xl transition-colors"
        >
          🔄 Reset App Data
        </button>
      </div>
    </div>
  )
}

function StatPill({ label, value }) {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
      <p className="text-base font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function GoalRow({ label, emoji, value, editing, onChange, unit, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-base">{emoji}</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      {editing ? (
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="input w-24 text-right text-sm py-1"
        />
      ) : (
        <span className={`text-sm font-bold font-mono ${color}`}>
          {value} {unit}
        </span>
      )}
    </div>
  )
}

function SettingsItem({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5
                    border-b border-gray-50 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">{value}</span>
        <ChevronRightIcon size={16} className="text-gray-300 dark:text-gray-600" />
      </div>
    </div>
  )
}
