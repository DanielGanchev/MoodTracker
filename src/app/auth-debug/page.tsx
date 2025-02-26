'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { checkProfileSchema } from '@/utils/debugUtils'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AuthDebugPage() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [schemaInfo, setSchemaInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true)

        // Get current session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`)
        }

        setSession(sessionData.session)

        // If no session, stop here
        if (!sessionData.session) {
          setLoading(false)
          return
        }

        // Get user from session
        const { data: userData, error: userError } =
          await supabase.auth.getUser()

        if (userError) {
          throw new Error(`User error: ${userError.message}`)
        }

        // If we have a user, get their profile
        if (userData.user) {
          // Get profile by user ID
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            throw new Error(`Profile error: ${profileError.message}`)
          }

          setProfile(profileData || null)
        }
      } catch (err: any) {
        console.error('Auth debug error:', err)
        setError(err.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setProfile(null)
      router.push('/')
    } catch (err: any) {
      console.error('Sign out error:', err)
      setError(err.message || 'Failed to sign out')
    }
  }

  const handleCheckSchema = async () => {
    try {
      setLoading(true)
      const result = await checkProfileSchema()
      setSchemaInfo(result)
      setError(null)
    } catch (err: any) {
      console.error('Schema check error:', err)
      setError(err.message || 'Failed to check schema')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Auth Debugging</h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Authentication Status
              </h2>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="font-medium">
                  Status:{' '}
                  <span className={session ? 'text-green-600' : 'text-red-600'}>
                    {session ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </p>

                {session && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      Session expires:{' '}
                      {new Date(session.expires_at * 1000).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {session && (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    User Information
                  </h2>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p>
                      <span className="font-medium">ID:</span> {session.user.id}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {session.user.email}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(session.user.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Profile Information
                  </h2>
                  {profile ? (
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <p>
                        <span className="font-medium">Username:</span>{' '}
                        {profile.username}
                      </p>
                      <p>
                        <span className="font-medium">Profile ID:</span>{' '}
                        {profile.id}
                      </p>
                      <p>
                        <span className="font-medium">Created:</span>{' '}
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleString()
                          : 'N/A'}
                      </p>
                      <p>
                        <span className="font-medium">Updated:</span>{' '}
                        {profile.updated_at
                          ? new Date(profile.updated_at).toLocaleString()
                          : 'N/A'}
                      </p>

                      <div className="mt-3">
                        <p className="font-medium">Profile/Auth Match:</p>
                        <p
                          className={
                            profile.id === session.user.id
                              ? 'text-green-600'
                              : 'text-red-600 font-bold'
                          }
                        >
                          {profile.id === session.user.id
                            ? '✓ Profile ID matches Auth User ID (correct)'
                            : '⚠ Profile ID does not match Auth User ID (issue)'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                      <p className="font-medium">
                        ⚠ No profile found for this user
                      </p>
                      <p className="text-sm mt-1">
                        This may indicate a problem with account setup.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => router.push('/auth-fix')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Fix Tool
              </button>

              {session ? (
                <button
                  onClick={handleSignOut}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => router.push('/sign-in')}
                  className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Database Schema</h2>
              <button
                onClick={handleCheckSchema}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Check Profiles Table Schema
              </button>

              {schemaInfo && (
                <div className="p-3 bg-gray-100 rounded-lg mt-2">
                  {schemaInfo.success ? (
                    <div>
                      <p className="font-medium text-green-600 mb-2">
                        Schema found!
                      </p>
                      {schemaInfo.columns && (
                        <div>
                          <p className="font-medium">Available columns:</p>
                          <ul className="list-disc pl-5 mb-2">
                            {schemaInfo.columns.map((col: string) => (
                              <li key={col}>{col}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <details>
                        <summary className="cursor-pointer text-blue-600">
                          View full details
                        </summary>
                        <pre className="mt-2 bg-gray-200 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(schemaInfo, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-red-600">
                        Failed to fetch schema
                      </p>
                      <pre className="mt-2 bg-gray-200 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(schemaInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
