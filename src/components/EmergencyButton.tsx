import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function EmergencyButton() {
  return (
    <Link
      to="/emergency"
      className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-700 text-white p-4 rounded-full shadow-lg z-50 flex items-center space-x-2 transition-colors"
    >
      <AlertCircle size={24} />
      <span className="hidden sm:inline font-bold">Emergency</span>
    </Link>
  )
}


