import { ReactNode } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import EmergencyButton from './EmergencyButton'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/40 to-amber-50/60">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <EmergencyButton />
    </div>
  )
}


