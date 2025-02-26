'use client'

import { useState, useEffect, useMemo } from 'react'
import { MoodEntry, MoodRating, getMoodLabel, getMoodEmoji } from '@/types'
import useMoodEntries from '@/hooks/useMoodEntries'
import MoodForm from './MoodForm'
import CalendarView from './CalendarView'
import StatsView from './StatsView'
import GraphsView from './GraphsView'
import { useAuth } from '@/contexts/AuthContext'
import PDFExportModal from './PDFExportModal'

type View = 'mood' | 'calendar' | 'stats' | 'graphs'

const MoodTracker = () => {
  const { signOut, profile } = useAuth()
  const [selectedMood, setSelectedMood] = useState<MoodRating | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentView, setCurrentView] = useState<View>('mood')
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null)
  const [showPDFExportModal, setShowPDFExportModal] = useState(false)

  const { entries, addEntry, updateEntry, refreshEntries } = useMoodEntries()

  // Add effect to refresh entries when component mounts
  useEffect(() => {
    if (profile) {
      refreshEntries()
    }
  }, [profile, refreshEntries])

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

  const handleSubmitEntry = async (
    entryData: Omit<MoodEntry, 'id'> & { id?: string }
  ) => {
    // Guard against operations without a valid profile
    if (!profile || !profile.id) {
      console.error('Cannot save entry: No valid profile')
      alert('Please log in again to save entries.')
      return
    }

    // Make sure profile_id is always the current user's profile ID
    const dataWithCorrectProfileId = {
      ...entryData,
      profile_id: profile.id,
      // Ensure checkbox values are explicit booleans
      had_dream: entryData.had_dream === true,
      has_period: entryData.has_period === true,
      has_ovulation: entryData.has_ovulation === true,
    }

    console.log('Submitting entry with correct data:', dataWithCorrectProfileId)

    try {
      let result
      if (entryData.id && entryData.id !== 'new') {
        // If we have a real ID (not 'new'), it's an update
        console.log('Updating entry with ID:', entryData.id)
        result = await updateEntry({
          ...dataWithCorrectProfileId,
          id: entryData.id,
        } as MoodEntry)
      } else {
        // If no ID or ID is 'new', it's a new entry - remove the id
        const { id, ...newEntryData } = dataWithCorrectProfileId
        console.log('Adding new entry with profile_id:', profile.id)
        result = await addEntry({
          ...newEntryData,
          date: entryData.date || new Date().toISOString(),
        })
      }

      // Close the form
      setShowForm(false)
      setSelectedEntry(null)

      // Always manually refresh entries after submission to ensure UI is updated
      console.log('Refreshing entries after form submission')
      await refreshEntries()

      console.log('Form submission complete, result:', result)
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('There was an error saving your entry. Please try again.')
    }
  }

  const handleDayClick = (entry: MoodEntry | null, date: Date) => {
    if (entry) {
      // If there's an existing entry, edit it
      console.log('Editing existing entry:', entry)
      console.log('Entry has boolean values:', {
        had_dream: entry.had_dream === true,
        has_period: entry.has_period === true,
        has_ovulation: entry.has_ovulation === true,
      })

      setSelectedEntry(entry)
      setSelectedMood(entry.mood as MoodRating)
      setShowForm(true)
    } else {
      // If no entry exists, create a new one
      // Check if profile is available first
      if (!profile || !profile.id) {
        console.error('Cannot create new entry: No valid profile')
        alert('Please log in again to create entries.')
        return
      }

      setSelectedEntry(null)
      setSelectedMood(5 as MoodRating) // Default mood value

      // Set the timestamp to the clicked date
      const newDate = new Date(date)
      newDate.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues

      // Create a new entry with default values
      const newEntry: MoodEntry = {
        id: 'new', // Use 'new' as a temporary ID to indicate this is a new entry
        date: newDate.toISOString(),
        mood: 5 as MoodRating,
        sleep_quality: 5,
        mind_clarity: 5,
        motivation: 5,
        energy: 5,
        productivity: 5,
        emotional_stability: 5,
        appetite: 5,
        sex_drive: 5,
        cravings: 5,
        notes: '',
        created_at: '', // Empty string initially
        updated_at: '', // Empty string initially
        profile_id: profile.id, // Use profile.id directly since we checked it exists
        has_period: false,
        has_ovulation: false,
        had_dream: false,
      }

      // Update timestamps in state after render
      setSelectedEntry(newEntry)
      setShowForm(true)

      // Update timestamps client-side only
      setTimeout(() => {
        setSelectedEntry((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        })
      }, 0)
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
                className="flex flex-col items-center space-y-1 hover:text-white transition-colors"
                onClick={() => setShowPDFExportModal(true)}
                aria-label="Export to PDF"
              >
                <span className="text-xl">👤</span>
                <span className="text-xs">Export PDF</span>
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
          selectedMood={selectedMood || (selectedEntry!.mood as MoodRating)}
          onSubmit={handleSubmitEntry}
          onCancel={() => {
            setShowForm(false)
            setSelectedEntry(null)
          }}
          initialValues={selectedEntry}
        />
      )}

      {showPDFExportModal && (
        <PDFExportModal
          isOpen={showPDFExportModal}
          onClose={() => setShowPDFExportModal(false)}
        />
      )}
    </div>
  )
}

export default MoodTracker
