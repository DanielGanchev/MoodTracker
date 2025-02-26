import { MoodEntry } from '@/types'

// Define an extended MoodEntry type that includes camelCase variants
interface ExtendedMoodEntry extends MoodEntry {
  hadDream?: boolean
  hasPeriod?: boolean
  hasOvulation?: boolean
}

/**
 * Determines the type of day based on mood entry properties
 */
export const getDayType = (
  day: Date,
  entries: ExtendedMoodEntry[]
): 'period' | 'ovulation' | 'normal' => {
  const dateString = day.toISOString().split('T')[0]
  const entry = entries.find((entry) => {
    const entryDate = new Date(entry.date).toISOString().split('T')[0]
    return entryDate === dateString
  })

  if (!entry) return 'normal'

  // Handle both snake_case and camelCase properties
  if (entry.has_period === true || entry.hasPeriod === true) {
    return 'period'
  }

  if (entry.has_ovulation === true || entry.hasOvulation === true) {
    return 'ovulation'
  }

  // Legacy support for entries that used notes to track period/ovulation
  if (entry.notes) {
    const lowercaseNotes = entry.notes.toLowerCase()
    if (lowercaseNotes.includes('period')) {
      return 'period'
    }
    if (lowercaseNotes.includes('ovulation')) {
      return 'ovulation'
    }
  }

  return 'normal'
}

// Check if a day has an entry
export const dayHasEntry = (date: Date, entries: MoodEntry[]): boolean => {
  const dateString = date.toISOString().split('T')[0]
  return entries.some((entry) => {
    const entryDate = new Date(entry.date).toISOString().split('T')[0]
    return entryDate === dateString
  })
}
