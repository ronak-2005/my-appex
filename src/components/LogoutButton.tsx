'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // important for sending cookies
      })

      // Redirect to login after successful logout
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
    >
      Logout
    </button>
  )
}
