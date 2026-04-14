import { ReactNode } from 'react'
import LawyerNavigation from './LawyerNavigation'

export default function LawyerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <LawyerNavigation />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-secondary flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span className="font-medium text-primary">CityLaw Connect — Lawyer Portal</span>
          <span>&copy; 2024 CityLaw Connect</span>
        </div>
      </footer>
    </div>
  )
}

