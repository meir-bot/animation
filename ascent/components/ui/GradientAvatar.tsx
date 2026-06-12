'use client'

import { useMemo } from 'react'

interface GradientAvatarProps {
  name: string
  size?: number
  radius?: number
  style?: React.CSSProperties
}

const GRADIENT_PAIRS = [
  ['#7c5cfc', '#00d4ff'],
  ['#ff6b9d', '#ff8c69'],
  ['#00d4ff', '#00f5c8'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#00d4ff'],
  ['#8b5cf6', '#ec4899'],
  ['#3b82f6', '#7c5cfc'],
  ['#f97316', '#eab308'],
]

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function GradientAvatar({ name, size = 40, radius = 14, style }: GradientAvatarProps) {
  const [from, to] = useMemo(() => GRADIENT_PAIRS[hashStr(name) % GRADIENT_PAIRS.length], [name])
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.02em',
        flexShrink: 0,
        ...style,
      }}
    >
      {initials || '?'}
    </div>
  )
}
