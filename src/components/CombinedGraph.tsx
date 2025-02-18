'use client'

import { useMemo, useState } from 'react'
import { MoodEntry, getMoodEmoji } from '@/types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface CombinedGraphProps {
  entries: MoodEntry[]
}

const metrics = {
  moodRating: { label: 'Mood', color: '#FFB3C6' }, // cherry-blossom-pink
  sleepQuality: { label: 'Sleep', color: '#9333EA' }, // purple
  motivation: { label: 'Motivation', color: '#38BDF8' }, // sky blue
  energyLevel: { label: 'Energy Level', color: '#34D399' }, // emerald
  productivity: { label: 'Productivity', color: '#F59E0B' }, // amber
  emotionalStability: { label: 'Emotional Stability', color: '#6366F1' }, // indigo
  appetite: { label: 'Appetite', color: '#EC4899' }, // pink
  sexDrive: { label: 'Sex Drive', color: '#8B5CF6' }, // violet
  cravings: { label: 'Cravings', color: '#F43F5E' }, // rose
} as const

type MetricKey = keyof typeof metrics

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-pink-light bg-pink-dark p-2 shadow-lg">
        {payload.map((item: any) => {
          const metricKey = item.dataKey as MetricKey
          return (
            <div key={metricKey} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: metrics[metricKey].color }}
              />
              <span className="text-sm text-white">
                {metrics[metricKey].label}: {item.value}
              </span>
            </div>
          )
        })}
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

const CombinedGraph = ({ entries }: CombinedGraphProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>([
    'moodRating',
  ])

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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          defaultValue="moodRating"
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedMetrics(Object.keys(metrics) as MetricKey[])
            } else if (value === 'none') {
              setSelectedMetrics([])
            } else {
              if (!selectedMetrics.includes(value as MetricKey)) {
                setSelectedMetrics((prev) => [...prev, value as MetricKey])
              }
            }
          }}
        >
          <SelectTrigger className="w-[200px] bg-pink-medium/30 border-pink-light text-white">
            <SelectValue placeholder="Select metrics" />
          </SelectTrigger>
          <SelectContent className="bg-pink-dark border-pink-light">
            <SelectItem
              value="all"
              className="text-white hover:bg-pink-medium/30"
            >
              Show All
            </SelectItem>
            <SelectItem
              value="none"
              className="text-white hover:bg-pink-medium/30"
            >
              Hide All
            </SelectItem>
            {Object.entries(metrics).map(([key, { label }]) => (
              <SelectItem
                key={key}
                value={key}
                className="text-white hover:bg-pink-medium/30"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          {selectedMetrics.map((metricKey) => (
            <div
              key={metricKey}
              className="flex items-center gap-2 bg-pink-medium/30 px-3 py-1.5 rounded-lg"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: metrics[metricKey].color }}
              />
              <span className="text-sm text-white">
                {metrics[metricKey].label}
              </span>
              <button
                onClick={() =>
                  setSelectedMetrics((prev) =>
                    prev.filter((m) => m !== metricKey)
                  )
                }
                className="text-white/60 hover:text-white ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graphData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#FFE5EC10" />
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
            <Legend />
            {selectedMetrics.map((metricKey) => (
              <Line
                key={metricKey}
                type="monotone"
                dataKey={metricKey}
                name={metrics[metricKey].label}
                stroke={metrics[metricKey].color}
                strokeWidth={2}
                dot={{
                  stroke: metrics[metricKey].color,
                  fill: '#1e1b4b',
                  strokeWidth: 2,
                  r: 4,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CombinedGraph
