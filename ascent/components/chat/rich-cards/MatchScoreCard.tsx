'use client'

import { motion } from 'framer-motion'
import type { MatchScore } from '@/lib/types'
import { CheckCircle, AlertCircle } from 'lucide-react'

export function MatchScoreCard({ data }: { data: MatchScore }) {
  const color = data.score >= 80 ? '#10b981' : data.score >= 60 ? '#f59e0b' : '#ef4444'
  const label = data.score >= 80 ? 'Strong Match' : data.score >= 60 ? 'Good Match' : 'Reach Role'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30, delay: 0.1 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: 16,
      }}
    >
      {/* Score ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
        <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
          <svg viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <motion.circle
              cx="30" cy="30" r="24"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - data.score / 100) }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color }}>{data.score}</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color, letterSpacing: '-0.02em', marginBottom: 2 }}>{label}</p>
          <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.5)', lineHeight: 1.4 }}>{data.recommendation}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {data.strengths.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#10b981', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Strengths</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {data.strengths.slice(0, 3).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <CheckCircle size={11} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.7)', lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.gaps.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Gaps</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {data.gaps.slice(0, 3).map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <AlertCircle size={11} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.7)', lineHeight: 1.4 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
