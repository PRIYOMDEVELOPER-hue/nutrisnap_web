import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'
import { HomeIcon, ChartBarIcon, UserIcon, PlusIcon } from '../icons/Icons'

const tabs = [
  { id: 'home',     label: 'Home',     icon: HomeIcon,     path: '/home' },
  { id: 'progress', label: 'Progress', icon: ChartBarIcon, path: '/progress' },
  { id: 'profile',  label: 'Profile',  icon: UserIcon,     path: '/profile' },
]

export default function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setLogModalOpen } = useStore()

  const activeTab = tabs.find(t => location.pathname.startsWith(t.path))?.id || 'home'

  return (
    <div className="flex min-h-screen">
      {/* Sidebar navigation for desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white/80 dark:bg-gray-900/80 
                        backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50
                        fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍎</span>
            <h1 className="text-2xl font-black bg-gradient-to-r from-brand-500 to-brand-600 
                           bg-clip-text text-transparent">
              NutriSnap
            </h1>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                  font-semibold text-base transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
              >
                <Icon size={24} filled={isActive} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Desktop + button */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
          <button
            onClick={() => setLogModalOpen(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600
                       text-white font-bold text-base shadow-lg shadow-brand-500/30
                       hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200
                       flex items-center justify-center gap-2"
          >
            <PlusIcon size={20} />
            Log Food
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-72">
        <main className="min-h-screen pb-20 lg:pb-8 max-w-7xl mx-auto">
          <div className="gradient-mesh min-h-screen">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                        bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl
                        border-t border-gray-200/50 dark:border-gray-800/50
                        px-4 py-2 flex items-center justify-around
                        shadow-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl 
                  transition-all duration-200
                  ${isActive
                    ? 'text-brand-600 dark:text-brand-400 scale-105'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
              >
                <Icon size={24} filled={isActive} />
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}

          {/* Mobile + button */}
          <button
            onClick={() => setLogModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-600
                       flex items-center justify-center shadow-xl shadow-brand-500/50
                       hover:scale-110 active:scale-95 transition-all duration-200
                       ml-2 animate-pulse-glow"
            aria-label="Log food"
          >
            <PlusIcon size={26} className="text-white" />
          </button>
        </nav>
      </div>
    </div>
  )
}
