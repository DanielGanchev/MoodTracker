'use client'

import { MoodEntry } from '@/types'

interface StatsViewProps {
  entries: MoodEntry[]
  onBack: () => void
}

const StatsView = ({ entries, onBack }: StatsViewProps) => {
  const calculateAverage = (key: keyof MoodEntry) => {
    if (entries.length === 0) return 0
    const sum = entries.reduce((acc, entry) => {
      const value = entry[key]
      return acc + (typeof value === 'number' ? value : 0)
    }, 0)
    return (sum / entries.length).toFixed(1)
  }

  const stats = [
    { label: 'Mood', value: calculateAverage('moodRating') },
    { label: 'Mind Clarity', value: calculateAverage('mindClarity') },
    { label: 'Motivation', value: calculateAverage('motivation') },
    { label: 'Energy', value: calculateAverage('energyLevel') },
    { label: 'Productivity', value: calculateAverage('productivity') },
    { label: 'Emotional Stability', value: calculateAverage('emotionalStability') },
  ]

  const periodDays = entries.filter(entry => entry.hasPeriod).length
  const ovulationDays = entries.filter(entry => entry.hasOvulation).length
  const dreamDays = entries.filter(entry => entry.hadDream).length

  return (
    <div className="w-full max-w-md bg-pink-dark rounded-3xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold text-white">Statistics</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-pink-medium/30 rounded-lg p-4 text-center"
          >
            <div className="text-white/60 text-sm">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Patterns</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <span>Period Days</span>
            <span>{periodDays}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Ovulation Days</span>
            <span>{ovulationDays}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Dream Days</span>
            <span>{dreamDays}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsView
