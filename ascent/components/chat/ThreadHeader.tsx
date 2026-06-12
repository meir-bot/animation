'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, MoreHorizontal, Zap } from 'lucide-react'
import type { Thread } from '@/lib/types'

interface ThreadHeaderProps {
  thread: Thread
  onBack: () => void
}

const STAGE_CONFIG = {
  exploring:    { label: 'Exploring',    color: '#7c5cfc' },
  applied:      { label: 'Applied',      color: '#3b82f6' },
  interviewing: { label: 'Interviewing', color: '#f59e0b' },
  offered:      { label: 'Offer',        color: '#10b981' },
  general:      { label: '',             color: '#6b7280' },
}

export function ThreadHeader({ thread, onBack }: ThreadHeaderProps) {
  const stage = thread.context.stage || 'general'
  const stageConfig = STAGE_CONFIG[stage as keyof typeof STAGE_CONFIG] || STAGE_CONFIG.general
  const accentColor = thread.accentColor || '#7c5cfc'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '52px 16px 12px',
        background: 'rgba(7,7,15,0.7)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Accent gradient top bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
        opacity: 0.6,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            width: 36, height: 36,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ChevronLeft size={18} color="rgba(244,244,246,0.7)" />
        </motion.button>

        {/* Thread icon */}
        <div style={{
          width: 40, height: 40,
          borderRadius: 13,
          background: `${accentColor}22`,
          border: `1px solid ${accentColor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {thread.companyImageUrl ? (
            <img src={thread.companyImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            thread.emoji || '💼'
          )}
        </div>

        {/* Title + stage */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#f4f4f6',
            letterSpacing: '-0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: 1,
          }}>
            {thread.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#10b981',
              animation: 'glowPulse 2s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(16,185,129,0.6)',
            }} />
            <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)' }}>AI Agent active</span>
            {stageConfig.label && (
              <>
                <span style={{ color: 'rgba(244,244,246,0.2)', fontSize: 12 }}>·</span>
                <span style={{ fontSize: 12, color: stageConfig.color, fontWeight: 500 }}>{stageConfig.label}</span>
              </>
            )}
          </div>
        </div>

        {/* Tools badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px',
          background: 'rgba(124,92,252,0.1)',
          border: '1px solid rgba(124,92,252,0.2)',
          borderRadius: 8,
          flexShrink: 0,
        }}>
          <Zap size={11} color="#7c5cfc" fill="#7c5cfc" />
          <span style={{ fontSize: 10, fontWeight: 600, color: '#7c5cfc', letterSpacing: '0.06em' }}>TOOLS</span>
        </div>
      </div>
    </motion.div>
  )
}
