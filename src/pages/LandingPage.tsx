import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MessageSquare, Users, FileText, Shield, Clock, Award } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-primary">AI-Powered Legal Assistance</span>
              <br />
              <span className="text-accent">When You Need It Most</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-secondary max-w-3xl mx-auto">
              Get instant legal guidance, connect with qualified lawyers, and navigate the legal system with confidence. Your trusted partner in legal matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard" className="bg-accent text-white px-8 py-4 rounded-lg font-bold hover:bg-accent-dark transition-colors text-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/auth/register" className="bg-accent text-white px-8 py-4 rounded-lg font-bold hover:bg-accent-dark transition-colors text-lg">
                    Get Help Now
                  </Link>
                  <Link to="/chat" className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors text-lg">
                    Try AI Chat
                  </Link>
                  <Link
                    to="/lawyer/login"
                    className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-bold hover:bg-accent hover:text-white transition-colors text-lg"
                  >
                    I’m a Lawyer
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Everything You Need for Legal Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Legal Chatbot</h3>
              <p className="text-secondary">
                Get instant legal guidance powered by GPT-4o. Ask questions, understand laws, and get personalized advice.
              </p>
            </div>
            
            <div className="card text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Lawyer Matching</h3>
              <p className="text-secondary">
                Find qualified lawyers in your area based on specialization, ratings, and availability.
              </p>
            </div>
            
            <div className="card text-center">
              <FileText className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Case Management</h3>
              <p className="text-secondary">
                Track your legal cases, manage documents, and stay organized throughout your legal journey.
              </p>
            </div>
            
            <div className="card text-center">
              <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-secondary">
                Your legal information is encrypted and protected with industry-leading security standards.
              </p>
            </div>
            
            <div className="card text-center">
              <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-secondary">
                Access legal assistance anytime, anywhere. Emergency help available around the clock.
              </p>
            </div>
            
            <div className="card text-center">
              <Award className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Expert Lawyers</h3>
              <p className="text-secondary">
                Connect with verified legal professionals with proven track records and client reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-xl text-secondary">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-xl text-secondary">Verified Lawyers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-xl text-secondary">Cases Resolved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of users who trust CityLaw Connect for their legal needs
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register" className="btn-accent text-lg px-8 py-4">
                Create User Account
              </Link>
              <Link
                to="/lawyer/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-colors text-lg"
              >
                Create Lawyer Account
              </Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

