import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, MapPin, Eye, EyeOff, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import ScalesIcon from '../../components/ScalesIcon'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    city: '',
  })
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { signUp, signOut } = useAuth()
  const navigate = useNavigate()
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const stateCityMap: any = {
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Delhi: ["New Delhi"],
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida"],
  }

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
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        `${formData.city}, ${formData.state}`
      )

      // 🔥 FORCE LOGOUT (important)
      await signOut()

      toast.success('Account created successfully! Please login')

      // redirect to login page
      navigate('/auth/login')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationChange = async (value: string) => {
    setFormData({
      ...formData,
      state: value
    })

    if (value.length < 3) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&featuretype=state&q=${value}`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "CityLawConnectApp"
          }
        }
      )

      const data = await res.json()

      const states = data
        .filter((item: any) =>
          item.addresstype === "state" ||
          item.type === "administrative"
        )
        .map((item: any) => item.display_name.split(",")[0])

      // remove duplicates
      const uniqueStates = [...new Set(states)]

      setSuggestions(uniqueStates)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-sky-50 to-violet-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <ScalesIcon className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary">CityLawConnect</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(59,130,246,0.25)] backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-primary text-center mb-2">
              Create Your Account
            </h2>
            <p className="text-center text-secondary text-sm">
              Join thousands getting legal help
            </p>
          </div>

          <form autoComplete="off" className="space-y-5" onSubmit={handleSubmit}>
            <div className="rounded-xl border border-blue-100 bg-blue-50/65 p-4">
              <p className="text-sm text-secondary">
                Creating a lawyer account?{' '}
                <Link to="/lawyer/register" className="text-accent hover:text-accent-dark font-medium">
                  Go to Lawyer Registration
                </Link>
              </p>
            </div>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="location"
                  name="state_input"
                  type="text"
                  autoComplete="new-password"
                  required
                  placeholder="Enter your state"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.state}
                  onChange={(e) => handleLocationChange(e.target.value)}
                />
                {/* ✅ ADD THIS */}
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full mt-1 rounded-lg shadow max-h-40 overflow-y-auto">
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            state: item,
                            city: ""   // reset city
                          })

                          setCitySuggestions(stateCityMap[item] || [])  // ✅ load cities
                          setSuggestions([])
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  placeholder="Select your city"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.city}
                  onChange={(e) => {
                    const value = e.target.value

                    setFormData((prev) => {
                      const filtered = (stateCityMap[prev.state] || []).filter((c: string) =>
                        c.toLowerCase().includes(value.toLowerCase())
                      )

                      setCitySuggestions(filtered)

                      return {
                        ...prev,
                        city: value
                      }
                    })
                  }}
                />

                {/* ✅ City Suggestions */}
                {citySuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border w-full mt-1 rounded-lg shadow max-h-40 overflow-y-auto">
                    {citySuggestions.map((city, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFormData({ ...formData, city })
                          setCitySuggestions([])
                        }}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>


            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                {/* 🔒 Lock Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-10 shadow-sm transition-all duration-200 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {/* 👁 Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
            <div className="relative">
              {/* 🔒 Lock Icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm Password"
                className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-12 pr-10 shadow-sm transition-all duration-200 focus:border-blue-400/60 focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
             </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-accent hover:text-accent-dark">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-accent hover:text-accent-dark">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-secondary">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-accent hover:text-accent-dark font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
