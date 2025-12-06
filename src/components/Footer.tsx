import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 mt-auto border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CityLaw Connect</h3>
            <p className="text-gray-300">
              Your trusted legal assistance platform powered by AI.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-secondary">
              <li>
                <Link to="/lawyers" className="hover:text-primary transition-colors">
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary transition-colors">
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-primary transition-colors">
                  Emergency Help
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-secondary">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-secondary">
              Email: support@citylawconnect.com<br />
              Phone: 1-800-LEGAL-HELP
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-secondary">
          <p>&copy; 2024 CityLaw Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

