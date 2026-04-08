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

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/auth/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      
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


