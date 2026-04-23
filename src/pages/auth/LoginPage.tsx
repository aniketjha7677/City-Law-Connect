import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import ScalesIcon from '../../components/ScalesIcon'
import loginIllustration from '../../assets/login-illustration.png'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const signedRole = await signIn(formData.email, formData.password)
      toast.success('Welcome back!')
      if (signedRole === 'lawyer' || signedRole === 'admin') navigate('/lawyer/dashboard')
      else navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-violet-200 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(59,130,246,0.25)] backdrop-blur-sm">
        <div className="relative w-full px-6 py-8 sm:px-10 sm:py-10 lg:w-1/2 lg:px-12 lg:py-12">
          <div className="absolute left-10 top-12 h-24 w-24 rounded-full bg-blue-500/15 blur-2xl" />
          <div className="absolute bottom-12 right-10 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl" />

          <div className="mb-8 flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
              <ScalesIcon className="h-7 w-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary">CityLawConnect</div>
          </div>

          <div className="relative z-10 mb-6">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-primary">Sign In to Your Account</h2>
            <p className="text-sm text-secondary">Welcome back! Please sign in to continue</p>
          </div>

          <form className="relative z-10 space-y-5" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="abcd@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/auth/forgot-password" className="text-accent hover:text-accent-dark font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Register Link */}
            <div className="pt-1 text-center">
              <p className="text-sm text-secondary">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-accent hover:text-accent-dark font-medium">
                  Create one now
                </Link>
              </p>
              <p className="text-xs text-secondary mt-2">
                Are you a lawyer?{' '}
                <Link to="/lawyer/login" className="text-accent hover:text-accent-dark font-medium">
                  Sign in to Lawyer Portal
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#9e8be0] via-[#a791e8] to-[#8d79d9] lg:flex">
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="h-full w-full object-cover object-[90%_center]"
          />
        </div>
      </div>
    </div>
  )
}
