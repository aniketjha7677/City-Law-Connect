import { useMemo, useState } from 'react'
import { CheckCircle2, Clock, XCircle, Shield, FileCheck2, Users } from 'lucide-react'

type Status = 'pending' | 'approved' | 'rejected'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'verifications' | 'manage'>('verifications')

  // Placeholder data (wire to Supabase next)
  const verificationRequests = useMemo(
    () => [
      { id: 'req_1', lawyerName: 'Sarah Johnson', submittedAt: '2026-04-02', status: 'pending' as Status },
      { id: 'req_2', lawyerName: 'Michael Chen', submittedAt: '2026-03-28', status: 'rejected' as Status },
      { id: 'req_3', lawyerName: 'Emily Rodriguez', submittedAt: '2026-03-20', status: 'approved' as Status },
    ],
    []
  )

  const statusBadge = (s: Status) =>
    s === 'approved' ? (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-4 h-4" /> Approved
      </span>
    ) : s === 'rejected' ? (
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
          <p className="text-secondary mt-1">Verify lawyers, manage users, and handle reported issues.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Admin Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="card space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'verifications' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('verifications')}
            >
              <FileCheck2 className="inline w-4 h-4 mr-2" /> Lawyer Verifications
            </button>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${tab === 'manage' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setTab('manage')}
            >
              <Users className="inline w-4 h-4 mr-2" /> Manage Users & Lawyers
            </button>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {tab === 'verifications' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Verification Requests</h2>
              <p className="text-secondary mb-6">Approve or reject Bar Association credential submissions.</p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-secondary">
                      <th className="py-3 pr-4">Lawyer</th>
                      <th className="py-3 pr-4">Submitted</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {verificationRequests.map((r) => (
                      <tr key={r.id}>
                        <td className="py-4 pr-4 font-medium text-primary">{r.lawyerName}</td>
                        <td className="py-4 pr-4 text-secondary">{r.submittedAt}</td>
                        <td className="py-4 pr-4">{statusBadge(r.status)}</td>
                        <td className="py-4 pr-4">
                          <div className="flex gap-2">
                            <button className="btn-outline">View</button>
                            <button className="btn-primary">Approve</button>
                            <button className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'manage' && (
            <div className="card">
              <h2 className="text-2xl font-bold text-primary mb-2">Manage Accounts</h2>
              <p className="text-secondary mb-6">Manage lawyers, users, roles, and reported issues.</p>
              <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-secondary">
                  This section will be wired to `profiles` (roles) and moderation tables next.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

