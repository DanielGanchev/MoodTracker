import React, { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { DatePickerProps, MoodEntry } from '@/types'
import { getDayType } from '@/utils/calendarUtils'

interface ExtendedMoodEntry extends MoodEntry {
  hadDream?: boolean
  hasPeriod?: boolean
  hasOvulation?: boolean
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  className,
  entries = [],
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Ensure component is mounted before formatting dates
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Format date on client side only to avoid hydration mismatches
  const formattedDate = isMounted ? format(date, 'MM/dd/yyyy') : ''

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate.getTime())) {
      onDateChange(newDate)
      setIsOpen(false)
    }
  }

  const togglePicker = () => {
    setIsOpen(!isOpen)
  }

  const renderDayContents = (day: number, date: Date) => {
    const dayEntry = entries.find(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    )

    const dayType = getDayType(date, entries as ExtendedMoodEntry[])

    const dayStyles = {
      normal: 'text-gray-900',
      period: 'text-red-600 bg-red-100',
      ovulation: 'text-pink-600 bg-pink-100',
    }

    return (
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full ${dayStyles[dayType]}`}
      >
        {day}
      </div>
    )
  }

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className={`flex items-center justify-between cursor-pointer ${className}`}
        onClick={togglePicker}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            togglePicker()
          }
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Select date, current date is ${formattedDate}`}
      >
        <span>{formattedDate}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg p-2">
          <input
            type="date"
            value={isMounted ? format(date, 'yyyy-MM-dd') : ''}
            onChange={handleDateChange}
            className="w-full p-2 text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Select date"
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

export default DatePicker
