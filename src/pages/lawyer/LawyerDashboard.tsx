import { useMemo, useState } from 'react'
import { CheckCircle2, Clock, XCircle, Briefcase, Users, DollarSign, TrendingUp, Bell, BarChart3 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getLawyerById, listAppointmentsForLawyer, listPaymentsForLawyer, updateAppointmentStatus } from '../../lib/localData'
import toast from 'react-hot-toast'

type VerificationStatus = 'pending' | 'approved' | 'rejected'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)
}

function MiniBarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-2 h-24">
      {values.map((v, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-md bg-accent/20 border border-accent/20"
          style={{ height: `${Math.round((v / max) * 100)}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  )
}

export default function LawyerDashboard() {
  const { profile } = useAuth()
  const [tab, setTab] = useState<
    'overview' | 'analytics' | 'portfolio' | 'verification' | 'profile' | 'cases' | 'notifications'
  >(
    'overview'
  )

  const lawyerId = profile?.id ?? 'lawyer_1'
  const appointments = useMemo(() => listAppointmentsForLawyer(lawyerId), [lawyerId])
  const payments = useMemo(() => listPaymentsForLawyer(lawyerId), [lawyerId])

  const financial = useMemo(() => {
    const paid = payments.filter((p) => p.status === 'paid')
    const pending = payments.filter((p) => p.status === 'pending')
    const totalEarnings = paid.reduce((s, p) => s + p.amount, 0) + pending.reduce((s, p) => s + p.amount, 0)
    const completedPayments = paid.reduce((s, p) => s + p.amount, 0)
    const pendingPayments = pending.reduce((s, p) => s + p.amount, 0)
    // simple monthly buckets (last 12 months)
    const buckets = Array.from({ length: 12 }, () => 0)
    const now = new Date()
    paid.forEach((p) => {
      const d = new Date(p.createdAt)
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
      if (diffMonths >= 0 && diffMonths < 12) buckets[11 - diffMonths] += p.amount
    })
    return { totalEarnings, pendingPayments, completedPayments, monthlyEarnings: buckets }
  }, [payments])

  const leadStats = useMemo(() => {
    const leadsReceived = appointments.length
    const convertedClients = appointments.filter((a) => a.status !== 'cancelled').length
    const activeCases = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length
    const conversionRate = Math.round((convertedClients / Math.max(leadsReceived, 1)) * 100)
    return { leadsReceived, convertedClients, activeCases, conversionRate }
  }, [appointments])

  const verificationStatus = useMemo<VerificationStatus>(() => 'pending', [])

  const statusPill =
    verificationStatus === 'approved' ? (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-4 h-4" /> Approved
      </span>
    ) : verificationStatus === 'rejected' ? (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 border border-red-200">
        <XCircle className="w-4 h-4" /> Rejected
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-yellow-50 text-yellow-800 border border-yellow-200">
        <Clock className="w-4 h-4" /> Pending
      </span>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Lawyer Dashboard</h1>
          <p className="text-secondary mt-1">
            Welcome{profile?.name ? `, ${profile.name}` : ''}. Manage leads, cases, earnings, and verification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {statusPill}
          <span className="text-sm text-secondary">
            Badge shown publicly only after approval.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="card space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('overview')}
            >
              <TrendingUp className="inline w-4 h-4 mr-2" /> Overview
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'analytics' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('analytics')}
            >
              <BarChart3 className="inline w-4 h-4 mr-2" /> Analytics
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'portfolio' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('portfolio')}
            >
              <Briefcase className="inline w-4 h-4 mr-2" /> Case Portfolio
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'verification' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('verification')}
            >
              <CheckCircle2 className="inline w-4 h-4 mr-2" /> Verification
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('profile')}
            >
              <Users className="inline w-4 h-4 mr-2" /> Profile Management
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'cases' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('cases')}
            >
              <Briefcase className="inline w-4 h-4 mr-2" /> Clients & Cases
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'notifications' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('notifications')}
            >
              <Bell className="inline w-4 h-4 mr-2" /> Notifications
            </button>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-primary">Total Earnings</h3>
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-3xl font-bold mt-2">{formatCurrency(financial.totalEarnings)}</div>
                  <p className="text-sm text-secondary mt-1">All-time payouts + pending</p>
                </div>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-primary">Pending Payments</h3>
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold mt-2">{formatCurrency(financial.pendingPayments)}</div>
                  <p className="text-sm text-secondary mt-1">Awaiting completion or approval</p>
                </div>
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-primary">Completed Payments</h3>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold mt-2">{formatCurrency(financial.completedPayments)}</div>
                  <p className="text-sm text-secondary mt-1">Successfully paid out</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h2 className="text-xl font-bold text-primary mb-4">Monthly Earnings</h2>
                  <MiniBarChart values={financial.monthlyEarnings} />
                  <div className="mt-3 text-sm text-secondary">Last 12 months (placeholder)</div>
                </div>
                <div className="card">
                  <h2 className="text-xl font-bold text-primary mb-4">Lead & Case Tracking</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-secondary">Leads received</div>
                      <div className="text-2xl font-bold">{leadStats.leadsReceived}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-secondary">Converted clients</div>
                      <div className="text-2xl font-bold">{leadStats.convertedClients}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200">
                      <div className="text-sm text-secondary">Active cases</div>
                      <div className="text-2xl font-bold">{leadStats.activeCases}</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-secondary">Lead conversion rate</div>
                      <div className="text-lg font-bold text-primary">{leadStats.conversionRate}%</div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div className="h-2 bg-accent rounded-full" style={{ width: `${leadStats.conversionRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'analytics' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Analytics Dashboard</h2>
              <p className="text-secondary mb-6">
                This analytics view is generated from offline appointment + payment data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="text-sm text-secondary">Appointments</div>
                  <div className="text-3xl font-bold">{appointments.length}</div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="text-sm text-secondary">Payments (paid)</div>
                  <div className="text-3xl font-bold">{payments.filter((p) => p.status === 'paid').length}</div>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="text-sm text-secondary">Total revenue</div>
                  <div className="text-3xl font-bold">{formatCurrency(financial.completedPayments)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="font-bold text-primary mb-3">Revenue trend (last 12 months)</div>
                  <MiniBarChart values={financial.monthlyEarnings} />
                </div>
                <div className="p-4 rounded-lg border border-gray-200">
                  <div className="font-bold text-primary mb-3">Conversion</div>
                  <div className="text-sm text-secondary mb-2">Leads → Confirmed/Completed</div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Conversion rate</span>
                    <span className="font-bold text-primary">{leadStats.conversionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div className="h-2 bg-accent rounded-full" style={{ width: `${leadStats.conversionRate}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-secondary">Leads</div>
                      <div className="font-bold">{leadStats.leadsReceived}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-secondary">Converted</div>
                      <div className="font-bold">{leadStats.convertedClients}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="text-secondary">Active</div>
                      <div className="font-bold">{leadStats.activeCases}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'portfolio' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Case Success Portfolio</h2>
              <p className="text-secondary mb-6">
                Upload and manage past wins. You can select which entries appear publicly on your profile.
              </p>

              <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-secondary">
                  Portfolio CRUD can be added to offline storage next (case type, success rate, description, outcome, public flag).
                </p>
              </div>
            </div>
          )}

          {tab === 'verification' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Verified Badge</h2>
              <p className="text-secondary mb-6">
                Upload your Bar Association credential documents. Admin will review and approve your verification.
              </p>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
                <div>
                  <div className="font-bold">Verification status</div>
                  <div className="text-sm text-secondary">Pending / Approved / Rejected</div>
                </div>
                {statusPill}
              </div>

              <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-secondary">
                  Offline mode: you can store documents locally or add a simple file upload preview later.
                </p>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Profile Management</h2>
              <p className="text-secondary mb-6">
                Edit specialization, experience, consultation fees, profile photo, and availability schedule.
              </p>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-secondary">
                  Offline mode: profile management can be stored in local data.
                </p>
              </div>
            </div>
          )}

          {tab === 'cases' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Clients & Case Management</h2>
              <p className="text-secondary mb-6">
                View assigned clients, update case status (Pending / In Progress / Closed), and manage communications.
              </p>

              {appointments.length === 0 ? (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-sm text-secondary">
                  No appointments yet. When a client books via the booking page, they will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((a) => {
                    const lawyer = getLawyerById(a.lawyerId)
                    return (
                      <div key={a.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-bold text-primary truncate">
                              {a.clientName} — {lawyer?.specialization?.[0] ?? 'Consultation'}
                            </div>
                            <div className="text-sm text-secondary">
                              {a.date} at {a.time} • {a.durationMinutes} min • {a.consultationType} • {a.clientEmail}
                            </div>
                            {a.caseDescription && (
                              <div className="text-sm text-secondary mt-2 line-clamp-2">{a.caseDescription}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                              {a.status.toUpperCase()}
                            </span>
                            <select
                              className="input-field"
                              value={a.status}
                              onChange={(e) => {
                                const next = e.target.value as any
                                updateAppointmentStatus(a.id, next)
                                toast.success('Status updated')
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Notifications</h2>
              <p className="text-secondary mb-6">New leads, verification updates, and payment events.</p>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-secondary">
                  Offline mode: notifications can be derived from new appointments/payments.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

