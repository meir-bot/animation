'use client'

import { motion } from 'framer-motion'
import type { Thread } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/utils'

interface ThreadCardProps {
  thread: Thread
  index: number
  onClick: () => void
}

const STAGE_LABELS: Record<string, string> = {
  exploring:    'Exploring',
  applied:      'Applied',
  interviewing: 'Interviewing',
  offered:      'Offer',
  general:      '',
}

export function ThreadCard({ thread, index, onClick }: ThreadCardProps) {
  const lastMsg = thread.messages[thread.messages.length - 1]
  const preview = lastMsg
    ? lastMsg.content.slice(0, 80) + (lastMsg.content.length > 80 ? '…' : '')
    : 'Start a conversation'

  const stage = thread.context.stage || 'general'
  const stageLabel = STAGE_LABELS[stage]
  const accentColor = thread.accentColor || '#7c5cfc'

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{
        delay: index * 0.06,
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent line */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 3,
        height: '60%',
        borderRadius: '0 3px 3px 0',
        background: accentColor,
        opacity: 0.7,
      }} />

      {/* Icon / Emoji */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 16,
        background: `${accentColor}22`,
        border: `1px solid ${accentColor}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {thread.companyImageUrl ? (
          <img
            src={thread.companyImageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          thread.emoji || '💼'
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#f4f4f6',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {thread.title}
          </p>
          <span style={{ fontSize: 11, color: 'rgba(244,244,246,0.3)', flexShrink: 0, marginLeft: 8 }}>
            {formatDistanceToNow(new Date(thread.updatedAt))}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {stageLabel && (
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 7px',
              borderRadius: 6,
              background: `${accentColor}22`,
              color: accentColor,
              flexShrink: 0,
            }}>
              {stageLabel}
            </span>
          )}
          <p style={{
            fontSize: 13,
            color: 'rgba(244,244,246,0.4)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {preview}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
