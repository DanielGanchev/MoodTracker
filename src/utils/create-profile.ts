import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * Creates a profile for a user in the profiles table
 * Use this after signing up a new user or to fix a missing profile
 */
export const createProfile = async (userId: string, username: string) => {
  try {
    // First check if a profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (checkError) {
      const errorMessage = (checkError as PostgrestError).message
      console.error('Error checking for existing profile:', errorMessage)
      return {
        success: false,
        message: `Error checking for existing profile: ${errorMessage}`,
      }
    }

    // If profile already exists, don't create a new one
    if (existingProfile) {
      return {
        success: true,
        message: 'Profile already exists',
        profile: existingProfile,
      }
    }

    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      const errorMessage = (error as PostgrestError).message
      console.error('Error creating profile:', errorMessage)
      return {
        success: false,
        message: `Error creating profile: ${errorMessage}`,
      }
    }

    console.log('Successfully created profile:', data)
    return {
      success: true,
      message: 'Profile created successfully',
      profile: data,
    }
  } catch (error) {
    console.error('Unexpected error creating profile:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
