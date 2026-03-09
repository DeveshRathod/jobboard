import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Briefcase, Menu, X, ChevronDown, User, LogOut, Settings, BookmarkCheck } from 'lucide-react'
import { getInitials } from '../utils'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Briefcase className="w-6 h-6" />
            JobBoard
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/jobs" className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
            }>Browse Jobs</NavLink>
            <NavLink to="/companies" className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
            }>Companies</NavLink>
            {isAuthenticated && user?.role === 'employer' && (
              <NavLink to="/post-job" className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
              }>Post a Job</NavLink>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 rounded-full pl-2 pr-3 py-1.5"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(`${user?.first_name} ${user?.last_name}`) || user?.email[0].toUpperCase()}
                  </div>
                  <span>{user?.first_name || user?.email.split('@')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    {user?.role === 'jobseeker' && (
                      <Link to="/saved-jobs" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <BookmarkCheck className="w-4 h-4" /> Saved Jobs
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-2">
          <Link to="/jobs" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {user?.role === 'employer' && (
                <Link to="/post-job" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Post a Job</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm font-medium text-red-600">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="block py-2 text-sm font-medium text-blue-600" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
