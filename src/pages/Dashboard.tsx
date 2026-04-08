import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MessageSquare, Users, FileText, AlertCircle, TrendingUp } from 'lucide-react'

type NewsItem = {
  id: number
  title: string
  date: string
  category: string
  url: string
}

export default function Dashboard() {
  const { user } = useAuth()

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=legal OR law OR court OR "Supreme Court India"&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
        )

        if (!res.ok) {
          throw new Error('Failed to fetch news')
        }

        const data = await res.json()

        const formatted: NewsItem[] = (data.articles || [])
          .slice(0, 6)
          .map((item: any, index: number) => ({
            id: index,
            title: item.title || 'No Title',
            date: item.publishedAt
              ? item.publishedAt.split('T')[0]
              : 'N/A',
            category: item.source?.name || 'General',
            url: item.url || '#'
          }))

        setLegalNews(formatted)
      } catch (error) {
        console.error('Error fetching news:', error)
      }
    }

    fetchNews()
  }, [API_KEY])

  // Mock data - in real app, this would come from Supabase
  const recentChats = [
    { id: 1, topic: 'Employment Law', date: '2024-01-15', preview: 'Questions about workplace discrimination...' },
    { id: 2, topic: 'Contract Review', date: '2024-01-14', preview: 'Need help reviewing a rental agreement...' },
  ]

  const recommendedLawyers = [
    { id: 1, name: 'Sarah Johnson', specialization: 'Family Law', rating: 4.9, location: 'New York, NY' },
    { id: 2, name: 'Michael Chen', specialization: 'Criminal Law', rating: 4.8, location: 'New York, NY' },
    { id: 3, name: 'Emily Rodriguez', specialization: 'Employment Law', rating: 4.9, location: 'New York, NY' },
  ]

  const [legalNews, setLegalNews] = useState<NewsItem[]>([])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
        </h1>
        <p className="text-secondary">
          Here's what's happening with your legal matters today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/chat" className="card hover:shadow-lg transition-shadow">
          <MessageSquare className="w-8 h-8 text-accent mb-2" />
          <h3 className="font-bold mb-1">New Consultation</h3>
          <p className="text-sm text-secondary">Chat with AI assistant</p>
        </Link>

        <Link to="/lawyers" className="card hover:shadow-lg transition-shadow">
          <Users className="w-8 h-8 text-accent mb-2" />
          <h3 className="font-bold mb-1">Find Lawyer</h3>
          <p className="text-sm text-secondary">Search legal professionals</p>
        </Link>

        <Link to="/emergency" className="card hover:shadow-lg transition-shadow">
          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-bold mb-1">Emergency Help</h3>
          <p className="text-sm text-secondary">Urgent legal assistance</p>
        </Link>

        <Link to="/cases" className="card hover:shadow-lg transition-shadow">
          <FileText className="w-8 h-8 text-accent mb-2" />
          <h3 className="font-bold mb-1">My Cases</h3>
          <p className="text-sm text-secondary">View all cases</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Chats */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Recent Consultations</h2>
            <Link to="/chat" className="text-accent hover:text-accent-dark text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to="/chat"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{chat.topic}</h3>
                    <span className="text-sm text-secondary">{chat.date}</span>
                  </div>
                  <p className="text-sm text-secondary">{chat.preview}</p>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-secondary">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent consultations</p>
                <Link to="/chat" className="text-accent hover:text-accent-dark mt-2 inline-block">
                  Start a new consultation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Lawyers */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Recommended Lawyers</h2>
            <Link to="/lawyers" className="text-accent hover:text-accent-dark text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recommendedLawyers.map((lawyer) => (
              <Link
                key={lawyer.id}
                to={`/lawyers/${lawyer.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{lawyer.name}</h3>
                    <p className="text-sm text-secondary">{lawyer.specialization}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-accent">★</span>
                      <span className="font-bold">{lawyer.rating}</span>
                    </div>
                    <p className="text-xs text-secondary">{lawyer.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Legal News */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Legal News & Updates</h2>
            <Link to="/resources" className="text-accent hover:text-accent-dark text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalNews.map((news: NewsItem) => (
              <div key={news.id}>
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-xs text-secondary">{news.category}</span>
                  </div>
                  <h3 className="font-bold mb-1">{news.title}</h3>
                  <p className="text-sm text-secondary">{news.date}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


