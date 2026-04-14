import { useParams, Link } from 'react-router-dom'
import { FileText, Calendar, MessageSquare, DollarSign, Upload } from 'lucide-react'
import { format } from 'date-fns'
import { createReview, getAppointmentById, getLawyerById, hasReviewForAppointment, listPaymentsForAppointment } from '../lib/localData'
import { useAuth } from '../contexts/AuthContext'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

export default function CaseDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const appt = id ? getAppointmentById(id) : null
  const lawyer = appt ? getLawyerById(appt.lawyerId) : null
  const payments = id ? listPaymentsForAppointment(id) : []
  const alreadyReviewed = useMemo(() => (id ? hasReviewForAppointment(id) : false), [id])
  const [review, setReview] = useState({ rating: 5, comment: '' })

  if (!appt) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/cases" className="text-accent hover:text-accent-dark mb-4 inline-block">
          ← Back to Cases
        </Link>
        <div className="card">
          <h1 className="text-2xl font-bold text-primary mb-2">Case not found</h1>
          <p className="text-secondary">This appointment/case does not exist in offline storage.</p>
        </div>
      </div>
    )
  }

  const statusLabel =
    appt.status === 'confirmed' ? 'ACTIVE' : appt.status === 'pending' ? 'PENDING' : appt.status.toUpperCase()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cases" className="text-accent hover:text-accent-dark mb-4 inline-block">
        ← Back to Cases
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-primary">
            Consultation — {lawyer?.specialization?.[0] ?? 'Legal Services'}
          </h1>
          <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
            {statusLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-secondary">
          <span><strong>Lawyer:</strong> {lawyer?.name ?? 'Lawyer'}</span>
          <span><strong>Category:</strong> {lawyer?.specialization?.[0] ?? 'General'}</span>
          <span><strong>Created:</strong> {format(new Date(appt.createdAt), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Description */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Case Overview</h2>
            <p className="text-secondary mb-4">{appt.caseDescription || 'No description provided.'}</p>
            <div className="bg-accent/10 border-l-4 border-accent p-4">
              <p className="font-bold mb-1">Appointment</p>
              <p className="text-secondary">
                {appt.date} at {appt.time} • {appt.durationMinutes} min • {appt.consultationType}
              </p>
            </div>
            {appt.status !== 'cancelled' && (
              <div className="bg-accent/10 border-l-4 border-accent p-4">
                <p className="font-bold mb-1">Next Action Required</p>
                <p className="text-secondary">Attend the scheduled consultation or message your lawyer.</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" size={24} />
              Case Timeline
            </h2>
            <div className="space-y-4">
              {[
                { date: appt.createdAt, event: 'Appointment created', description: 'Booking confirmed in offline mode' },
                { date: appt.createdAt, event: 'Payment recorded', description: payments.length ? 'Payment stored locally' : 'No payment record' },
              ].map((item, index, arr) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {index < arr.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold">{item.event}</h3>
                      <span className="text-sm text-secondary">
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-secondary text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <FileText className="mr-2" size={24} />
                Documents
              </h2>
              <button className="btn-outline flex items-center space-x-2">
                <Upload size={18} />
                <span>Upload</span>
              </button>
            </div>
            <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-sm text-secondary">
              Offline mode: document upload can be implemented later (local file list).
            </div>
          </div>

          {/* Review (after completion) */}
          {appt.status === 'completed' && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
              <p className="text-secondary mb-6">
                Your review helps improve lawyer ranking (reviews + success rate).
              </p>

              {alreadyReviewed ? (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                  Thanks — you already submitted a review for this appointment.
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!id) return
                    if (!lawyer) {
                      toast.error('Lawyer not found')
                      return
                    }
                    const reviewerName = user?.user_metadata?.name || user?.email || 'Client'
                    createReview({
                      lawyerId: lawyer.id,
                      appointmentId: id,
                      reviewerName,
                      rating: review.rating,
                      comment: review.comment.trim() || 'Great service.',
                    })
                    toast.success('Review submitted')
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      className="input-field"
                      value={review.rating}
                      onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={review.comment}
                      onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      placeholder="Share your experience..."
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Communication */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Communication
            </h2>
            <Link
              to="/chat"
              className="btn-primary w-full text-center block"
            >
              Message Lawyer
            </Link>
            <p className="text-sm text-secondary mt-4">
              Send messages, ask questions, or request updates about your case.
            </p>
          </div>

          {/* Payment History */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Payment History
            </h2>
            <div className="space-y-3">
              {payments.length === 0 && (
                <div className="text-sm text-secondary">No payments recorded.</div>
              )}
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{payment.provider.toUpperCase()} payment</p>
                    <p className="text-xs text-secondary">
                      {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {payment.currency} {payment.amount}
                    </p>
                    <span className={`text-xs ${
                      payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


