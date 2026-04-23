import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, CalendarDays, LayoutDashboard, LogOut, Menu, UserCircle2, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function NavItem({
  to,
  label,
  icon,
  onClick,
}: {
  to: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
}) {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default function LawyerNavigation() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-500" />

      <header className="border-b border-emerald-900/10 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/lawyer/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              CL
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-800 leading-tight">CityLaw Connect</div>
              <div className="text-xs text-amber-700 -mt-0.5">Lawyer Portal</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-emerald-900">{profile?.name ?? 'Lawyer'}</div>
              <div className="text-xs text-slate-500">{profile?.email ?? ''}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border-2 border-emerald-700 px-6 py-3 font-bold text-emerald-700 transition-colors duration-200 hover:bg-emerald-700 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <button className="md:hidden text-emerald-800" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="hidden md:grid grid-cols-4 gap-2">
            <NavItem to="/lawyer/dashboard" label="Dashboard" icon={<LayoutDashboard className="w-5 h-5" />} />
            <NavItem to="/lawyer/appointments" label="Appointments" icon={<CalendarDays className="w-5 h-5" />} />
            <NavItem to="/lawyer/analytics" label="Analytics" icon={<BarChart3 className="w-5 h-5" />} />
            <NavItem to="/lawyer/profile" label="Profile" icon={<UserCircle2 className="w-5 h-5" />} />
          </nav>

          {open && (
            <div className="md:hidden mt-3 space-y-2">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-emerald-700" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-emerald-800 truncate">{profile?.name ?? 'Lawyer'}</div>
                  <div className="text-xs text-slate-500 truncate">{profile?.email ?? ''}</div>
                </div>
              </div>

              <NavItem
                to="/lawyer/dashboard"
                label="Dashboard"
                icon={<LayoutDashboard className="w-5 h-5" />}
                onClick={() => setOpen(false)}
              />
              <NavItem
                to="/lawyer/appointments"
                label="Appointments"
                icon={<CalendarDays className="w-5 h-5" />}
                onClick={() => setOpen(false)}
              />
              <NavItem
                to="/lawyer/analytics"
                label="Analytics"
                icon={<BarChart3 className="w-5 h-5" />}
                onClick={() => setOpen(false)}
              />
              <NavItem
                to="/lawyer/profile"
                label="Profile"
                icon={<UserCircle2 className="w-5 h-5" />}
                onClick={() => setOpen(false)}
              />

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-700 px-6 py-3 font-bold text-emerald-700 transition-colors duration-200 hover:bg-emerald-700 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

