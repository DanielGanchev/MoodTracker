import { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { MoodEntry } from '@/types'
import { supabase, toCamelCase } from '@/lib/supabase'

// Use dynamic import with ssr disabled to avoid hydration issues with Chart.js
const MoodTrends = dynamic(() => import('@/components/MoodTrends'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-pink-400 rounded-3xl text-white p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  ),
})

export default function MoodTrendsPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        setLoading(true)

        const { data: session } = await supabase.auth.getSession()

        if (!session?.session?.user) {
          // Redirect to login if not authenticated
          window.location.href = '/login'
          return
        }

        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('profile_id', session.session.user.id)
          .order('date', { ascending: true })

        if (error) {
          throw error
        }

        if (data) {
          // Convert snake_case to camelCase
          const formattedData = data.map((entry) =>
            toCamelCase(entry)
          ) as MoodEntry[]
          setMoodEntries(formattedData)
        }
      } catch (error) {
        console.error('Error fetching mood entries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMoodEntries()
  }, [])

  return (
    <>
      <Head>
        <title>Mood Trends | Mood Tracker</title>
        <meta name="description" content="View your mood trends over time" />
      </Head>

      <main className="min-h-screen bg-pink-50">
        <div className="container mx-auto py-4 px-4">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <MoodTrends moodEntries={moodEntries} />
          )}
        </div>
      </main>
    </>
  )
}
