'use client'

import { useState } from 'react'
import { debugAuth, checkProfileExists } from '@/utils/debugUtils'

export default function AuthDebugger() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckProfile = async () => {
    if (!username) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const exists = await checkProfileExists(username)
      setResults({ profileExists: exists })
    } catch (err: any) {
      setError(err.message || 'Error checking profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDebugAuth = async () => {
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await debugAuth(username, password)
      setResults(result)
    } catch (err: any) {
      setError(err.message || 'Error during auth debug')
    } finally {
      setLoading(false)
    }
  }

  const createDummyProfile = async () => {
    // This is just a placeholder - actual implementation would need to access Supabase directly
    setError(
      'This feature requires server access and is not implemented in this component'
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Auth Debugger</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter username"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter password"
        />
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleCheckProfile}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
        >
          Check Profile Exists
        </button>

        <button
          onClick={handleDebugAuth}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-green-300"
        >
          Debug Auth
        </button>

        <button
          onClick={createDummyProfile}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded-md disabled:bg-purple-300"
        >
          Create Test Profile
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Loading...
        </div>
      )}

      {results && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
