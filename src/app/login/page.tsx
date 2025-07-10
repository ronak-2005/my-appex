// src/app/login/page.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api/auth"
import useRedirectIfAuthenticated from "@/hooks/useRedirectIfAuthenticated"

export default function LoginPage() {
  useRedirectIfAuthenticated()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await loginUser(username, password)
    if (res.success) {
      router.push("/start")
    } else {
      setError(res.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/10 backdrop-blur p-8 rounded-xl shadow-lg w-80">
        <h1 className="text-xl font-bold text-purple-400">Login</h1>
        {error && <p className="text-red-400">{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-white/20 text-white"
        />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded">
          Log In
        </button>
        <p className="text-center mt-4">
  Don't have an account?{' '}
  <a href="/register" className="text-purple-400 underline">
    Register here
  </a>
</p>

      </form>
    </div>
  )
}
