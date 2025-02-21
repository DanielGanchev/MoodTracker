'use client'

import { useState } from 'react'
import { MoodEntry, MoodRating, getMoodLabel, getMoodEmoji } from '@/types'
import useMoodEntries from '@/hooks/useMoodEntries'
import MoodForm from './MoodForm'
import CalendarView from './CalendarView'
import StatsView from './StatsView'
import GraphsView from './GraphsView'
import { useAuth } from '@/contexts/AuthContext'

type View = 'mood' | 'calendar' | 'stats' | 'graphs'

const MoodTracker = () => {
  const { signOut } = useAuth()
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentView, setCurrentView] = useState<View>('mood')
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null)

  const { entries, addEntry, updateEntry } = useMoodEntries()

  const moodOptions: Array<{
    rating: MoodRating
    label: string
    emoji: string
    color: string
  }> = Array.from({ length: 10 }, (_, i) => {
    const rating = (i + 1) as MoodRating
    return {
      rating,
      label: getMoodLabel(rating),
      emoji: getMoodEmoji(rating),
      color: 'bg-pink-600',
    }
  })

  const handleMoodSelect = (rating: MoodRating) => {
    setSelectedMood(rating)
  }

  const handleSubmitEntry = (
    entryData: Omit<MoodEntry, 'id'> & { id?: string }
  ) => {
    if (entryData.id) {
      // If we have an ID, it's an update
      updateEntry({
        ...entryData,
        id: entryData.id,
      } as MoodEntry)
    } else {
      // If no ID, it's a new entry
      addEntry({
        ...entryData,
        timestamp: entryData.timestamp || new Date().toISOString(),
      })
    }
    setShowForm(false)
    setSelectedEntry(null)
  }

  const handleDayClick = (entry: MoodEntry | null, date: Date) => {
    if (entry) {
      // If there's an existing entry, edit it
      setSelectedEntry(entry)
      setSelectedMood(entry.moodRating)
      setShowForm(true)
    } else {
      // If no entry exists, create a new one
      setSelectedEntry(null)
      setSelectedMood(5) // Default mood value
      setShowForm(true)
      // Set the timestamp to the clicked date
      const newDate = new Date(date)
      newDate.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues
      setSelectedEntry({
        id: '',
        timestamp: newDate.toISOString(),
        moodRating: 5 as MoodRating,
        sleepQuality: 5,
        hadDream: false,
        description: '',
        hasPeriod: false,
        hasOvulation: false,
        mindClarity: 5,
        motivation: 5,
        energyLevel: 5,
        productivity: 5,
        emotionalStability: 5,
        appetite: 5,
        sexDrive: 5,
        cravings: 5,
      })
    }
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
    setSelectedMood(null)
    setShowForm(false)
  }

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <CalendarView
            entries={entries}
            onDayClick={handleDayClick}
            onBack={() => handleViewChange('mood')}
          />
        )
      case 'stats':
        return (
          <StatsView
            entries={entries}
            onBack={() => handleViewChange('mood')}
          />
        )
      case 'graphs':
        return (
          <GraphsView
            entries={entries}
            onBack={() => handleViewChange('mood')}
          />
        )
      default:
        return (
          <div className="w-full max-w-md bg-pink-dark rounded-3xl p-6 space-y-8">
            <div className="flex justify-end">
              <button
                onClick={signOut}
                className="text-white/60 hover:text-white transition-colors text-sm"
              >
                Logout
              </button>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              How Do You Feel Today?
            </h1>

            <div className="relative flex justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-medium to-pink hover:from-pink-light hover:to-pink-medium flex items-center justify-center">
                {selectedMood ? (
                  <span className="text-6xl">
                    {moodOptions[selectedMood - 1].emoji}
                  </span>
                ) : (
                  <span className="text-6xl">😊</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={selectedMood || 5}
                onChange={(e) =>
                  handleMoodSelect(Number(e.target.value) as MoodRating)
                }
                className="w-full accent-[#f765aa]"
              />
              <div className="flex justify-between text-white/60 text-xs">
                {[1, 3, 5, 7, 10].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              <div className="text-center text-white">
                {selectedMood && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">
                      {getMoodEmoji(selectedMood)}
                    </span>
                    <span>{getMoodLabel(selectedMood)}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => selectedMood && setShowForm(true)}
              className={`w-full py-4 rounded-xl mt-6 font-semibold transition-colors
                ${
                  selectedMood
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-pink-800 text-white/50 cursor-not-allowed'
                }`}
              disabled={!selectedMood}
              aria-label="Note mood"
            >
              Note Mood
            </button>

            <div className="flex justify-between mt-8 text-white/60">
              <button
                onClick={() => handleViewChange('calendar')}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleViewChange('calendar')
                }
                className="flex flex-col items-center space-y-1 hover:text-white transition-colors"
                tabIndex={0}
                aria-label="View calendar"
              >
                <span className="text-xl">📅</span>
                <span className="text-xs">Calendar</span>
              </button>
              <button
                onClick={() => handleViewChange('graphs')}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleViewChange('graphs')
                }
                className="flex flex-col items-center space-y-1 hover:text-white transition-colors"
                tabIndex={0}
                aria-label="View graphs"
              >
                <span className="text-xl">📊</span>
                <span className="text-xs">Graphs</span>
              </button>
              <button
                onClick={() => handleViewChange('stats')}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleViewChange('stats')
                }
                className="flex flex-col items-center space-y-1 hover:text-white transition-colors"
                tabIndex={0}
                aria-label="View statistics"
              >
                <span className="text-xl">📈</span>
                <span className="text-xs">Stats</span>
              </button>
              <button
                className="flex flex-col items-center space-y-1 hover:text-white transition-colors opacity-50 cursor-not-allowed"
                disabled
                aria-label="Profile (coming soon)"
              >
                <span className="text-xl">👤</span>
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-pink-lightest p-6">
      {renderView()}

      {showForm && (selectedMood || selectedEntry) && (
        <MoodForm
          selectedMood={selectedMood || selectedEntry!.moodRating}
          onSubmit={handleSubmitEntry}
          onCancel={() => {
            setShowForm(false)
            setSelectedEntry(null)
          }}
          initialValues={selectedEntry}
        />
      )}
    </div>
  )
}

export default MoodTracker
