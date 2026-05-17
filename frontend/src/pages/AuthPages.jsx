import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import toast from 'react-hot-toast'
import { Briefcase, Eye, EyeOff } from 'lucide-react'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.first_name || user.email.split('@')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-blue-600">
            <Briefcase className="w-7 h-7" /> JobBoard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="card">
          {/* Demo creds */}
          {/* <div className="bg-blue-50 rounded-lg p-3 mb-5 text-sm text-blue-800">
            <p className="font-medium mb-1">Demo credentials:</p>
            <p>Employer: <code className="bg-blue-100 px-1 rounded">employer@demo.com</code> / <code className="bg-blue-100 px-1 rounded">demo1234</code></p>
            <p>Seeker: <code className="bg-blue-100 px-1 rounded">seeker@demo.com</code> / <code className="bg-blue-100 px-1 rounded">demo1234</code></p>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input
                type="email" required
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
    role: searchParams.get('role') || 'jobseeker',
    company_name: '',
    first_name: '', last_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await authApi.register(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.values(errors).flat().forEach(msg => toast.error(msg))
      } else {
        toast.error('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-blue-600">
            <Briefcase className="w-7 h-7" /> JobBoard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h1>
        </div>

        <div className="card">
          {/* Role toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
            {['jobseeker', 'employer'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize ${form.role === role ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
              >
                {role === 'jobseeker' ? '👤 Job Seeker' : '🏢 Employer'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                <input className="input" placeholder="John" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                <input className="input" placeholder="Doe" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Username *</label>
              <input required className="input" placeholder="johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
              <input required type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            {form.role === 'employer' && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Company Name *</label>
                <input required className="input" placeholder="Acme Inc" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
              <div className="relative">
                <input
                  required type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password *</label>
              <input
                required type="password"
                className="input"
                placeholder="Repeat password"
                value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
