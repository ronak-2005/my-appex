'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useRedirectIfAuthenticated from '@/hooks/useRedirectIfAuthenticated'

export default function RegisterPage() {
  useRedirectIfAuthenticated()

  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTimeout(() => router.push('/login'), 1500)
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      setError('Server error. Try again later.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl w-[90%] max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-400">Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black border border-purple-500 rounded-md text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-black border border-purple-500 rounded-md text-white"
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-purple-600 hover:bg-purple-700 transition rounded-md font-semibold"
        >
          Register
        </button>

        {success && (
          <p className="text-green-400 mt-4 text-center">
            ✅ Registered successfully! Redirecting...
          </p>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  )
}
