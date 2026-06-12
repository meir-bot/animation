'use client'

import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#07070f',
      }}>
        <LoadingDots />
      </div>
    )
  }

  return <>{children}</>
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(124,92,252,0.8)',
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  )
}
