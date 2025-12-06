import { Link } from 'react-router-dom'
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface Case {
  id: number
  title: string
  lawyer: string
  status: 'active' | 'pending' | 'completed' | 'closed'
  category: string
  lastUpdated: string
  nextAction?: string
}

export default function CasesPage() {
  // Mock data - in real app, this would come from Supabase
  const cases: Case[] = [
    {
      id: 1,
      title: 'Employment Discrimination Case',
      lawyer: 'Emily Rodriguez',
      status: 'active',
      category: 'Employment Law',
      lastUpdated: '2024-01-15',
      nextAction: 'Court hearing scheduled for Jan 25',
    },
    {
      id: 2,
      title: 'Divorce Proceedings',
      lawyer: 'Sarah Johnson',
      status: 'active',
      category: 'Family Law',
      lastUpdated: '2024-01-14',
      nextAction: 'Mediation session on Jan 22',
    },
    {
      id: 3,
      title: 'Contract Review',
      lawyer: 'Robert Martinez',
      status: 'pending',
      category: 'Business Law',
      lastUpdated: '2024-01-10',
      nextAction: 'Awaiting lawyer review',
    },
    {
      id: 4,
      title: 'Personal Injury Claim',
      lawyer: 'Lisa Anderson',
      status: 'completed',
      category: 'Personal Injury',
      lastUpdated: '2023-12-20',
    },
  ]

  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Case['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const activeCases = cases.filter(c => c.status === 'active')
  const pendingCases = cases.filter(c => c.status === 'pending')
  const completedCases = cases.filter(c => c.status === 'completed')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Cases</h1>
          <p className="text-secondary">
            Track and manage all your legal cases in one place
          </p>
        </div>
        <Link to="/chat" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>New Consultation</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">Active Cases</p>
              <p className="text-3xl font-bold text-primary">{activeCases.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-primary">{pendingCases.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-primary">{completedCases.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((caseItem) => (
          <Link
            key={caseItem.id}
            to={`/cases/${caseItem.id}`}
            className="card hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold">{caseItem.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${getStatusColor(caseItem.status)}`}>
                    {getStatusIcon(caseItem.status)}
                    <span>{caseItem.status.toUpperCase()}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-secondary">
                    <span className="font-medium">Lawyer:</span> {caseItem.lawyer}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Category:</span> {caseItem.category}
                  </p>
                  <p className="text-secondary">
                    <span className="font-medium">Last Updated:</span>{' '}
                    {format(new Date(caseItem.lastUpdated), 'MMMM d, yyyy')}
                  </p>
                  {caseItem.nextAction && (
                    <p className="text-accent font-medium mt-2">
                      Next: {caseItem.nextAction}
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-4">
                <span className="text-accent">View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-secondary mb-4">No cases yet</p>
          <Link to="/chat" className="btn-primary">
            Start Your First Consultation
          </Link>
        </div>
      )}
    </div>
  )
}

