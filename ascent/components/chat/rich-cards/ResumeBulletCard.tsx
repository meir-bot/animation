'use client'

import { motion } from 'framer-motion'
import type { ResumeBullet } from '@/lib/types'
import { ArrowRight, TrendingUp } from 'lucide-react'

export function ResumeBulletCard({ data }: { data: ResumeBullet }) {
  const impactColor = data.impact === 'high' ? '#10b981' : data.impact === 'medium' ? '#f59e0b' : '#6b7280'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30, delay: 0.1 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <TrendingUp size={14} color={impactColor} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: impactColor }}>
          {data.impact} impact
        </span>
      </div>

      {data.original && (
        <div style={{
          fontSize: 13,
          color: 'rgba(244,244,246,0.4)',
          padding: '8px 10px',
          background: 'rgba(239,68,68,0.06)',
          borderRadius: 8,
          borderLeft: '2px solid rgba(239,68,68,0.4)',
          lineHeight: 1.5,
          textDecoration: 'line-through',
        }}>
          {data.original}
        </div>
      )}

      <div style={{
        fontSize: 14,
        color: '#f4f4f6',
        padding: '8px 10px',
        background: 'rgba(16,185,129,0.06)',
        borderRadius: 8,
        borderLeft: '2px solid rgba(16,185,129,0.5)',
        lineHeight: 1.5,
      }}>
        {data.improved}
      </div>

      <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)', lineHeight: 1.5 }}>
        💡 {data.reason}
      </p>
    </motion.div>
  )
}
