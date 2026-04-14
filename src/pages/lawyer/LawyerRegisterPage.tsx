import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Mail, MapPin, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ScalesIcon from '../../components/ScalesIcon'
import { supabase } from '../../lib/supabase'

export default function LawyerRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      // ✅ Step 1: Create user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })
      if (error) throw error

      const user = data.user

      if (!user) {
        throw new Error("Signup failed: user not returned (check email confirmation)")
      }

      if (error) throw error

      // ✅ Step 2: Split location
      const parts = formData.location.split(',')
      const city = parts[0]?.trim() || ''
      const state = parts[1]?.trim() || ''

      // ✅ Step 3: Update profile
      await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: formData.name,
          email: formData.email,
          state: state?.trim(),
          city: city?.trim(),
          role: 'lawyer'
        }
      ])

      // ✅ Step 4: Insert into lawyers table
      await supabase.from('lawyers').insert([
        {
          id: user?.id,
          display_name: formData.name,
          location: formData.location,
          verified_status: 'pending'
        }
      ])

      // Force login after signup (no direct dashboard access)
      await signOut()
      toast.success('Lawyer account created! Please sign in to continue.')
      navigate('/lawyer/login')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create lawyer account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <ScalesIcon className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary">CityLaw Connect</div>
          </div>
          <h2 className="text-2xl font-bold text-primary">Lawyer Registration</h2>
          <p className="text-sm text-secondary mt-1">Create your professional account</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Jane Advocate"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@lawfirm.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="City, State"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Lawyer Account'}
            </button>

            <div className="text-center">
              <p className="text-sm text-secondary">
                Already have a lawyer account?{' '}
                <Link to="/lawyer/login" className="text-accent hover:text-accent-dark font-medium">
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-secondary mt-2">
                Not a lawyer?{' '}
                <Link to="/auth/register" className="text-accent hover:text-accent-dark font-medium">
                  Create a user account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

