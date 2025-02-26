export type MoodRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent'

export interface MoodEntry {
  id: string // UUID
  profile_id: string // UUID
  date: string // ISO date string
  timestamp?: string // ISO date string
  mood: number
  mood_rating?: number
  mind_clarity: number
  motivation: number
  energy: number
  energy_level?: number
  productivity: number
  emotional_stability: number
  appetite: number
  sex_drive: number
  cravings: number
  sleep_quality: number
  focus?: number // New property for tracking focus level
  notes?: string
  had_dream?: boolean
  has_period?: boolean
  has_ovulation?: boolean
  created_at: string // ISO date string
  updated_at: string // ISO date string
}

export interface DatePickerProps {
  date: Date
  onDateChange: (date: Date) => void
  className?: string
  entries?: MoodEntry[]
}

export interface MoodCategory {
  id: string
  name: string
  color: string
  description?: string
}

export interface User {
  id: string
  email: string
  username?: string
  createdAt: string
}

export const getMoodLabel = (rating: MoodRating): string => {
  if (rating <= 2) return 'Sad'
  if (rating <= 4) return 'Unhappy'
  if (rating <= 6) return 'Normal'
  if (rating <= 8) return 'Good'
  return 'Happy'
}

export const getMoodEmoji = (rating: MoodRating): string => {
  if (rating <= 2) return '😢'
  if (rating <= 4) return '😔'
  if (rating <= 6) return '😐'
  if (rating <= 8) return '🙂'
  return '😄'
}
