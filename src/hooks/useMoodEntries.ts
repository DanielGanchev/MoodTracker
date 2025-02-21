'use client'

import { useState, useEffect, useCallback } from 'react'
import { MoodEntry } from '@/types'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { toCamelCase, toSnakeCase } from '@/lib/supabase'

export default function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const { profile } = useAuth()

  const fetchEntries = useCallback(async () => {
    if (!profile) return
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('profile_id', profile.id)
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      return
    }

    setEntries(data?.map(toCamelCase) || [])
  }, [profile])

  useEffect(() => {
    if (profile) {
      fetchEntries()
    }
  }, [profile, fetchEntries])

  const addEntry = async (entry: Omit<MoodEntry, 'id'>) => {
    if (!profile) return

    const newEntry = {
      ...entry,
      profile_id: profile.id,
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .insert([toSnakeCase(newEntry)])
      .select()
      .single()

    if (error) {
      console.error('Error adding entry:', error)
      return
    }

    setEntries((prev) => [toCamelCase(data), ...prev])
  }

  const updateEntry = async (updatedEntry: MoodEntry) => {
    if (!profile) return

    const { error } = await supabase
      .from('mood_entries')
      .update(toSnakeCase(updatedEntry))
      .eq('id', updatedEntry.id)
      .eq('profile_id', profile.id)

    if (error) {
      console.error('Error updating entry:', error)
      return
    }

    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    )
  }

  const deleteEntry = async (id: string) => {
    if (!profile) return

    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id)
      .eq('profile_id', profile.id)

    if (error) {
      console.error('Error deleting entry:', error)
      return
    }

    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
  }
}
