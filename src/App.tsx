import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import LawyerDirectory from './pages/LawyerDirectory'
import LawyerProfile from './pages/LawyerProfile'
import BookingPage from './pages/BookingPage'
import CasesPage from './pages/CasesPage'
import CaseDetails from './pages/CaseDetails'
import ResourcesPage from './pages/ResourcesPage'
import ProfilePage from './pages/ProfilePage'
import EmergencyPage from './pages/EmergencyPage'
import LawyerLoginPage from './pages/lawyer/LawyerLoginPage'
import LawyerRegisterPage from './pages/lawyer/LawyerRegisterPage'
import LawyerDashboard from './pages/lawyer/LawyerDashboard'
import LawyerAppointmentsPage from './pages/lawyer/LawyerAppointmentsPage'
import LawyerAnalyticsPage from './pages/lawyer/LawyerAnalyticsPage'
import LawyerProfilePage from './pages/lawyer/LawyerProfilePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import LawyerLayout from './components/lawyer/LawyerLayout'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  
  return <>{children}</>
}

function RoleRoute({ children, allow }: { children: React.ReactNode; allow: Array<'user' | 'lawyer' | 'admin'> }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth/login" replace />

  // Role can briefly be null right after auth loads; wait instead of redirecting to user dashboard.
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}

function AppRoutes() {
  const { user, role } = useAuth()
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth/register"
        element={
          user ? (
            role ? (
              <Navigate to={role === 'lawyer' || role === 'admin' ? '/lawyer/dashboard' : '/dashboard'} replace />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
              </div>
            )
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route
        path="/auth/login"
        element={
          user ? (
            role ? (
              <Navigate to={role === 'lawyer' || role === 'admin' ? '/lawyer/dashboard' : '/dashboard'} replace />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
              </div>
            )
          ) : (
            <LoginPage />
          )
        }
      />

      <Route path="/lawyer/register" element={user ? <Navigate to="/lawyer/dashboard" replace /> : <LawyerRegisterPage />} />
      <Route path="/lawyer/login" element={user ? <Navigate to="/lawyer/dashboard" replace /> : <LawyerLoginPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lawyer/dashboard"
        element={
          <RoleRoute allow={['lawyer', 'admin']}>
            <LawyerLayout>
              <LawyerDashboard />
            </LawyerLayout>
          </RoleRoute>
        }
      />

      <Route
        path="/lawyer/appointments"
        element={
          <RoleRoute allow={['lawyer', 'admin']}>
            <LawyerLayout>
              <LawyerAppointmentsPage />
            </LawyerLayout>
          </RoleRoute>
        }
      />

      <Route
        path="/lawyer/analytics"
        element={
          <RoleRoute allow={['lawyer', 'admin']}>
            <LawyerLayout>
              <LawyerAnalyticsPage />
            </LawyerLayout>
          </RoleRoute>
        }
      />

      <Route
        path="/lawyer/profile"
        element={
          <RoleRoute allow={['lawyer', 'admin']}>
            <LawyerLayout>
              <LawyerProfilePage />
            </LawyerLayout>
          </RoleRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <RoleRoute allow={['admin']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </RoleRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lawyers"
        element={
          <ProtectedRoute>
            <Layout>
              <LawyerDirectory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lawyers/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <LawyerProfile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:lawyerId"
        element={
          <ProtectedRoute>
            <Layout>
              <BookingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <Layout>
              <CasesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <CaseDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Layout>
              <ResourcesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <Layout>
              <EmergencyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App


