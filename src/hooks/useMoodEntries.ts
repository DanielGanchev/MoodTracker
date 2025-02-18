'use client'

import { useState, useEffect } from 'react'
import { MoodEntry } from '@/types'

const STORAGE_KEY = 'mood-tracker-entries'

export default function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: crypto.randomUUID(),
    }
    setEntries((prev) => [...prev, newEntry])
  }

  const updateEntry = (updatedEntry: MoodEntry) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    )
  }

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
  }
}
