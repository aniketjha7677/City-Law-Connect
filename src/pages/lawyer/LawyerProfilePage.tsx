import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Save, UserCircle2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getLawyerById, updateLawyer, upsertLawyer } from '../../lib/localData'

function parseTags(input: string) {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function LawyerProfilePage() {
  const { profile } = useAuth()
  const lawyerId = profile?.id ?? 'lawyer_1'

  const existing = getLawyerById(lawyerId)

  // Ensure record exists for any newly created lawyer accounts
  useMemo(() => {
    if (!existing) {
      upsertLawyer({
        id: lawyerId,
        name: profile?.name ?? 'Lawyer',
        location: profile?.location ?? '',
        specialization: ['General'],
        consultationFeePerHour: 200,
        successRate: 80,
      })
    }
  }, [existing, lawyerId, profile?.location, profile?.name])

  const lawyer = getLawyerById(lawyerId)

  const [form, setForm] = useState(() => ({
    name: lawyer?.name ?? profile?.name ?? '',
    location: lawyer?.location ?? profile?.location ?? '',
    specializationCsv: (lawyer?.specialization ?? ['General']).join(', '),
    consultationFeePerHour: lawyer?.consultationFeePerHour ?? 200,
    successRate: lawyer?.successRate ?? 80,
  }))

  const handleSave = () => {
    const specialization = parseTags(form.specializationCsv)
    const successRate = Math.max(0, Math.min(100, Number(form.successRate)))
    const fee = Math.max(0, Number(form.consultationFeePerHour))

    updateLawyer(lawyerId, {
      name: form.name || 'Lawyer',
      location: form.location,
      specialization: specialization.length ? specialization : ['General'],
      consultationFeePerHour: fee,
      successRate,
    })
    toast.success('Profile updated')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Profile</h1>
        <p className="text-secondary mt-1">Update your professional profile (offline mode).</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
            <UserCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-primary">{(profile?.name ?? form.name) || 'Lawyer'}</div>
            <div className="text-sm text-secondary">{profile?.email ?? ''}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              className="input-field"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="City, State"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Specializations (comma separated)</label>
            <input
              className="input-field"
              value={form.specializationCsv}
              onChange={(e) => setForm({ ...form, specializationCsv: e.target.value })}
              placeholder="Family Law, Divorce, Child Custody"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consultation fee (per hour)</label>
            <input
              className="input-field"
              type="number"
              min={0}
              value={form.consultationFeePerHour}
              onChange={(e) => setForm({ ...form, consultationFeePerHour: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Success rate (%)</label>
            <input
              className="input-field"
              type="number"
              min={0}
              max={100}
              value={form.successRate}
              onChange={(e) => setForm({ ...form, successRate: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="btn-primary flex items-center gap-2" onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save changes
          </button>
          <div className="text-sm text-secondary flex items-center">
            Changes affect ranking, booking price, and analytics immediately.
          </div>
        </div>
      </div>
    </div>
  )
}

