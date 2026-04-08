import { useParams, Link } from 'react-router-dom'
import { FileText, Calendar, MessageSquare, DollarSign, Upload, Download } from 'lucide-react'
import { format } from 'date-fns'

export default function CaseDetails() {
  const { id } = useParams()

  // Mock data - in real app, this would come from Supabase
  const caseData = {
    id: parseInt(id || '1'),
    title: 'Employment Discrimination Case',
    lawyer: 'Emily Rodriguez',
    status: 'active',
    category: 'Employment Law',
    description: 'Filing a complaint regarding workplace discrimination based on age and gender. Seeking legal representation for EEOC complaint process.',
    createdAt: '2024-01-05',
    lastUpdated: '2024-01-15',
    nextAction: 'Court hearing scheduled for January 25, 2024 at 10:00 AM',
    documents: [
      { id: 1, name: 'EEOC Complaint Form.pdf', uploadedAt: '2024-01-10', size: '2.4 MB' },
      { id: 2, name: 'Employment Contract.pdf', uploadedAt: '2024-01-08', size: '1.8 MB' },
      { id: 3, name: 'Email Correspondence.pdf', uploadedAt: '2024-01-06', size: '856 KB' },
    ],
    timeline: [
      { date: '2024-01-15', event: 'Case status updated', description: 'Court hearing scheduled' },
      { date: '2024-01-10', event: 'Document uploaded', description: 'EEOC Complaint Form submitted' },
      { date: '2024-01-08', event: 'Consultation completed', description: 'Initial consultation with lawyer' },
      { date: '2024-01-05', event: 'Case created', description: 'Case opened and assigned to lawyer' },
    ],
    payments: [
      { id: 1, date: '2024-01-08', description: 'Initial Consultation', amount: 250, status: 'paid' },
      { id: 2, date: '2024-01-15', description: 'Legal Services', amount: 500, status: 'pending' },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cases" className="text-accent hover:text-accent-dark mb-4 inline-block">
        ← Back to Cases
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-primary">{caseData.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            caseData.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {caseData.status.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-secondary">
          <span><strong>Lawyer:</strong> {caseData.lawyer}</span>
          <span><strong>Category:</strong> {caseData.category}</span>
          <span><strong>Created:</strong> {format(new Date(caseData.createdAt), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Description */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Case Overview</h2>
            <p className="text-secondary mb-4">{caseData.description}</p>
            {caseData.nextAction && (
              <div className="bg-accent/10 border-l-4 border-accent p-4">
                <p className="font-bold mb-1">Next Action Required</p>
                <p className="text-secondary">{caseData.nextAction}</p>
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
              {caseData.timeline.map((item, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {index < caseData.timeline.length - 1 && (
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
            <div className="space-y-3">
              {caseData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-secondary">
                        {format(new Date(doc.uploadedAt), 'MMM d, yyyy')} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button className="text-accent hover:text-accent-dark">
                    <Download size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
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
              {caseData.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{payment.description}</p>
                    <p className="text-xs text-secondary">
                      {format(new Date(payment.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount}</p>
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


