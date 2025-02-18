'use client'

import { useState } from 'react'
import { MoodEntry, getMoodEmoji } from '@/types'

interface CalendarViewProps {
  entries: MoodEntry[]
  onDayClick: (entry: MoodEntry | null, date: Date) => void
  onBack: () => void
}

const CalendarView = ({ entries, onDayClick, onBack }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    )
  }

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    )
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  const getEntryForDate = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
    return entries.find(
      (entry) =>
        new Date(entry.timestamp).toDateString() === date.toDateString()
    )
  }

  return (
    <div className="w-full max-w-md bg-pink-dark rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Go back"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-white">
            {monthName} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-white/60 text-sm py-2">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const entry = getEntryForDate(day)
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          )

          return (
            <button
              key={day}
              onClick={() => onDayClick(entry || null, date)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-colors relative
                ${entry ? 'bg-pink/50 hover:bg-pink/70' : 'hover:bg-pink/20'}
                ${entry?.hasPeriod ? 'ring-2 ring-red-500' : ''}
              `}
            >
              <span className="text-white/60 text-sm">{day}</span>
              {entry && (
                <span className="text-lg mt-1">
                  {getMoodEmoji(entry.moodRating)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarView
