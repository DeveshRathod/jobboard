import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import JobsListPage from './pages/JobsListPage'
import JobDetailPage from './pages/JobDetailPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import DashboardPage from './pages/DashboardPage'
import PostJobPage from './pages/PostJobPage'
import ApplicantsPage from './pages/ApplicantsPage'
import SavedJobsPage from './pages/SavedJobsPage'
import ProfilePage from './pages/ProfilePage'

function ProtectedRoute({ children, employerOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (employerOnly && user?.role !== 'employer') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:slug" element={<JobDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute employerOnly><PostJobPage /></ProtectedRoute>} />
          <Route path="/jobs/:slug/applicants" element={<ProtectedRoute employerOnly><ApplicantsPage /></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute><SavedJobsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </BrowserRouter>
  )
}
