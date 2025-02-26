import { useState, useEffect } from 'react'
import { getDayType } from '@/utils/calendarUtils'
import { MoodEntry } from '@/types'

interface ExtendedMoodEntry extends MoodEntry {
  hadDream?: boolean
  hasPeriod?: boolean
  hasOvulation?: boolean
}

const Calendar = ({ entries }: { entries: MoodEntry[] }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const renderDay = (date: Date, entries: MoodEntry[]) => {
    if (!isMounted)
      return <div className="p-2 rounded bg-white">{date.getDate()}</div>

    const dayEntry = entries.find(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    )

    const dayType = getDayType(date, entries as ExtendedMoodEntry[])

    const dayStyles = {
      normal: 'bg-white',
      period: 'bg-red-200', // Light red for period days
      ovulation: 'bg-pink-200', // Light pink for ovulation days
    }

    return (
      <div className={`p-2 rounded ${dayStyles[dayType]}`}>
        {date.getDate()}
      </div>
    )
  }

  // ... rest of the component
}
