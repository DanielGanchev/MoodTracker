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
  Legend,
} from 'recharts'
import { TooltipProps } from 'recharts'

interface CombinedGraphProps {
  entries: MoodEntry[]
  metrics: Array<{
    key: keyof MoodEntry
    label: string
    color: string
  }>
}

const CombinedGraph = ({ entries, metrics }: CombinedGraphProps) => {
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
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
          />
          <Tooltip
            content={({
              active,
              payload,
              label,
            }: TooltipProps<number, string>) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-pink-dark border border-pink-light rounded-lg p-3 shadow-lg">
                    <div className="text-white/60 text-xs mb-1">
                      {new Date(label).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    {payload.map((item) => (
                      <div
                        key={item.name}
                        className="text-sm text-white flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.stroke }}
                        />
                        <span>
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span className="text-white/60">{value}</span>
            )}
          />
          {metrics.map(({ key, label, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              name={label}
              strokeWidth={2}
              dot={{
                stroke: color,
                fill: '#1e1b4b',
                strokeWidth: 2,
                r: 4,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CombinedGraph
