import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, name: string, location: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const isDemoMode = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co'

    if (isDemoMode) {
      // Demo mode - create demo user immediately
      const demoUser = {
        id: 'demo-user',
        email: 'demo@citylawconnect.com',
        user_metadata: { name: 'Demo User', location: 'New York, NY' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User
      setUser(demoUser)
      setLoading(false)
      return
    }

    // Real Supabase mode - check for session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Supabase auth error:', error.message)
      }
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.warn('Supabase connection error:', error)
      setUser(null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, location: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const isDemoMode = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      // Demo mode - just set demo user
      const demoUser = {
        id: 'demo-user',
        email: email,
        user_metadata: { name, location },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User
      setUser(demoUser)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          location,
        },
      },
    })
    if (error) throw error
    if (data.user) {
      // Create user profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        location,
        email,
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const isDemoMode = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      // Demo mode - just set demo user
      const demoUser = {
        id: 'demo-user',
        email: email,
        user_metadata: { name: 'Demo User', location: 'New York, NY' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User
      setUser(demoUser)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const isDemoMode = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

