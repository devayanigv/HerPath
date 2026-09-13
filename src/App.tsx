import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { AuthPage } from './pages/AuthPage'
import { CareerAnalysisPage } from './pages/CareerAnalysisPage'
import { CareerDetailPage } from './pages/CareerDetailPage'
import { CareerDiscoveryPage } from './pages/CareerDiscoveryPage'
import { AICoachPage } from './pages/AICoachPage'
import { DashboardPage } from './pages/DashboardPage'
import { DemoPage } from './pages/DemoPage'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { ResumePage } from './pages/ResumePage'
import { SkillsPage } from './pages/SkillsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/demo" element={<DemoPage />} />

          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/career-analysis" element={<ProtectedRoute><CareerAnalysisPage /></ProtectedRoute>} />
          <Route path="/career-discovery" element={<ProtectedRoute><CareerDiscoveryPage /></ProtectedRoute>} />
          <Route path="/career/:careerId" element={<ProtectedRoute><CareerDetailPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><SkillsPage /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
          <Route path="/ai-coach" element={<ProtectedRoute><AICoachPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}