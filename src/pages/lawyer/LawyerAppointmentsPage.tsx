import { useMemo, useState } from 'react'
import { Calendar, Clock, Filter, Mail, Phone, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getLawyerById, listAppointmentsForLawyer, updateAppointmentStatus } from '../../lib/localData'
import toast from 'react-hot-toast'

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toYmd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export default function LawyerAppointmentsPage() {
  const { profile } = useAuth()
  const lawyerId = profile?.id ?? 'lawyer_1'
  const lawyer = getLawyerById(lawyerId)

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [selectedDate, setSelectedDate] = useState<string>('') // yyyy-mm-dd
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()))

  const all = useMemo(() => listAppointmentsForLawyer(lawyerId), [lawyerId])
  const filtered = useMemo(() => {
    return all.filter((a) => {
      const statusOk = statusFilter === 'all' ? true : a.status === statusFilter
      const dateOk = selectedDate ? a.date === selectedDate : true
      return statusOk && dateOk
    })
  }, [all, selectedDate, statusFilter])

  const daysWithAppointments = useMemo(() => {
    const set = new Set<string>()
    all.forEach((a) => set.add(a.date))
    return set
  }, [all])

  const monthStart = startOfMonth(monthCursor)
  const monthEnd = endOfMonth(monthCursor)
  const firstWeekday = monthStart.getDay() // 0..6
  const totalDays = monthEnd.getDate()
  const gridCells = useMemo(() => {
    const cells: Array<{ ymd: string | null; day: number | null }> = []
    for (let i = 0; i < firstWeekday; i++) cells.push({ ymd: null, day: null })
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), day)
      cells.push({ ymd: toYmd(d), day })
    }
    while (cells.length % 7 !== 0) cells.push({ ymd: null, day: null })
    return cells
  }, [firstWeekday, monthCursor, totalDays])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Appointments</h1>
        <p className="text-secondary mt-1">
          Manage bookings for {lawyer?.name ?? profile?.name ?? 'your practice'} (offline mode)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold text-primary">Calendar</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-outline" onClick={() => setMonthCursor(addMonths(monthCursor, -1))}>
                  ←
                </button>
                <button className="btn-outline" onClick={() => setMonthCursor(addMonths(monthCursor, 1))}>
                  →
                </button>
              </div>
            </div>

            <div className="text-sm text-secondary mb-3">
              {monthCursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-secondary mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {gridCells.map((c, idx) => {
                const has = c.ymd ? daysWithAppointments.has(c.ymd) : false
                const active = c.ymd && selectedDate === c.ymd
                return (
                  <button
                    key={idx}
                    disabled={!c.ymd}
                    onClick={() => setSelectedDate(active ? '' : (c.ymd as string))}
                    className={`h-10 rounded-md text-sm border ${
                      !c.ymd
                        ? 'border-transparent'
                        : active
                          ? 'bg-primary text-white border-primary'
                          : has
                            ? 'bg-accent/10 border-accent/30 text-primary hover:bg-accent/20'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    title={c.ymd ?? ''}
                  >
                    {c.day ?? ''}
                  </button>
                )
              })}
            </div>

            {selectedDate && (
              <div className="mt-3 text-sm text-secondary">
                Filtered by date: <span className="font-bold text-primary">{selectedDate}</span>{' '}
                <button className="text-accent hover:text-accent-dark ml-2" onClick={() => setSelectedDate('')}>
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-primary">Filters</h2>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select className="input-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold text-primary">Requests</h2>
              </div>
              <div className="text-sm text-secondary">
                Showing <span className="font-bold text-primary">{filtered.length}</span>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-sm text-secondary">
                No appointments match your filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((a) => (
                  <div key={a.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-bold text-primary truncate">{a.clientName}</div>
                        <div className="text-sm text-secondary flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {a.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {a.time} • {a.durationMinutes} min
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-4 h-4" /> {a.clientEmail}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-4 h-4" /> {a.consultationType}
                          </span>
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
                            updateAppointmentStatus(a.id, e.target.value as any)
                            toast.success('Appointment status updated')
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

