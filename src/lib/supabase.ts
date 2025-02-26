import { createClient } from '@supabase/supabase-js'
import { MoodEntry } from '@/types'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
    },
  }
)

/**
 * Helper function to convert a string from snake_case to camelCase
 */
export function camelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Helper function to convert a string from camelCase to snake_case
 */
export function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Define a generic type for objects with string keys
 */
export type GenericObject = Record<string, unknown>

/**
 * Convert snake_case keys to camelCase
 */
export function toCamelCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(toCamelCase)
  }

  // Create a new object with camelCase keys
  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    const camelKey = camelCase(key)

    // Handle specific boolean fields consistently
    if (['had_dream', 'has_period', 'has_ovulation'].includes(key)) {
      newObj[camelKey] = value === true
    } else if (typeof value === 'object' && value !== null) {
      newObj[camelKey] = toCamelCase(value)
    } else {
      newObj[camelKey] = value
    }
  })

  return newObj
}

/**
 * Convert camelCase keys to snake_case
 */
export function toSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase)
  }

  // Create a new object with snake_case keys
  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    const snakeKey = snakeCase(key)

    // Handle specific boolean fields consistently
    if (['hadDream', 'hasPeriod', 'hasOvulation'].includes(key)) {
      newObj[snakeKey] = value === true
    } else if (typeof value === 'object' && value !== null) {
      newObj[snakeKey] = toSnakeCase(value)
    } else {
      newObj[snakeKey] = value
    }
  })

  return newObj
}

export interface Profile {
  id: string
  created_at: string
  updated_at: string
  username: string
}

export type MoodEntryWithProfile = MoodEntry & {
  profile_id: string
}
