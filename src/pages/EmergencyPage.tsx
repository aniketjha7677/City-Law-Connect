import { useState } from 'react'
import { AlertCircle, Phone, MessageSquare, Clock, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function EmergencyPage() {
  const [formData, setFormData] = useState({
    situation: '',
    urgency: 'high',
    contactPreference: 'phone',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate emergency request
    setTimeout(() => {
      toast.success('Emergency request submitted! A lawyer will contact you shortly.')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">Emergency Legal Help</h1>
        <p className="text-secondary text-lg">
          If you're facing an urgent legal situation, we're here to help
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-red-50 border-2 border-red-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">24/7 Emergency Hotline</h3>
              <p className="text-secondary">Available around the clock</p>
            </div>
          </div>
          <a href="tel:1-800-LEGAL-HELP" className="text-2xl font-bold text-red-600 hover:text-red-700">
            1-800-LEGAL-HELP
          </a>
        </div>

        <div className="card bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Emergency Chat</h3>
              <p className="text-secondary">Connect with a lawyer instantly</p>
            </div>
          </div>
          <Link to="/chat" className="btn-primary">
            Start Emergency Chat
          </Link>
        </div>
      </div>

      {/* Urgent Situation Form */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6">Request Emergency Assistance</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe Your Urgent Situation *
            </label>
            <textarea
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              rows={6}
              required
              placeholder="Please describe your urgent legal situation in detail..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="input-field"
            >
              <option value="high">High - Immediate attention needed</option>
              <option value="critical">Critical - Life-threatening or arrest situation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method *
            </label>
            <select
              value={formData.contactPreference}
              onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
              className="input-field"
            >
              <option value="phone">Phone Call</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>

          {(formData.contactPreference === 'phone' || formData.contactPreference === 'sms') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="(555) 123-4567"
                required
                className="input-field"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Emergency Request'}
          </button>
        </form>
      </div>

      {/* Crisis Resources */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Shield className="mr-2" size={24} />
          Crisis Resources
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold mb-2">If You've Been Arrested</h3>
            <ul className="list-disc list-inside text-secondary space-y-1 text-sm">
              <li>Remain calm and do not resist</li>
              <li>You have the right to remain silent - use it</li>
              <li>Request a lawyer immediately</li>
              <li>Do not answer questions without your lawyer present</li>
            </ul>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold mb-2">Domestic Violence</h3>
            <p className="text-secondary text-sm mb-2">
              If you're in immediate danger, call 911. For support and resources:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-1 text-sm">
              <li>National Domestic Violence Hotline: 1-800-799-7233</li>
              <li>Available 24/7 for confidential support</li>
            </ul>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold mb-2">Eviction Notice</h3>
            <ul className="list-disc list-inside text-secondary space-y-1 text-sm">
              <li>Do not ignore the notice - respond immediately</li>
              <li>Review your lease agreement</li>
              <li>Contact a housing attorney right away</li>
              <li>You may have rights and protections</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-1">Important Notice</h3>
            <p className="text-sm text-yellow-700">
              This platform provides legal information and lawyer matching services. In true emergencies involving immediate danger, please call 911 or your local emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


