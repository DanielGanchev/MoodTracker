'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Profile } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type AuthContextType = {
  profile: Profile | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, created_at')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          return
        }
        setProfile(data as Profile)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true)

      console.log(`Attempting to sign in with username: ${username}`)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@gmail.com`,
        password,
      })

      if (error) {
        console.error('Authentication error:', error)
        toast.error('Authentication failed. Please check your credentials.')
        setLoading(false)
        return
      }

      if (!data.user) {
        console.error('No user returned after successful auth')
        toast.error('Could not retrieve user information.')
        setLoading(false)
        return
      }

      console.log(
        `Authentication successful for user ID: ${data.user.id}, fetching profile...`
      )

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)

        if (profileError.code === 'PGRST116') {
          console.log(
            'Profile not found, creating a new profile for this user...'
          )

          // Create a profile for this authenticated user since they don't have one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                username: username,
              },
            ])
            .select()
            .single()

          if (createError) {
            console.error('Error creating profile:', createError)
            toast.error('Failed to create profile. Please try again later.')
            setLoading(false)
            return
          }

          console.log('Successfully created profile for', username)
          setProfile(newProfile as Profile)
          toast.success(`Welcome, ${username}! Your profile has been created.`)
          setLoading(false)
          return
        } else {
          toast.error('Error retrieving profile. Please try again.')
          setLoading(false)
          return
        }
      }

      console.log(`Successfully fetched profile for ${profile.username}`)
      setProfile(profile as Profile)
      toast.success(`Welcome back, ${profile.username}!`)
      setLoading(false)
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      toast.error('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
