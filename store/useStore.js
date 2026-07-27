import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { allBadges } from '../lib/mockData'

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: next })
        if (next === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      initTheme: () => {
        const theme = get().theme
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      // Auth (simplified - always "logged in" for demo)
      user: null,
      session: null,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      logout: () => {
        set({ 
          user: null, 
          session: null,
          onboardingComplete: false,
          todayLog: { date: new Date().toISOString().split('T')[0], calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, meals: [] },
          weightHistory: [],
          progressPhotos: [],
          streak: { current: 0, longest: 0, thisWeek: [false, false, false, false, false, false, false] },
        })
      },

      // Today's log (starts empty)
      todayLog: { 
        date: new Date().toISOString().split('T')[0], 
        calories: 0, 
        protein: 0, 
        carbs: 0, 
        fat: 0, 
        water: 0, 
        meals: [] 
      },
      setTodayLog: (log) => set({ todayLog: log }),
      addMealEntry: (entry) => set((state) => ({
        todayLog: {
          ...state.todayLog,
          meals: [...state.todayLog.meals, entry],
          calories: state.todayLog.calories + entry.calories,
          protein: state.todayLog.protein + entry.protein,
          carbs: state.todayLog.carbs + entry.carbs,
          fat: state.todayLog.fat + entry.fat,
        }
      })),
      removeMealEntry: (id) => set((state) => {
        const entry = state.todayLog.meals.find(m => m.id === id)
        if (!entry) return state
        return {
          todayLog: {
            ...state.todayLog,
            meals: state.todayLog.meals.filter(m => m.id !== id),
            calories: Math.max(0, state.todayLog.calories - entry.calories),
            protein: Math.max(0, state.todayLog.protein - entry.protein),
            carbs: Math.max(0, state.todayLog.carbs - entry.carbs),
            fat: Math.max(0, state.todayLog.fat - entry.fat),
          }
        }
      }),
      addWater: (ml) => set((state) => ({
        todayLog: { ...state.todayLog, water: state.todayLog.water + ml }
      })),

      // Streak (starts at 0)
      streak: { current: 0, longest: 0, thisWeek: [false, false, false, false, false, false, false] },
      setStreak: (streak) => set({ streak }),

      // Weight (starts empty)
      weightHistory: [],
      addWeightEntry: (entry) => set((state) => ({
        weightHistory: [...state.weightHistory, entry].sort((a, b) => new Date(a.date) - new Date(b.date))
      })),

      // Progress photos (starts empty)
      progressPhotos: [],
      addProgressPhoto: (photo) => set((state) => ({
        progressPhotos: [...state.progressPhotos, photo]
      })),

      // Badges
      badges: allBadges,
      earnBadge: (id) => set((state) => ({
        badges: state.badges.map(b =>
          b.id === id ? { ...b, earned: true, earnedDate: new Date().toISOString().split('T')[0] } : b
        )
      })),

      // Active tab
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Log modal
      logModalOpen: false,
      setLogModalOpen: (open) => set({ logModalOpen: open }),

      // Onboarding
      onboardingComplete: false,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
      
      // Reset all data (dev only)
      resetAll: () => set({
        user: null,
        session: null,
        isAuthenticated: true,
        onboardingComplete: false,
        todayLog: { date: new Date().toISOString().split('T')[0], calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, meals: [] },
        weightHistory: [],
        progressPhotos: [],
      }),
    }),
    {
      name: 'nutrisnap-store',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        todayLog: state.todayLog,
        streak: state.streak,
        weightHistory: state.weightHistory,
        progressPhotos: state.progressPhotos,
        badges: state.badges,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
)

export default useStore
