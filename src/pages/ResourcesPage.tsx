import { useState } from 'react'
import { FileText, Book, HelpCircle, Download, Search } from 'lucide-react'

interface Resource {
  id: number
  title: string
  category: string
  type: 'document' | 'article' | 'faq'
  description: string
  downloadUrl?: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'all',
    'Family Law',
    'Employment Law',
    'Criminal Law',
    'Real Estate',
    'Business Law',
    'Personal Injury',
  ]

  // Mock data - in real app, this would come from Supabase
  const resources: Resource[] = [
    {
      id: 1,
      title: 'Divorce Petition Template',
      category: 'Family Law',
      type: 'document',
      description: 'Standard template for filing a divorce petition',
    },
    {
      id: 2,
      title: 'Understanding Your Rights: Employment Discrimination',
      category: 'Employment Law',
      type: 'article',
      description: 'Comprehensive guide to employment discrimination laws and your rights',
    },
    {
      id: 3,
      title: 'What should I do if I\'m arrested?',
      category: 'Criminal Law',
      type: 'faq',
      description: 'Important steps to take if you are arrested',
    },
    {
      id: 4,
      title: 'Rental Agreement Template',
      category: 'Real Estate',
      type: 'document',
      description: 'Standard rental agreement template for landlords and tenants',
    },
    {
      id: 5,
      title: 'Business Contract Basics',
      category: 'Business Law',
      type: 'article',
      description: 'Essential elements of a valid business contract',
    },
    {
      id: 6,
      title: 'Workplace Harassment: Know Your Rights',
      category: 'Employment Law',
      type: 'article',
      description: 'Understanding workplace harassment laws and reporting procedures',
    },
    {
      id: 7,
      title: 'How do I file for child custody?',
      category: 'Family Law',
      type: 'faq',
      description: 'Step-by-step guide to filing for child custody',
    },
    {
      id: 8,
      title: 'Personal Injury Claim Form',
      category: 'Personal Injury',
      type: 'document',
      description: 'Template for filing a personal injury claim',
    },
  ]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="w-6 h-6" />
      case 'article':
        return <Book className="w-6 h-6" />
      case 'faq':
        return <HelpCircle className="w-6 h-6" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Legal Resources</h1>
        <p className="text-secondary">
          Access legal documents, educational articles, and frequently asked questions
        </p>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-primary">
                {getIcon(resource.type)}
              </div>
              <div className="flex-1">
                <span className="text-xs text-secondary bg-gray-100 px-2 py-1 rounded">
                  {resource.category}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-2">{resource.title}</h3>
                <p className="text-sm text-secondary mb-4">{resource.description}</p>
                {resource.type === 'document' && (
                  <button className="btn-outline w-full flex items-center justify-center space-x-2">
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                )}
                {resource.type === 'article' && (
                  <button className="btn-outline w-full">Read Article</button>
                )}
                {resource.type === 'faq' && (
                  <button className="btn-outline w-full">View Answer</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-secondary mb-4">No resources found</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Legal Glossary Section */}
      <div className="mt-12 card">
        <h2 className="text-2xl font-bold mb-6">Legal Glossary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { term: 'Affidavit', definition: 'A written statement confirmed by oath or affirmation' },
            { term: 'Plaintiff', definition: 'A person who brings a case against another in a court of law' },
            { term: 'Defendant', definition: 'An individual or entity being accused or sued in a court proceeding' },
            { term: 'Litigation', definition: 'The process of taking legal action' },
            { term: 'Settlement', definition: 'An agreement reached between parties to resolve a dispute' },
            { term: 'Subpoena', definition: 'A writ ordering a person to attend a court' },
          ].map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-primary mb-2">{item.term}</h3>
              <p className="text-sm text-secondary">{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

