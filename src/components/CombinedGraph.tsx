'use client'

import { useMemo, useEffect } from 'react'
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
  // Log props for debugging
  useEffect(() => {
    console.log('CombinedGraph metrics:', metrics)

    // Log specific field values for debugging
    if (entries.length > 0) {
      metrics.forEach(({ key, label }) => {
        console.log(
          `Values for ${label} (${key}):`,
          entries.map((entry) => ({
            date: entry.date,
            value: (entry as any)[key],
          }))
        )
      })
    }
  }, [entries, metrics])

  const graphData = useMemo(() => {
    // Ensure we have data
    if (!entries.length) {
      console.log('No entries to display')
      return []
    }

    // Create properly formatted data for the graph
    const processedData = entries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((entry) => {
        // Directly map the fields we need to ensure they're present
        const result = {
          date: entry.date,
        }

        // Add all requested metrics explicitly
        metrics.forEach(({ key }) => {
          // @ts-ignore - we know what we're doing with dynamic properties
          result[key] = typeof entry[key] === 'number' ? entry[key] : 5
        })

        // Log the processed data point
        console.log('Processed data point:', result)
        return result
      })

    console.log('Final graph data:', processedData)
    return processedData
  }, [entries, metrics])

  // If no data, show a message
  if (graphData.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-white/70">
        No data available for the selected date range
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={graphData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
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
            domain={[0, 10]}
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
            width={20}
            tickSize={2}
            tickMargin={2}
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
          {metrics.map(({ key, label, color }, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              name={label}
              strokeWidth={3}
              dot={{
                stroke: color,
                fill: '#1e1b4b',
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{ r: 6 }}
              connectNulls={true}
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={index * 100}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CombinedGraph
