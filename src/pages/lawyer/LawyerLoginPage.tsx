import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ScalesIcon from '../../components/ScalesIcon'
import loginIllustration from '../../assets/login-illustration.png'

export default function LawyerLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { signIn, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const signedRole = await signIn(formData.email, formData.password)
      if (signedRole !== 'lawyer' && signedRole !== 'admin') {
        await signOut()
        toast.error('This login is for lawyers only.')
        return
      }

      toast.success('Welcome back!')
      navigate('/lawyer/dashboard')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_24px_80px_rgba(13,148,136,0.22)] backdrop-blur-sm">
        <div className="relative w-full px-6 py-8 sm:px-10 sm:py-10 lg:w-1/2 lg:px-12 lg:py-12">
          <div className="absolute left-10 top-12 h-24 w-24 rounded-full bg-teal-500/15 blur-2xl" />
          <div className="absolute bottom-12 right-10 h-28 w-28 rounded-full bg-amber-500/20 blur-2xl" />

          <div className="mb-8 flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
              <ScalesIcon className="h-7 w-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary">CityLawConnect</div>
          </div>
          <div className="relative z-10 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Lawyer Sign In</h2>
            <p className="mt-1 text-sm text-secondary">Access your professional dashboard</p>
          </div>

          <form className="relative z-10 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@lawfirm.com"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

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
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="pt-1 text-center">
              <p className="text-sm text-secondary">
                New here?{' '}
                <Link to="/lawyer/register" className="text-accent hover:text-accent-dark font-medium">
                  Create a lawyer account
                </Link>
              </p>
              <p className="text-xs text-secondary mt-2">
                Looking for client login?{' '}
                <Link to="/auth/login" className="text-accent hover:text-accent-dark font-medium">
                  Go to user sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#5e8f9a] via-[#7aa7b1] to-[#b8a576] lg:flex">
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

