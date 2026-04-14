import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star } from 'lucide-react'
import { getRankedLawyers } from '../lib/localData'

interface Lawyer {
  id: string
  name: string
  specialization: string[]
  rating: number
  reviews: number
  location: string
  price: string
  availability: string
  image?: string
  rankingScore: number
  successRate: number
}

export default function LawyerDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const lawyers: Lawyer[] = getRankedLawyers().map((l) => ({
    id: l.id,
    name: l.name,
    specialization: l.specialization,
    rating: l.avgRating,
    reviews: l.reviewsCount,
    location: l.location,
    price: `$${l.consultationFeePerHour}/hr`,
    availability: 'Available this week',
    rankingScore: l.rankingScore,
    successRate: l.successRate,
  }))

  const specializations = [
    'all',
    'Family Law',
    'Criminal Law',
    'Employment Law',
    'Real Estate',
    'Personal Injury',
    'Business Law',
  ]

  const filteredLawyers = lawyers
    .filter((lawyer) => {
      const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialization.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSpecialization = selectedSpecialization === 'all' ||
        lawyer.specialization.includes(selectedSpecialization)
      return matchesSearch && matchesSpecialization
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'rank':
          return b.rankingScore - a.rankingScore
        case 'success':
          return b.successRate - a.successRate
        case 'reviews':
          return b.reviews - a.reviews
        case 'price-low':
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))
        case 'price-high':
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))
        default:
          return 0
      }
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Find a Lawyer</h1>
        <p className="text-secondary">
          Search for qualified legal professionals in your area
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="input-field"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec === 'all' ? 'All Specializations' : spec}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="rank">Sort by Rank (Reviews + Success)</option>
            <option value="success">Sort by Success Rate</option>
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Reviews</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-secondary">
          Found {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Lawyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.map((lawyer) => (
          <Link
            key={lawyer.id}
            to={`/lawyers/${lawyer.id}`}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                {lawyer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{lawyer.name}</h3>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span className="font-bold">{lawyer.rating}</span>
                  <span className="text-sm text-secondary">({lawyer.reviews} reviews)</span>
                </div>
                <div className="text-xs text-secondary">
                  Rank score: <span className="font-bold text-primary">{lawyer.rankingScore}</span> • Success:{' '}
                  <span className="font-bold text-primary">{lawyer.successRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {lawyer.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-1 bg-gray-100 text-sm rounded text-secondary"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-sm text-secondary mb-1">
                <MapPin size={16} className="mr-1" />
                {lawyer.location}
              </div>
              <div className="text-sm text-secondary">
                {lawyer.availability}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-lg font-bold text-primary">{lawyer.price}</span>
              <span className="text-sm text-accent">View Profile →</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-secondary mb-4">No lawyers found matching your criteria</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedSpecialization('all')
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}


