'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      
      if (data.token) {
        Cookies.set('token', data.token, { expires: 1 }) // Store JWT
        router.push('/start') // Redirect to protected route
      } else {
        setError(data.error || 'Invalid login')
      }
      if (data.success) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  }

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Please enter both email and password');
      return;
    }
    handleLogin(username, password);
  }

  return (
    
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-4xl font-bold text-purple-500 mb-6">🔐 Login</h1>

      <div className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="bg-gray-900 text-white p-3 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-gray-900 text-white p-3 rounded border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold transition-colors"
        >
          Login
        </button>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  )
}