'use client'

import { useMemo } from 'react'
import { MoodEntry, getMoodEmoji, MoodRating } from '@/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface MoodGraphProps {
  entries: MoodEntry[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: MoodEntry
  }>
  label?: string | null
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload
    return (
      <div className="rounded-lg border border-purple-700 bg-purple-950 p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {getMoodEmoji(entry.mood as MoodRating)}
          </span>
          <span className="text-sm text-white">{entry.mood}</span>
        </div>
        <div className="mt-1 text-xs text-white/60">
          {label &&
            typeof label === 'string' &&
            new Date(label).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
        </div>
      </div>
    )
  }
  return null
}

const MoodGraph = ({ entries }: MoodGraphProps) => {
  const graphData = useMemo(() => {
    return entries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((entry) => ({
        ...entry,
        date: entry.date,
      }))
  }, [entries])

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={graphData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })
            }
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            domain={[1, 10]}
            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{
              stroke: '#a855f7',
              fill: '#1e1b4b',
              strokeWidth: 2,
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MoodGraph
