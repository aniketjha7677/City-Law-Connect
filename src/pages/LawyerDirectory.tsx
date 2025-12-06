import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Filter } from 'lucide-react'

interface Lawyer {
  id: number
  name: string
  specialization: string[]
  rating: number
  reviews: number
  location: string
  price: string
  availability: string
  image?: string
}

export default function LawyerDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  // Mock data - in real app, this would come from Supabase
  const lawyers: Lawyer[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialization: ['Family Law', 'Divorce'],
      rating: 4.9,
      reviews: 127,
      location: 'New York, NY',
      price: '$250/hr',
      availability: 'Available this week',
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialization: ['Criminal Law', 'DUI Defense'],
      rating: 4.8,
      reviews: 89,
      location: 'New York, NY',
      price: '$300/hr',
      availability: 'Available today',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      specialization: ['Employment Law', 'Workplace Discrimination'],
      rating: 4.9,
      reviews: 156,
      location: 'Brooklyn, NY',
      price: '$275/hr',
      availability: 'Available this week',
    },
    {
      id: 4,
      name: 'David Thompson',
      specialization: ['Real Estate', 'Property Law'],
      rating: 4.7,
      reviews: 94,
      location: 'Queens, NY',
      price: '$225/hr',
      availability: 'Available tomorrow',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      specialization: ['Personal Injury', 'Medical Malpractice'],
      rating: 4.8,
      reviews: 203,
      location: 'Manhattan, NY',
      price: '$350/hr',
      availability: 'Available this week',
    },
    {
      id: 6,
      name: 'Robert Martinez',
      specialization: ['Business Law', 'Contracts'],
      rating: 4.6,
      reviews: 67,
      location: 'New York, NY',
      price: '$400/hr',
      availability: 'Available today',
    },
  ]

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

