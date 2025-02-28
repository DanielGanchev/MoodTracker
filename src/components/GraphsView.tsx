'use client'

import { useState, useEffect } from 'react'
import { MoodEntry } from '@/types'
import CombinedGraph from './CombinedGraph'

interface GraphsViewProps {
  entries: MoodEntry[]
  onBack: () => void
}

// Define the metrics with their exact data keys that match the MoodEntry type
const metrics = [
  { key: 'mood', label: 'Mood', color: '#e6194B' },
  { key: 'mind_clarity', label: 'Mind Clarity', color: '#f58231' },
  { key: 'motivation', label: 'Motivation', color: '#dcbeff' },
  { key: 'energy', label: 'Energy', color: '#808000' },
  { key: 'productivity', label: 'Productivity', color: '#3cb44b' },
  {
    key: 'emotional_stability',
    label: 'Emotional Stability',
    color: '#000075',
  },
  { key: 'focus', label: 'Focus', color: '#42d4f4' },
  { key: 'appetite', label: 'Appetite', color: '#4363d8' },
  { key: 'sex_drive', label: 'Sex Drive', color: '#911eb4' },
  { key: 'cravings', label: 'Cravings', color: '#000000' },
  { key: 'sleep_quality', label: 'Sleep Quality', color: '#a9a9a9' },
] as const

// Interface for potential alternative property names
interface AlternateFormatEntry {
  mindClarity?: number
  emotionalStability?: number
  sexDrive?: number
  focus?: number
}

const GraphsView = ({ entries, onBack }: GraphsViewProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['mood'])
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  })
  const [isClient, setIsClient] = useState(false)
  const [processedEntries, setProcessedEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    setIsClient(true)
    setDateRange({
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      end: new Date().toISOString().split('T')[0],
    })

    // Log entries to debug
    console.log('Initial entries in GraphsView:', entries)

    // Specifically check the problematic fields
    if (entries.length > 0) {
      console.log('First entry data check:')
      console.log('- mind_clarity:', entries[0].mind_clarity)
      console.log('- emotional_stability:', entries[0].emotional_stability)
      console.log('- sex_drive:', entries[0].sex_drive)
      console.log('- focus:', entries[0].focus)

      // Check all available properties on first entry
      console.log('All properties on first entry:', Object.keys(entries[0]))
    }
  }, [entries])

  useEffect(() => {
    // Filter and process entries based on date range
    if (!dateRange.start || !dateRange.end || !entries.length) {
      setProcessedEntries([])
      return
    }

    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    endDate.setHours(23, 59, 59, 999)

    const filtered = entries
      .filter((entry) => {
        const entryDate = new Date(entry.date)
        return entryDate >= startDate && entryDate <= endDate
      })
      .map((entry) => {
        // Create a copy of the entry for processing
        const processedEntry = { ...entry }

        // Ensure all required metrics are present
        metrics.forEach((metric) => {
          const metricKey = metric.key as keyof MoodEntry

          // Check for specific troublesome fields
          if (
            metricKey === 'mind_clarity' &&
            processedEntry.mind_clarity === undefined
          ) {
            // Try alternate property names using type assertion
            const alternateEntry =
              processedEntry as unknown as AlternateFormatEntry
            if (alternateEntry.mindClarity !== undefined) {
              processedEntry.mind_clarity = alternateEntry.mindClarity
              console.log(
                `Fixed mind_clarity using mindClarity: ${processedEntry.mind_clarity}`
              )
            } else {
              processedEntry.mind_clarity = 5 // Use 5 as default based on user's feedback
              console.log('Set default mind_clarity to 5')
            }
          }

          if (
            metricKey === 'emotional_stability' &&
            processedEntry.emotional_stability === undefined
          ) {
            // Try alternate property names using type assertion
            const alternateEntry =
              processedEntry as unknown as AlternateFormatEntry
            if (alternateEntry.emotionalStability !== undefined) {
              processedEntry.emotional_stability =
                alternateEntry.emotionalStability
              console.log(
                `Fixed emotional_stability using emotionalStability: ${processedEntry.emotional_stability}`
              )
            } else {
              processedEntry.emotional_stability = 5 // Use 5 as default based on user's feedback
              console.log('Set default emotional_stability to 5')
            }
          }

          if (
            metricKey === 'sex_drive' &&
            processedEntry.sex_drive === undefined
          ) {
            // Try alternate property names using type assertion
            const alternateEntry =
              processedEntry as unknown as AlternateFormatEntry
            if (alternateEntry.sexDrive !== undefined) {
              processedEntry.sex_drive = alternateEntry.sexDrive
              console.log(
                `Fixed sex_drive using sexDrive: ${processedEntry.sex_drive}`
              )
            } else {
              processedEntry.sex_drive = 5 // Use 5 as default based on user's feedback
              console.log('Set default sex_drive to 5')
            }
          }

          // Handle the new focus field
          if (metricKey === 'focus' && processedEntry.focus === undefined) {
            // Set default value for focus if not present
            processedEntry.focus = 5 // Use 5 as default based on user's feedback
            console.log('Set default focus to 5')
          }

          // General fallback for all metrics
          if (processedEntry[metricKey] === undefined) {
            // @ts-ignore - we're adding properties that might not be in the type but should be in the data
            processedEntry[metricKey] = 5 // Use 5 as default based on user's feedback
            console.log(`Set missing ${metricKey} to 5`)
          }
        })

        console.log('Processed entry:', {
          date: processedEntry.date,
          mood: processedEntry.mood,
          mind_clarity: processedEntry.mind_clarity,
          emotional_stability: processedEntry.emotional_stability,
          sex_drive: processedEntry.sex_drive,
          focus: processedEntry.focus,
        })

        return processedEntry
      })

    console.log(
      'Filtered entries sample:',
      filtered.length > 0 ? filtered[0] : 'No entries'
    )
    setProcessedEntries(filtered)
  }, [entries, dateRange.start, dateRange.end])

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return (
    <div className="w-full max-w-md bg-pink-dark rounded-3xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-white">Mood Trends</h2>
      </div>

      <div className="flex gap-4 text-sm">
        <label className="flex-1">
          <span className="block text-white/60 mb-2">From</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="w-full bg-pink-medium/30 text-white rounded-lg p-2 border border-pink-light"
          />
        </label>
        <label className="flex-1">
          <span className="block text-white/60 mb-2">To</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="w-full bg-pink-medium/30 text-white rounded-lg p-2 border border-pink-light"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {metrics.map(({ key, label, color }) => {
          const isSelected = selectedMetrics.includes(key)

          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`px-4 py-2 rounded-full ${
                isSelected ? 'bg-white/90 font-medium shadow-sm' : 'bg-white/70'
              }`}
              style={{ color: color }}
              aria-pressed={isSelected}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div>
        {processedEntries.length > 0 ? (
          <CombinedGraph
            entries={processedEntries}
            metrics={metrics.filter((m) => selectedMetrics.includes(m.key))}
          />
        ) : (
          <div className="h-64 w-full flex items-center justify-center text-white/70">
            No data available for the selected date range
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphsView
