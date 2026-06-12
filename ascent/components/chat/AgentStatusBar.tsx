'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function AgentStatusBar({ status }: { status: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      style={{
        margin: '0 16px 4px',
        padding: '8px 12px',
        background: 'rgba(124,92,252,0.08)',
        border: '1px solid rgba(124,92,252,0.15)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <Loader2
        size={13}
        color="#7c5cfc"
        style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}
      />
      <span style={{ fontSize: 13, color: 'rgba(124,92,252,0.9)', fontStyle: 'italic' }}>{status}</span>
    </motion.div>
  )
}
