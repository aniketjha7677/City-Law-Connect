import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Clock, DollarSign, Calendar, MessageSquare, Phone, Mail } from 'lucide-react'
import { getLawyerById, getReviewsForLawyer } from '../lib/localData'

export default function LawyerProfile() {
  const { id } = useParams()

  const lawyerBase = getLawyerById(id || 'lawyer_1')
  const reviewsData = getReviewsForLawyer(id || 'lawyer_1')
  const rating =
    reviewsData.length ? reviewsData.reduce((s, r) => s + r.rating, 0) / reviewsData.length : 0

  const lawyer = {
    id: id || 'lawyer_1',
    name: lawyerBase?.name ?? 'Lawyer',
    specialization: lawyerBase?.specialization ?? [],
    rating: Number(rating.toFixed(1)),
    reviews: reviewsData.length,
    location: lawyerBase?.location ?? '',
    address: '123 Legal Street, Suite 400, New York, NY 10001',
    price: `$${lawyerBase?.consultationFeePerHour ?? 0}/hr`,
    availability: 'Available this week',
    experience: '10+ years',
    education: 'J.D.',
    bio: 'This lawyer profile is running in offline mode. You can extend this data in `src/lib/localData.ts`.',
    languages: ['English'],
    consultationTypes: ['Video Call', 'Phone Call', 'In-Person'],
    successRate: lawyerBase?.successRate ?? 0,
  }

  const reviews = reviewsData.map((r) => ({
    id: r.id,
    name: r.reviewerName,
    rating: r.rating,
    date: r.createdAt.split('T')[0],
    comment: r.comment,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/lawyers" className="text-accent hover:text-accent-dark mb-4 inline-block">
        ← Back to Lawyer Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="card">
            <div className="flex items-start space-x-6 mb-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {lawyer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{lawyer.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-accent fill-current" />
                  <span className="text-xl font-bold">{lawyer.rating}</span>
                  <span className="text-secondary">({lawyer.reviews} reviews)</span>
                </div>
                <div className="text-sm text-secondary mb-4">
                  Success rate: <span className="font-bold text-primary">{lawyer.successRate}%</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {lawyer.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-primary text-white text-sm rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-secondary mb-2">
                  <MapPin size={18} className="mr-2" />
                  {lawyer.location}
                </div>
                <div className="flex items-center text-secondary">
                  <Clock size={18} className="mr-2" />
                  {lawyer.availability}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-secondary mb-4">{lawyer.bio}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-secondary">Experience:</span>
                  <p className="font-bold">{lawyer.experience}</p>
                </div>
                <div>
                  <span className="text-sm text-secondary">Education:</span>
                  <p className="font-bold">{lawyer.education}</p>
                </div>
                <div>
                  <span className="text-sm text-secondary">Languages:</span>
                  <p className="font-bold">{lawyer.languages.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{review.name}</h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-accent fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-secondary">{review.date}</span>
                  </div>
                  <p className="text-secondary">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <div className="card sticky top-4">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary mb-2">{lawyer.price}</div>
              <p className="text-sm text-secondary">per hour</p>
            </div>

            <Link
              to={`/book/${lawyer.id}`}
              className="w-full btn-primary mb-4 text-center block"
            >
              Book Consultation
            </Link>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-secondary">
                <Calendar size={18} className="mr-3" />
                <span>Available this week</span>
              </div>
              <div className="flex items-center text-secondary">
                <MessageSquare size={18} className="mr-3" />
                <span>Response time: Within 24 hours</span>
              </div>
              <div className="flex items-center text-secondary">
                <DollarSign size={18} className="mr-3" />
                <span>Free initial consultation</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold mb-2">Consultation Types</h3>
              <ul className="space-y-2 text-sm text-secondary">
                {lawyer.consultationTypes.map((type) => (
                  <li key={type} className="flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-bold mb-2">Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-secondary">
                  <Phone size={16} className="mr-2" />
                  (555) 123-4567
                </div>
                <div className="flex items-center text-secondary">
                  <Mail size={16} className="mr-2" />
                  sarah.johnson@lawfirm.com
                </div>
                <div className="flex items-start text-secondary">
                  <MapPin size={16} className="mr-2 mt-1" />
                  <span>{lawyer.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


