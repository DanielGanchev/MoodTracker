'use client'

import { useState } from 'react'
import { MoodEntry } from '@/types'
import CombinedGraph from './CombinedGraph'

interface GraphsViewProps {
  entries: MoodEntry[]
  onBack: () => void
}

const metrics = [
  { key: 'moodRating', label: 'Mood', color: '#f472b6' },
  { key: 'mindClarity', label: 'Mind Clarity', color: '#a78bfa' },
  { key: 'motivation', label: 'Motivation', color: '#60a5fa' },
  { key: 'energyLevel', label: 'Energy', color: '#34d399' },
  { key: 'productivity', label: 'Productivity', color: '#fbbf24' },
  { key: 'emotionalStability', label: 'Emotional Stability', color: '#f87171' },
  { key: 'appetite', label: 'Appetite', color: '#fb923c' },
  { key: 'sexDrive', label: 'Sex Drive', color: '#e879f9' },
  { key: 'cravings', label: 'Cravings', color: '#22c55e' },
  { key: 'sleepQuality', label: 'Sleep Quality', color: '#818cf8' },
] as const

const GraphsView = ({ entries, onBack }: GraphsViewProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['moodRating'])
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp)
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    endDate.setHours(23, 59, 59, 999)
    return entryDate >= startDate && entryDate <= endDate
  })

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
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
        {metrics.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleMetric(key)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedMetrics.includes(key)
                ? 'bg-pink-light text-white'
                : 'bg-pink-medium/30 text-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <CombinedGraph
          entries={filteredEntries}
          metrics={metrics.filter(m => selectedMetrics.includes(m.key))}
        />
      </div>
    </div>
  )
}

export default GraphsView
