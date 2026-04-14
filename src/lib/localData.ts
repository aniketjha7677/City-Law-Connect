export type AppRole = 'user' | 'lawyer' | 'admin'

export type Review = {
  id: string
  lawyerId: string
  appointmentId?: string
  reviewerName: string
  rating: number // 1..5
  comment: string
  createdAt: string
}

export type Lawyer = {
  id: string
  name: string
  location: string
  specialization: string[]
  consultationFeePerHour: number
  successRate: number // 0..100
}

export type Appointment = {
  id: string
  lawyerId: string
  clientName: string
  clientEmail: string
  date: string // yyyy-mm-dd
  time: string // HH:mm
  durationMinutes: number
  consultationType: 'video' | 'phone' | 'in-person'
  caseDescription: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export type Payment = {
  id: string
  appointmentId: string
  lawyerId: string
  amount: number
  currency: 'USD' | 'INR'
  provider: 'stripe' | 'razorpay'
  status: 'pending' | 'paid' | 'failed'
  createdAt: string
}

const LS_KEY = 'clc_local_data_v1'

type LocalData = {
  lawyers: Lawyer[]
  reviews: Review[]
  appointments: Appointment[]
  payments: Payment[]
}

function nowIso() {
  return new Date().toISOString()
}

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function getLocalData(): LocalData {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) {
      const seeded = seedLocalData()
      setLocalData(seeded)
      return seeded
    }
    return JSON.parse(raw) as LocalData
  } catch {
    const seeded = seedLocalData()
    setLocalData(seeded)
    return seeded
  }
}

export function setLocalData(data: LocalData) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

export function seedLocalData(): LocalData {
  const lawyers: Lawyer[] = [
    {
      id: 'lawyer_1',
      name: 'Sarah Johnson',
      location: 'New York, NY',
      specialization: ['Family Law', 'Divorce'],
      consultationFeePerHour: 250,
      successRate: 92,
    },
    {
      id: 'lawyer_2',
      name: 'Michael Chen',
      location: 'New York, NY',
      specialization: ['Criminal Law', 'DUI Defense'],
      consultationFeePerHour: 300,
      successRate: 89,
    },
    {
      id: 'lawyer_3',
      name: 'Emily Rodriguez',
      location: 'Brooklyn, NY',
      specialization: ['Employment Law', 'Workplace Discrimination'],
      consultationFeePerHour: 275,
      successRate: 94,
    },
  ]

  const reviews: Review[] = [
    {
      id: randomId(),
      lawyerId: 'lawyer_1',
      reviewerName: 'John Doe',
      rating: 5,
      comment: 'Professional and very helpful.',
      createdAt: nowIso(),
    },
    {
      id: randomId(),
      lawyerId: 'lawyer_1',
      reviewerName: 'Jane Smith',
      rating: 5,
      comment: 'Clear communication and great outcome.',
      createdAt: nowIso(),
    },
    {
      id: randomId(),
      lawyerId: 'lawyer_2',
      reviewerName: 'Mike Johnson',
      rating: 4,
      comment: 'Strong defense strategy.',
      createdAt: nowIso(),
    },
    {
      id: randomId(),
      lawyerId: 'lawyer_3',
      reviewerName: 'Ava Patel',
      rating: 5,
      comment: 'Excellent guidance and very responsive.',
      createdAt: nowIso(),
    },
  ]

  return { lawyers, reviews, appointments: [], payments: [] }
}

export function getLawyerById(id: string) {
  return getLocalData().lawyers.find((l) => l.id === id) ?? null
}

export function upsertLawyer(lawyer: Lawyer) {
  const data = getLocalData()
  const idx = data.lawyers.findIndex((l) => l.id === lawyer.id)
  if (idx === -1) data.lawyers.push(lawyer)
  else data.lawyers[idx] = { ...data.lawyers[idx], ...lawyer }
  setLocalData(data)
  return lawyer
}

export function updateLawyer(lawyerId: string, patch: Partial<Omit<Lawyer, 'id'>>) {
  const data = getLocalData()
  const idx = data.lawyers.findIndex((l) => l.id === lawyerId)
  if (idx === -1) return null
  data.lawyers[idx] = { ...data.lawyers[idx], ...patch }
  setLocalData(data)
  return data.lawyers[idx]
}

export function getReviewsForLawyer(lawyerId: string) {
  return getLocalData().reviews.filter((r) => r.lawyerId === lawyerId)
}

export function computeLawyerRankingScore(lawyerId: string) {
  const data = getLocalData()
  const lawyer = data.lawyers.find((l) => l.id === lawyerId)
  if (!lawyer) return 0
  const reviews = data.reviews.filter((r) => r.lawyerId === lawyerId)
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  // Weighted score: rating (0..5) -> 0..60, success rate -> 0..40
  const ratingScore = (avgRating / 5) * 60
  const successScore = (Math.max(0, Math.min(100, lawyer.successRate)) / 100) * 40
  // small boost for volume
  const volumeBoost = Math.min(10, reviews.length)
  return Math.round(ratingScore + successScore + volumeBoost)
}

export function getRankedLawyers() {
  const data = getLocalData()
  return data.lawyers
    .map((l) => {
      const reviews = data.reviews.filter((r) => r.lawyerId === l.id)
      const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
      return {
        ...l,
        avgRating: Number(avgRating.toFixed(1)),
        reviewsCount: reviews.length,
        rankingScore: computeLawyerRankingScore(l.id),
      }
    })
    .sort((a, b) => b.rankingScore - a.rankingScore)
}

export function createAppointment(input: Omit<Appointment, 'id' | 'createdAt' | 'status'> & { status?: Appointment['status'] }) {
  const data = getLocalData()
  const appt: Appointment = {
    id: randomId(),
    createdAt: nowIso(),
    status: input.status ?? 'confirmed',
    ...input,
  }
  data.appointments.unshift(appt)
  setLocalData(data)
  return appt
}

export function listAppointmentsForLawyer(lawyerId: string) {
  return getLocalData().appointments.filter((a) => a.lawyerId === lawyerId)
}

export function listAppointmentsForClient(clientEmail: string) {
  return getLocalData().appointments.filter((a) => a.clientEmail.toLowerCase() === clientEmail.toLowerCase())
}

export function getAppointmentById(appointmentId: string) {
  return getLocalData().appointments.find((a) => a.id === appointmentId) ?? null
}

export function updateAppointmentStatus(appointmentId: string, status: Appointment['status']) {
  const data = getLocalData()
  const idx = data.appointments.findIndex((a) => a.id === appointmentId)
  if (idx === -1) return null
  data.appointments[idx] = { ...data.appointments[idx], status }
  setLocalData(data)
  return data.appointments[idx]
}

export function createPayment(input: Omit<Payment, 'id' | 'createdAt' | 'status'> & { status?: Payment['status'] }) {
  const data = getLocalData()
  const payment: Payment = {
    id: randomId(),
    createdAt: nowIso(),
    status: input.status ?? 'paid',
    ...input,
  }
  data.payments.unshift(payment)
  setLocalData(data)
  return payment
}

export function listPaymentsForLawyer(lawyerId: string) {
  return getLocalData().payments.filter((p) => p.lawyerId === lawyerId)
}

export function listPaymentsForAppointment(appointmentId: string) {
  return getLocalData().payments.filter((p) => p.appointmentId === appointmentId)
}

export function hasReviewForAppointment(appointmentId: string) {
  return getLocalData().reviews.some((r) => r.appointmentId === appointmentId)
}

export function createReview(input: Omit<Review, 'id' | 'createdAt'>) {
  const data = getLocalData()
  const review: Review = {
    id: randomId(),
    createdAt: nowIso(),
    ...input,
  }
  data.reviews.unshift(review)
  setLocalData(data)
  return review
}

