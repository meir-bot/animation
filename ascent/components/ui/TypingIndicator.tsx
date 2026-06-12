'use client'

import { motion } from 'framer-motion'

export function TypingIndicator({ label = 'thinking' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        borderBottomLeftRadius: 6,
        width: 'fit-content',
        maxWidth: 160,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="typing-dot"
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'rgba(124,92,252,0.9)',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)', fontStyle: 'italic' }}>
        {label}
      </span>
    </motion.div>
  )
}
