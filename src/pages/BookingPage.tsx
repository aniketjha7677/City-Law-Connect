import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Video, Phone, MapPin, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const { lawyerId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    consultationType: 'video',
    caseDescription: '',
    duration: '60',
  })
  const [loading, setLoading] = useState(false)

  // Mock lawyer data
  const lawyer = {
    id: parseInt(lawyerId || '1'),
    name: 'Sarah Johnson',
    specialization: 'Family Law',
    price: '$250/hr',
  }

  const availableDates = [
    '2024-01-20',
    '2024-01-21',
    '2024-01-22',
    '2024-01-23',
    '2024-01-24',
  ]

  const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.time) {
      toast.error('Please select a date and time')
      return
    }

    setLoading(true)
    // Simulate booking process
    setTimeout(() => {
      toast.success('Appointment booked successfully!')
      navigate('/cases')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={`/lawyers/${lawyerId}`} className="text-accent hover:text-accent-dark mb-4 inline-block">
        ← Back to Lawyer Profile
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Book Consultation</h1>
        <p className="text-secondary">
          Schedule a consultation with {lawyer.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lawyer Info Card */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Lawyer Information</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
              {lawyer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-lg">{lawyer.name}</h3>
              <p className="text-secondary">{lawyer.specialization}</p>
              <p className="text-primary font-bold">{lawyer.price}</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="mr-2" size={24} />
            Select Date
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => setFormData({ ...formData, date })}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.date === date
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <div className="text-sm">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="font-bold">{new Date(date).getDate()}</div>
                <div className="text-xs">{new Date(date).toLocaleDateString('en-US', { month: 'short' })}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {formData.date && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2" size={24} />
              Select Time
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setFormData({ ...formData, time })}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    formData.time === time
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Consultation Type */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Consultation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, consultationType: 'video' })}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                formData.consultationType === 'video'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <Video className="mx-auto mb-2" size={32} />
              <div className="font-bold">Video Call</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, consultationType: 'phone' })}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                formData.consultationType === 'phone'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <Phone className="mx-auto mb-2" size={32} />
              <div className="font-bold">Phone Call</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, consultationType: 'in-person' })}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                formData.consultationType === 'in-person'
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <MapPin className="mx-auto mb-2" size={32} />
              <div className="font-bold">In-Person</div>
            </button>
          </div>
        </div>

        {/* Duration */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Duration</h2>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="input-field"
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        {/* Case Description */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Case Description</h2>
          <textarea
            value={formData.caseDescription}
            onChange={(e) => setFormData({ ...formData, caseDescription: e.target.value })}
            placeholder="Please describe your legal issue or what you'd like to discuss..."
            rows={6}
            className="input-field"
          />
        </div>

        {/* Payment Summary */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <CreditCard className="mr-2" size={24} />
            Payment Summary
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary">Consultation Fee ({formData.duration} min)</span>
              <span className="font-bold">${250 * (parseInt(formData.duration) / 60)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-primary">${250 * (parseInt(formData.duration) / 60)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Link to={`/lawyers/${lawyerId}`} className="btn-outline flex-1 text-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}


