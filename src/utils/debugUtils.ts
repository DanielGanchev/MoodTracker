import { supabase } from './supabaseClient'

// Utility to check if a profile exists in the database
export const checkProfileExists = async (
  username: string
): Promise<boolean> => {
  try {
    console.log(`Checking if profile exists for username: ${username}`)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('Error checking profile:', error)
      return false
    }

    console.log(
      'Profile check result:',
      data ? 'Profile exists' : 'Profile not found'
    )
    return !!data
  } catch (err) {
    console.error('Exception checking profile:', err)
    return false
  }
}

// Utility to debug authentication issues
export const debugAuth = async (username: string, password: string) => {
  try {
    console.log(`Debug auth for username: ${username}`)

    // Step 1: Check if profile exists
    const profileExists = await checkProfileExists(username)
    console.log(`Profile exists check: ${profileExists}`)

    // Step 2: Attempt signin with detailed logging
    const { data: signinData, error: signinError } =
      await supabase.auth.signInWithPassword({
        email: `${username}@gmail.com`,
        password,
      })

    if (signinError) {
      console.error('Signin error details:', {
        message: signinError.message,
        status: signinError.status,
        name: signinError.name,
      })
      return { success: false, error: signinError }
    }

    console.log('Signin successful, user:', signinData?.user?.id)

    // Step 3: Fetch profile after authentication
    if (signinData?.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signinData.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error after auth:', profileError)
        return { success: false, error: profileError }
      }

      console.log('Profile data:', profileData)
      return { success: true, profile: profileData }
    }

    return { success: false, error: 'No user data after signin' }
  } catch (err) {
    console.error('Exception in debug auth:', err)
    return { success: false, error: err }
  }
}

// Utility to check the schema of the profiles table
export const checkProfileSchema = async () => {
  try {
    console.log('Fetching profile table schema...')

    // A simple way to get column information is to select one row with all columns
    const { data, error } = await supabase.from('profiles').select('*').limit(1)

    if (error) {
      console.error('Error fetching profile schema:', error)
      return { success: false, error }
    }

    // If we have data, we can see the column structure
    if (data && data.length > 0) {
      const columnNames = Object.keys(data[0])
      console.log('Profile table columns:', columnNames)
      return {
        success: true,
        columns: columnNames,
        sampleData: data[0],
      }
    }

    // If there's no data, try to get the schema another way
    const { data: emptyData } = await supabase
      .from('profiles')
      .select('id, username, created_at')
      .limit(0)

    console.log('Profile table structure (from empty query):', emptyData)
    return {
      success: true,
      note: 'No data available, showing structure from empty query',
      data: emptyData,
    }
  } catch (err) {
    console.error('Exception checking profile schema:', err)
    return { success: false, error: err }
  }
}
