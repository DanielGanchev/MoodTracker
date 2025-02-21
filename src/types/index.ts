export type MoodRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent'

export interface MoodEntry {
  id: string
  timestamp: string
  moodRating: MoodRating
  sleepQuality: number
  hadDream: boolean
  hasPeriod: boolean
  hasOvulation: boolean
  description: string
  motivation: number
  energyLevel: number
  productivity: number
  emotionalStability: number
  appetite: number
  sexDrive: number
  cravings: number
  mindClarity: number
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
  if (rating <= 8) return '😊'
  return '😄'
}
