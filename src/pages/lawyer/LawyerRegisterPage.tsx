import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Mail, MapPin, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import ScalesIcon from '../../components/ScalesIcon'
import { supabase } from '../../lib/supabase'


export default function LawyerRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    city: '',
    experience: '',
    fee: '',
  })
  const LAW_OPTIONS = [
    "Criminal Law",
    "Family Law",
    "Civil Law",
    "Corporate Law",
    "Tenant Rights",
    "Contract Law"
  ];
  const [loading, setLoading] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [specialization, setSpecialization] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  useEffect(() => {
    const close = () => setShowDropdown(false)
    window.addEventListener("click", close)
    return () => window.removeEventListener("click", close)
  }, [])

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

    if (!specialization) {
      toast.error("Please select specialization")
      return
    }

    if (parseInt(formData.experience) < 0) {
      toast.error("Experience cannot be negative");
      return;
    }

    if (!formData.state || !formData.city) {
      toast.error("Please select city and state")
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



      // ✅ Step 3: Update profile
      await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: formData.name,
          email: formData.email,
          state: formData.state,   // ✅ FIXED
          city: formData.city,     // ✅ FIXED
          role: 'lawyer'
        }
      ])

      if (!formData.experience || !formData.fee) {
        toast.error("Please fill experience and fee")
        return
      }

      // ✅ Step 4: Insert into lawyers table
      await supabase.from('lawyers').insert([
        {
          id: user?.id,
          display_name: formData.name,
          location: `${formData.city}, ${formData.state}`,
          specializations: [specialization],
          years_experience: parseInt(formData.experience),
          consultation_fee: parseFloat(formData.fee),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <ScalesIcon className="w-7 h-7 text-white" />
            </div>
            <div className="text-2xl font-bold text-primary">CityLawConnect</div>
          </div>
          <h2 className="text-2xl font-bold text-primary">Lawyer Registration</h2>
          <p className="text-sm text-secondary mt-1">Create your professional account</p>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(13,148,136,0.24)] backdrop-blur-sm">
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
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
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
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Enter your state"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type="text"
                  placeholder="Select your city"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-4 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                Specialization
              </label>

              {/* INPUT BOX */}
              <div
                className="flex min-h-[45px] w-full cursor-pointer flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/85 p-2 shadow-sm transition-all duration-200 focus-within:border-teal-500/60 focus-within:ring-4 focus-within:ring-teal-400/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDropdown(true)
                }}
              >
                {specialization ? (
                  <span className="text-black text-sm flex items-center gap-2">
                    {specialization}
                    <button
                      className="text-gray-500 hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSpecialization(null);
                      }}
                    >

                    </button>
                  </span>
                ) : (
                  <span className="text-gray-400">Select specialization...</span>
                )}
              </div>

              {/* DROPDOWN */}
              {showDropdown && (
                <div
                  className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {LAW_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSpecialization(option);
                        setShowDropdown(false); // close after select
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>

              <input
                type="number"
                min="0"
                max="60"
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-slate-200 bg-white/85 p-2 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                value={formData.experience}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value));
                  setFormData({ ...formData, experience: value.toString() });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee (₹/hr)
              </label>

              <input
                type="number"
                placeholder="e.g. 1000"
                className="w-full rounded-xl border border-slate-200 bg-white/85 p-2 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                value={formData.fee}
                onChange={(e) =>
                  setFormData({ ...formData, fee: e.target.value })
                }
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                {/* LEFT ICON */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                {/* INPUT */}
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-10 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                {/* EYE ICON */}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                {/* LEFT ICON */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>

                {/* INPUT */}
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm Password"
                  className="w-full rounded-xl border border-slate-200 bg-white/85 py-3 pl-10 pr-10 shadow-sm transition-all duration-200 focus:border-teal-500/60 focus:outline-none focus:ring-4 focus:ring-teal-400/20"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />

                {/* EYE ICON */}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/35 disabled:cursor-not-allowed disabled:opacity-50"
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

