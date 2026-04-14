import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'


export type AppRole = 'user' | 'lawyer' | 'admin'

export type Profile = {
  id: string
  email: string | null
  name: string | null
  location: string | null
  role: AppRole
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  role: AppRole | null
  loading: boolean
  signUp: (email: string, password: string, name: string, location: string) => Promise<void> // user signup (back-compat)
  signUpLawyer: (input: { email: string; password: string; name: string; location: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<AppRole | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const role: AppRole | null = useMemo(() => profile?.role ?? null, [profile?.role])

  const fetchProfile = async (userId: string) => {


    const { data, error } = await supabase
      .from('profiles')
      .select('id,email,full_name,city,state,role')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      setProfile(null)
      return
    }

    setProfile({
      id: data.id,
      email: data.email ?? null,
      name: data.full_name ?? null,
      location: data.city ?? null,
      role: (data.role ?? 'user') as AppRole,
    })
  }

  useEffect(() => {
    // Local-only mode (no database): restore local session if exists.


    // Real Supabase mode - check for session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Supabase auth error:', error.message)
      }
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        fetchProfile(session.user.id).catch((e) => {
          console.warn('Profile fetch error:', e?.message ?? e)
          setProfile(null)
        })
      } else {
        setProfile(null)
      }
      setLoading(false)
    }).catch((error) => {
      console.warn('Supabase connection error:', error)
      setUser(null)
      setProfile(null)
      setLoading(false)
    })

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        fetchProfile(session.user.id).catch((e) => {
          console.warn('Profile fetch error:', e?.message ?? e)
          setProfile(null)
        })
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, location: string) => {


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
        full_name: name,
        email,
        city: location,   // or split if needed
        role: 'user',
      })
      await fetchProfile(data.user.id)
    }
  }

  const signUpLawyer = async (input: { email: string; password: string; name: string; location: string }) => {
    const { email, password, name, location } = input


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
      // Create lawyer profile + lawyer row (minimal defaults)
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        email,
        city: location,
        role: 'lawyer',
      })

      await supabase.from('lawyers').insert({
        id: data.user.id,
        display_name: name,
        location,
        consultation_fee: 0,
        verified_status: 'pending',
      })

      await fetchProfile(data.user.id)
    }
  }

  const signIn = async (email: string, password: string): Promise<AppRole | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError) throw profileError

    return profileData?.role ?? null
  }

  return null
}

  const signOut = async () => {

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, signUp, signUpLawyer, signIn, signOut }}>
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

