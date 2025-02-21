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
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

// Helper to convert snake_case to camelCase
/* eslint-disable @typescript-eslint/no-explicit-any */
const toCamelCase = <T extends Record<string, any>>(obj: T): any => {
  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    newObj[newKey] = obj[key]
  })
  return newObj
}

// Helper to convert camelCase to snake_case
const toSnakeCase = <T extends Record<string, any>>(obj: T): any => {
  const newObj: any = {}
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    newObj[newKey] = obj[key]
  })
  return newObj
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export { toCamelCase, toSnakeCase }

export type Profile = {
  id: string
  username: string
  created_at: string
}

export type MoodEntryWithProfile = MoodEntry & {
  profile_id: string
}
