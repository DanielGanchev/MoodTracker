'use client'

import { useMemo } from 'react'
import { MoodEntry } from '@/types'

interface StatsViewProps {
  entries: MoodEntry[]
  onBack: () => void
}

const StatsView = ({ entries, onBack }: StatsViewProps) => {
  const stats = useMemo(() => {
    const total = entries.length
    if (total === 0)
      return {
        moodCounts: { sad: 0, unhappy: 0, normal: 0, good: 0, happy: 0 },
        percentages: [0, 0, 0, 0, 0],
        sleepQualityCount: { poor: 0, fair: 0, good: 0, excellent: 0 },
        dreamCount: 0,
        total: 0,
      }

    const moodCounts = entries.reduce(
      (acc, entry) => {
        if (entry.moodRating <= 2) acc.sad++
        else if (entry.moodRating <= 4) acc.unhappy++
        else if (entry.moodRating <= 6) acc.normal++
        else if (entry.moodRating <= 8) acc.good++
        else acc.happy++
        return acc
      },
      { sad: 0, unhappy: 0, normal: 0, good: 0, happy: 0 }
    )

    const percentages = [
      Math.round((moodCounts.sad / total) * 100),
      Math.round((moodCounts.unhappy / total) * 100),
      Math.round((moodCounts.normal / total) * 100),
      Math.round((moodCounts.good / total) * 100),
      Math.round((moodCounts.happy / total) * 100),
    ]

    const sleepQualityCount = entries.reduce(
      (acc, entry) => {
        const quality =
          entry.sleepQuality <= 3
            ? 'poor'
            : entry.sleepQuality <= 5
            ? 'fair'
            : entry.sleepQuality <= 8
            ? 'good'
            : 'excellent'
        acc[quality]++
        return acc
      },
      { poor: 0, fair: 0, good: 0, excellent: 0 }
    )

    const dreamCount = entries.filter((entry) => entry.hadDream).length

    return {
      moodCounts,
      percentages,
      sleepQualityCount,
      dreamCount,
      total,
    }
  }, [entries])

  const moodLabels = [
    'Sad (1-2)',
    'Unhappy (3-4)',
    'Normal (5-6)',
    'Good (7-8)',
    'Happy (9-10)',
  ]
  const moodEmojis = ['😢', '😔', '😐', '😊', '😄']

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
        <h2 className="text-xl font-semibold text-white/90">
          Your Mood Patterns
        </h2>
      </div>

      <div className="space-y-4">
        {moodLabels.map((label, index) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between text-white text-sm">
              <span className="flex items-center gap-2">
                <span className="text-lg">{moodEmojis[index]}</span>
                {label}
              </span>
              <span>{stats.percentages[index]}%</span>
            </div>
            <div className="h-2 bg-pink-medium/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-light transition-all duration-500"
                style={{ width: `${stats.percentages[index]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-pink-medium/30 rounded-xl p-4">
          <h3 className="text-white/90 text-sm font-medium mb-2">
            Sleep Quality
          </h3>
          <div className="space-y-1 text-white text-sm">
            {Object.entries(stats.sleepQualityCount).map(([quality, count]) => (
              <div key={quality} className="flex justify-between">
                <span className="capitalize">{quality}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-medium/30 rounded-xl p-4">
          <h3 className="text-white/90 text-sm font-medium mb-2">Dreams</h3>
          <div className="text-white/90 text-sm font-medium">
            <div className="text-2xl font-bold">{stats.dreamCount}</div>
            <div className="text-sm text-white/60">
              out of {stats.total} days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsView
