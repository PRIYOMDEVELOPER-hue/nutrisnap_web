import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore'

// Pages
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'
import LogModal from './components/log/LogModal'

export default function App() {
  const { onboardingComplete, logModalOpen, initTheme } = useStore()

  useEffect(() => {
    initTheme()
  }, [])

  // Show onboarding first if not completed
  if (!onboardingComplete) {
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    )
  }

  // After onboarding, show main app
  return (
    <>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AppShell>
      {logModalOpen && <LogModal />}
    </>
  )
}
