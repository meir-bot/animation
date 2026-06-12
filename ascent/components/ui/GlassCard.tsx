'use client'

import { motion } from 'framer-motion'
import { CSSProperties, ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  hoverable?: boolean
  high?: boolean
  padding?: number | string
  radius?: number | string
}

export function GlassCard({
  children,
  className = '',
  style,
  onClick,
  hoverable = false,
  high = false,
  padding = 16,
  radius = 20,
}: GlassCardProps) {
  const base: CSSProperties = {
    background: high ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    border: `1px solid ${high ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: radius,
    padding,
    ...style,
  }

  if (onClick || hoverable) {
    return (
      <motion.div
        className={`pressable ${className}`}
        style={{ cursor: onClick ? 'pointer' : 'default', ...base }}
        onClick={onClick}
        whileHover={hoverable ? { scale: 1.01, background: 'rgba(255,255,255,0.07)' } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={className} style={base}>
      {children}
    </div>
  )
}
