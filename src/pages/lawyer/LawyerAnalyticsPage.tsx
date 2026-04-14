import { useMemo } from 'react'
import { BarChart3, DollarSign, Star, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getReviewsForLawyer, listAppointmentsForLawyer, listPaymentsForLawyer } from '../../lib/localData'

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

export default function LawyerAnalyticsPage() {
  const { profile } = useAuth()
  const lawyerId = profile?.id ?? 'lawyer_1'

  const appointments = useMemo(() => listAppointmentsForLawyer(lawyerId), [lawyerId])
  const payments = useMemo(() => listPaymentsForLawyer(lawyerId), [lawyerId])
  const reviews = useMemo(() => getReviewsForLawyer(lawyerId), [lawyerId])

  const avgRating = useMemo(() => {
    return reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  }, [reviews])

  const revenue = useMemo(() => {
    const paid = payments.filter((p) => p.status === 'paid')
    const total = paid.reduce((s, p) => s + p.amount, 0)
    const buckets = Array.from({ length: 12 }, () => 0)
    const now = new Date()
    paid.forEach((p) => {
      const d = new Date(p.createdAt)
      const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
      if (diffMonths >= 0 && diffMonths < 12) buckets[11 - diffMonths] += p.amount
    })
    return { total, monthly: buckets }
  }, [payments])

  const conversion = useMemo(() => {
    const leads = appointments.length
    const converted = appointments.filter((a) => a.status !== 'cancelled').length
    const rate = Math.round((converted / Math.max(leads, 1)) * 100)
    return { leads, converted, rate }
  }, [appointments])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Analytics</h1>
        <p className="text-secondary mt-1">Performance insights (offline mode).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary">Appointments</h3>
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold mt-2">{appointments.length}</div>
          <p className="text-sm text-secondary mt-1">Total booked</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary">Revenue</h3>
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold mt-2">{formatCurrency(revenue.total)}</div>
          <p className="text-sm text-secondary mt-1">Paid payments</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary">Avg rating</h3>
            <Star className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold mt-2">{avgRating.toFixed(1)}</div>
          <p className="text-sm text-secondary mt-1">{reviews.length} reviews</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary">Conversion</h3>
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold mt-2">{conversion.rate}%</div>
          <p className="text-sm text-secondary mt-1">
            {conversion.converted}/{conversion.leads} converted
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-3">Revenue trend (last 12 months)</h2>
          <MiniBarChart values={revenue.monthly} />
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-3">Conversion rate</h2>
          <div className="flex items-center justify-between">
            <span className="text-secondary">Leads → Confirmed/Completed</span>
            <span className="font-bold text-primary">{conversion.rate}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div className="h-2 bg-accent rounded-full" style={{ width: `${conversion.rate}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

