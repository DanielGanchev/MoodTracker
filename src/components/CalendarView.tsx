'use client'

import { useState } from 'react'
import { MoodEntry, getMoodEmoji, MoodRating } from '@/types'
import { getDayType } from '@/utils/calendarUtils'

interface CalendarViewProps {
  entries: MoodEntry[]
  onDayClick: (entry: MoodEntry | null, date: Date) => void
  onBack: () => void
}

interface ExtendedMoodEntry extends MoodEntry {
  hadDream?: boolean
  hasPeriod?: boolean
  hasOvulation?: boolean
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
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    )
  }

  const getDayStyles = (entry: MoodEntry | undefined, date: Date) => {
    if (!entry) return 'hover:bg-pink/20'

    const dayType = getDayType(date, entries as ExtendedMoodEntry[])

    switch (dayType) {
      case 'period':
        return 'bg-red-400/30 hover:bg-red-400/50 border border-red-500'
      case 'ovulation':
        return 'bg-pink-400/30 hover:bg-pink-400/50 border border-pink-500'
      default:
        return 'bg-pink/50 hover:bg-pink/70'
    }
  }

  const renderDayIndicators = (
    date: Date,
    entry: ExtendedMoodEntry | undefined
  ) => {
    if (!entry) return null

    return (
      <>
        {/* Dream indicator - top right */}
        {(entry.had_dream === true || entry.hadDream === true) && (
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-300"></div>
        )}

        {/* Period indicator - bottom left */}
        {(entry.has_period === true || entry.hasPeriod === true) && (
          <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-red-500"></div>
        )}

        {/* Ovulation indicator - bottom right */}
        {(entry.has_ovulation === true || entry.hasOvulation === true) && (
          <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-pink-500"></div>
        )}
      </>
    )
  }

  return (
    <div className="w-full max-w-[98%] mx-auto bg-pink-dark rounded-3xl px-2 py-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Go back"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-white">
            {monthName} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 place-items-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-white/70 text-xs w-11">
            {day.substring(0, 3)}
          </div>
        ))}

        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-start-${index}`} className="w-11 h-11"></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const entry = getEntryForDate(day)
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day
          )
          const dayStyles = getDayStyles(entry, date)
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div key={`day-${day}`} className="relative w-11 h-11">
              <button
                onClick={() => onDayClick(entry || null, date)}
                className={`
                  absolute inset-0
                  rounded-md overflow-hidden
                  ${dayStyles}
                  ${isToday ? 'ring-1 ring-white' : ''}
                `}
                aria-label={`${date.toDateString()} ${
                  entry ? 'has entry' : 'no entry'
                }`}
              >
                {/* Day number */}
                <div className="absolute top-1 left-1 text-white/90 text-xs">
                  {day}
                </div>

                {/* Emoji centered */}
                {entry && (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg mt-1">
                      {getMoodEmoji(entry.mood as MoodRating)}
                    </span>
                  </div>
                )}

                {/* Indicators */}
                {renderDayIndicators(date, entry as ExtendedMoodEntry)}
              </button>
            </div>
          )
        })}

        {/* Empty cells to complete the grid if needed */}
        {(() => {
          const totalCells = firstDayOfMonth + daysInMonth
          const lastRowCells = totalCells % 7
          if (lastRowCells === 0) return null

          return Array.from({ length: 7 - lastRowCells }).map((_, index) => (
            <div key={`empty-end-${index}`} className="w-11 h-11"></div>
          ))
        })()}
      </div>

      {/* Add legend for indicators */}
      <div className="flex flex-wrap gap-6 justify-center mt-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-white/80">Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
          <span className="text-white/80">Ovulation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-300"></div>
          <span className="text-white/80">Dream</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
