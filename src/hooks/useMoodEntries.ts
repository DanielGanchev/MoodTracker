'use client'

import { useState, useEffect, useCallback } from 'react'
import { MoodEntry } from '@/types'
import { supabase, toCamelCase, toSnakeCase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { PostgrestError } from '@supabase/supabase-js'

export default function useMoodEntries() {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const { profile } = useAuth()

  // Process fetched entries to ensure boolean fields are properly typed
  const processFetchedEntries = (data: Record<string, unknown>[]) => {
    return data.map((entry) => {
      // First apply toCamelCase to handle key naming
      const camelCaseEntry = toCamelCase(entry)

      // Explicitly ensure boolean fields are correctly typed
      // Using triple equals to true/false ensures consistent typing
      const processedEntry = {
        ...camelCaseEntry,
        had_dream: camelCaseEntry.had_dream === true,
        has_period: camelCaseEntry.has_period === true,
        has_ovulation: camelCaseEntry.has_ovulation === true,
      } as MoodEntry

      return processedEntry
    })
  }

  const fetchEntries = useCallback(async () => {
    if (!profile) return

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('profile_id', profile.id)
      .order('date', { ascending: false })

    if (error) {
      const errorMessage = (error as PostgrestError).message
      console.error('Error fetching entries:', errorMessage)
      return
    }

    const processedEntries = processFetchedEntries(data || [])
    setEntries(processedEntries)
  }, [profile])

  useEffect(() => {
    if (profile) {
      fetchEntries()
    }
  }, [profile, fetchEntries])

  const addEntry = async (
    entry: Omit<MoodEntry, 'id' | 'created_at' | 'updated_at'>
  ) => {
    if (!profile || !profile.id) {
      console.error('Cannot add entry: No valid profile ID')
      return
    }

    const newEntry = {
      ...entry,
      profile_id: profile.id,
      date: entry.date || new Date().toISOString(),
      had_dream: entry.had_dream === true,
      has_period: entry.has_period === true,
      has_ovulation: entry.has_ovulation === true,
    }

    const snakeCaseEntry = toSnakeCase(newEntry)

    const { data, error } = await supabase
      .from('mood_entries')
      .insert([snakeCaseEntry])
      .select()
      .single()

    if (error) {
      const errorMessage = (error as PostgrestError).message
      console.error('Error adding entry:', errorMessage)
      return
    }

    // Refresh all entries to ensure we have the latest data
    await fetchEntries()

    return data ? toCamelCase(data) : null
  }

  const updateEntry = async (updatedEntry: MoodEntry) => {
    if (!profile || !profile.id) {
      console.error('Cannot update entry: No valid profile ID')
      return
    }

    if (!updatedEntry.id) {
      console.error('Cannot update entry: No valid entry ID')
      return
    }

    const entryToUpdate = {
      ...updatedEntry,
      profile_id: profile.id,
      updated_at: new Date().toISOString(),
      had_dream: updatedEntry.had_dream === true,
      has_period: updatedEntry.has_period === true,
      has_ovulation: updatedEntry.has_ovulation === true,
    }

    const { error } = await supabase
      .from('mood_entries')
      .update(toSnakeCase(entryToUpdate))
      .eq('id', updatedEntry.id)
      .eq('profile_id', profile.id)

    if (error) {
      const errorMessage = (error as PostgrestError).message
      console.error('Error updating entry:', errorMessage)
      return
    }

    // Refresh all entries to ensure we have the latest data
    await fetchEntries()

    return entryToUpdate
  }

  const deleteEntry = async (id: string) => {
    if (!profile || !profile.id) {
      console.error('Cannot delete entry: No valid profile ID')
      return
    }

    if (!id) {
      console.error('Cannot delete entry: No valid entry ID')
      return
    }

    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id)
      .eq('profile_id', profile.id)

    if (error) {
      const errorMessage = (error as PostgrestError).message
      console.error('Error deleting entry:', errorMessage)
      return
    }

    // Refresh all entries to ensure we have the latest data
    await fetchEntries()
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: fetchEntries,
  }
}
