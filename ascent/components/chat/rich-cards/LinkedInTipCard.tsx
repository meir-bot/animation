'use client'

import { motion } from 'framer-motion'
import type { LinkedInTip } from '@/lib/types'
import { Link2 } from 'lucide-react'

export function LinkedInTipCard({ data }: { data: LinkedInTip }) {
  const priorityColor = data.priority === 'high' ? '#3b82f6' : data.priority === 'medium' ? '#8b5cf6' : '#6b7280'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30, delay: 0.1 }}
      style={{
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: 16,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link2 size={14} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)', fontWeight: 500 }}>LinkedIn</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f6' }}>{data.section}</p>
        </div>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 6,
          background: `${priorityColor}22`,
          color: priorityColor,
          border: `1px solid ${priorityColor}44`,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {data.priority}
        </span>
      </div>

      <p style={{ fontSize: 14, color: '#f4f4f6', lineHeight: 1.6, marginBottom: data.example ? 10 : 0 }}>
        {data.tip}
      </p>

      {data.example && (
        <div style={{
          padding: '8px 10px',
          background: 'rgba(59,130,246,0.08)',
          borderRadius: 8,
          borderLeft: '2px solid rgba(59,130,246,0.4)',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(244,244,246,0.4)', marginBottom: 3, fontWeight: 500 }}>EXAMPLE</p>
          <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.7)', fontStyle: 'italic', lineHeight: 1.5 }}>{data.example}</p>
        </div>
      )}
    </motion.div>
  )
}
