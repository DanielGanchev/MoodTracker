'use client'

import { useState } from 'react'
import { MoodEntry } from '@/types'
import CombinedGraph from './CombinedGraph'

interface GraphsViewProps {
  entries: MoodEntry[]
  onBack: () => void
}

const GraphsView = ({ entries, onBack }: GraphsViewProps) => {
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
    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999)

    return entryDate >= startDate && entryDate <= endDate
  })

  return (
    <div className="w-full max-w-md bg-pink-dark rounded-3xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Go back"
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

      <div className="space-y-8">
        <div>
          <h3 className="text-white text-sm mb-4">Mood & Metrics History</h3>
          <CombinedGraph entries={filteredEntries} />
        </div>
      </div>
    </div>
  )
}

export default GraphsView
