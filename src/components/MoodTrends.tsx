import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import DatePicker from '../components/DatePicker'
import { format, subDays } from 'date-fns'
import { MoodEntry } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Disable all ChartJS plugins that might display text at the top
ChartJS.defaults.plugins.title.display = false
ChartJS.defaults.plugins.legend.display = false

interface MoodTrendsProps {
  moodEntries: MoodEntry[]
}

// Define color mapping for each category at component level
const categoryColors = {
  Mood: 'rgba(255, 99, 132, 1)',
  'Mind Clarity': 'rgba(54, 162, 235, 1)',
  Motivation: 'rgba(75, 192, 192, 1)',
  Energy: 'rgba(75, 233, 172, 1)',
  Productivity: 'rgba(255, 206, 86, 1)',
  'Emotional Stability': 'rgba(200, 99, 255, 1)',
  Appetite: 'rgba(255, 159, 64, 1)',
  'Sex Drive': 'rgba(255, 99, 255, 1)',
  Cravings: 'rgba(120, 230, 120, 1)',
  'Sleep Quality': 'rgba(130, 130, 255, 1)',
  Focus: 'rgba(0, 0, 0, 1)',
}

const MoodTrends: React.FC<MoodTrendsProps> = ({ moodEntries }) => {
  // Fix hydration issues by using useEffect to initialize dates on client only
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Mood',
  ])
  const [chartKey, setChartKey] = useState(0)

  // Initialize dates on client-side only to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    const today = new Date()
    const sevenDaysAgo = subDays(today, 7)

    setFromDate(sevenDaysAgo)
    setToDate(today)
  }, [])

  // Force chart to redraw when selected categories change
  useEffect(() => {
    setChartKey((prev) => prev + 1)
  }, [selectedCategories])

  // Define all available categories
  const allCategories = [
    'Mood',
    'Mind Clarity',
    'Motivation',
    'Energy',
    'Productivity',
    'Emotional Stability',
    'Appetite',
    'Sex Drive',
    'Cravings',
    'Sleep Quality',
    'Focus',
  ]

  // Get filtered entries based on date range - only filter if dates are initialized
  const filteredEntries = moodEntries.filter((entry) => {
    if (!fromDate || !toDate) return false
    const entryDate = new Date(entry.date)
    return entryDate >= fromDate && entryDate <= toDate
  })

  // Chart data generation function
  const generateChartData = () => {
    if (filteredEntries.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // Group entries by date
    const dateLabels = filteredEntries
      .map((entry) => format(new Date(entry.date), 'MMM dd'))
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    return {
      labels: dateLabels,
      datasets: selectedCategories.map((category) => {
        // Convert from camelCase to readable format
        let dataKey =
          category.replace(/\s+/g, '').charAt(0).toLowerCase() +
          category.replace(/\s+/g, '').slice(1)

        // Special case for specific fields that use snake_case
        if (category === 'Mind Clarity') dataKey = 'mind_clarity'
        if (category === 'Emotional Stability') dataKey = 'emotional_stability'
        if (category === 'Sex Drive') dataKey = 'sex_drive'
        if (category === 'Sleep Quality') dataKey = 'sleep_quality'

        const color = categoryColors[category as keyof typeof categoryColors]

        return {
          label: category,
          data: dateLabels.map((label) => {
            const entriesForDate = filteredEntries.filter(
              (entry) => format(new Date(entry.date), 'MMM dd') === label
            )
            if (entriesForDate.length > 0) {
              // @ts-expect-error - we know this property exists dynamically
              return entriesForDate[0][dataKey] || 0
            }
            return null
          }),
          borderColor: color,
          backgroundColor: color,
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          spanGaps: true,
        }
      }),
    }
  }

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      )
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Calculate dynamic graph height based on number of selected categories
  const getGraphHeight = () => {
    // Base height + additional height for each legend item beyond 4
    const baseHeight = 300
    const additionalHeight = Math.max(0, selectedCategories.length - 4) * 30
    return baseHeight + additionalHeight
  }

  // If not client-side yet, show a placeholder to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="p-4 bg-pink-400 rounded-3xl text-white h-screen">
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.history.back()}
            className="mr-auto"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-center flex-grow">
            Mood Trends
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-pink-400 rounded-3xl text-white">
      <div className="flex items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="mr-auto"
          aria-label="Go back"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-center flex-grow">
          Mood Trends
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">From</label>
          {fromDate && (
            <DatePicker
              date={fromDate}
              onDateChange={setFromDate}
              className="w-full bg-pink-300 bg-opacity-30 rounded-xl p-3 text-white"
            />
          )}
        </div>
        <div>
          <label className="block mb-2">To</label>
          {toDate && (
            <DatePicker
              date={toDate}
              onDateChange={setToDate}
              className="w-full bg-pink-300 bg-opacity-30 rounded-xl p-3 text-white"
            />
          )}
        </div>
      </div>

      {/* Category buttons with white backgrounds for better visibility */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((category) => {
          const isSelected = selectedCategories.includes(category)
          const categoryColor =
            categoryColors[category as keyof typeof categoryColors]

          return (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-4 py-2 rounded-full ${
                isSelected ? 'bg-white/90 font-medium shadow-sm' : 'bg-white/70'
              }`}
              style={{
                color: categoryColor,
              }}
              aria-pressed={isSelected}
            >
              {category}
            </button>
          )
        })}
      </div>

      {/* Chart container with dynamic height and improved layout */}
      <div
        className="relative"
        style={{
          height: `${getGraphHeight()}px`,
          marginBottom: '10px',
        }}
      >
        <Line
          key={chartKey}
          data={generateChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            elements: {
              line: {
                tension: 0.3,
                borderWidth: 3,
                fill: false,
              },
              point: {
                radius: 4,
                hoverRadius: 6,
                hitRadius: 10,
                borderWidth: 2,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                titleColor: '#333',
                bodyColor: '#333',
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1,
              },
              title: {
                display: false,
              },
              subtitle: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                border: {
                  display: false,
                },
                ticks: {
                  color: 'white',
                  font: {
                    size: 10,
                  },
                },
              },
              y: {
                position: 'left',
                beginAtZero: true,
                max: 10,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                border: {
                  display: false,
                },
                ticks: {
                  color: 'white',
                  padding: 0,
                  font: {
                    size: 10,
                  },
                },
                afterFit: (scaleInstance) => {
                  scaleInstance.width = 15
                },
              },
            },
            layout: {
              padding: {
                left: 0,
                right: 10,
                top: 30,
                bottom: 10,
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default MoodTrends
