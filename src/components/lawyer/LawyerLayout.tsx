import { ReactNode } from 'react'
import LawyerNavigation from './LawyerNavigation'

export default function LawyerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50">
      <LawyerNavigation />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <footer className="border-t border-emerald-900/10 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-emerald-100/85 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span className="font-medium text-amber-200">CityLaw Connect — Lawyer Portal</span>
          <span>&copy; 2024 CityLaw Connect</span>
        </div>
      </footer>
    </div>
  )
}

