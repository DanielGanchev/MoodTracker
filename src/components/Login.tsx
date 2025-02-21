'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    try {
      await signIn(username, password)
    } catch (err) {
      setErrorMessage('Invalid username or password')
    }
  }

  return (
    <div className="w-full max-w-md bg-pink-dark rounded-3xl p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white text-center">Login</h1>
      {errorMessage && (
        <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white text-sm mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-pink-medium/30 text-white rounded-lg p-3 border border-pink-light"
          />
        </div>
        <div>
          <label className="block text-white text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-pink-medium/30 text-white rounded-lg p-3 border border-pink-light"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-pink-medium text-white font-semibold
            hover:bg-pink-light transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
