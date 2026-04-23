import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/10 bg-gradient-to-r from-slate-900 via-primary-dark to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CityLaw Connect</h3>
            <p className="text-slate-300">
              Your trusted legal assistance platform powered by AI.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/lawyers" className="transition-colors hover:text-accent-light">
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link to="/resources" className="transition-colors hover:text-accent-light">
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="transition-colors hover:text-accent-light">
                  Emergency Help
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/terms" className="transition-colors hover:text-accent-light">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-accent-light">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-slate-300">
              Email: support@citylawconnect.com<br />
              Phone: 1-800-LEGAL-HELP
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-slate-300">
          <p>&copy; 2024 CityLaw Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

