'use client'

import { useMemo } from 'react'
import { MoodEntry } from '@/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface SleepGraphProps {
  entries: MoodEntry[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload
    return (
      <div className="rounded-lg border border-purple-700 bg-purple-950 p-2 shadow-lg">
        <div className="text-sm text-white">
          Sleep Quality: {entry.sleepQuality}
        </div>
        <div className="mt-1 text-xs text-white/60">
          {new Date(label).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    )
  }
  return null
}

const SleepGraph = ({ entries }: SleepGraphProps) => {
  const graphData = useMemo(() => {
    return entries
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .map((entry) => ({
        ...entry,
        date: entry.timestamp,
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
            tickFormatter={(value) => value.toString()}
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="sleepQuality"
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

export default SleepGraph
