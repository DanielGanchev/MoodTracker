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
  TooltipProps,
} from 'recharts'

interface ScaleGraphProps {
  entries: MoodEntry[]
  dataKey: keyof MoodEntry
  label: string
  color?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomTooltipProps = TooltipProps<any, any> & {
  dataKey?: keyof MoodEntry
  graphLabel?: string
}

const CustomTooltip = ({
  active,
  payload,
  label,
  graphLabel,
}: CustomTooltipProps) => {
  if (active && payload?.[0]) {
    const value = Number(payload[0].value)
    return (
      <div className="rounded-lg border border-purple-700 bg-purple-950 p-2 shadow-lg">
        <div className="text-sm text-white">
          {graphLabel}: {value}
        </div>
        <div className="mt-1 text-xs text-white/60">
          {label &&
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

const ScaleGraph = ({
  entries,
  dataKey,
  label,
  color = '#a855f7',
}: ScaleGraphProps) => {
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
      <h3 className="text-white text-sm mb-4">{label} History</h3>
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
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={payload}
                label={label}
                dataKey={dataKey}
                graphLabel={label}
              />
            )}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{
              stroke: color,
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

export default ScaleGraph
