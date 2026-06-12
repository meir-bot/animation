'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, CSSProperties } from 'react'

interface SpringButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  style?: CSSProperties
  fullWidth?: boolean
}

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #7c5cfc 0%, #00d4ff 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 24px rgba(124,92,252,0.4)',
  },
  ghost: {
    background: 'transparent',
    color: 'rgba(244,244,246,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  glass: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: '#f4f4f6',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  danger: {
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
  },
}

const sizes = {
  sm:   { padding: '6px 14px', fontSize: 13, borderRadius: 10, height: 32 },
  md:   { padding: '10px 20px', fontSize: 15, borderRadius: 14, height: 44 },
  lg:   { padding: '14px 28px', fontSize: 16, borderRadius: 16, height: 52 },
  icon: { padding: '10px', fontSize: 15, borderRadius: 12, width: 44, height: 44 },
}

export function SpringButton({
  children,
  variant = 'glass',
  size = 'md',
  style,
  fullWidth,
  disabled,
  ...props
}: SpringButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 500,
        letterSpacing: '-0.01em',
        transition: 'opacity 0.15s',
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? '100%' : undefined,
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
