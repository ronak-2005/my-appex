// src/app/layout.tsx
import '@/app/globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'AI Career Guide',
  description: 'Get career recommendations based on your skills and interests.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
