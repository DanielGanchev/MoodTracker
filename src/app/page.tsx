'use client'

import { useAuth } from '@/contexts/AuthContext'
import MoodTracker from '@/components/MoodTracker'
import Login from '@/components/Login'

export default function Home() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-pink-lightest">
        <div className="text-pink-dark">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-pink-lightest">
      {profile ? <MoodTracker /> : <Login />}
    </main>
  )
}
