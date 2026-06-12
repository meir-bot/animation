'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { Thread } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Trash2 } from 'lucide-react'

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

const DELETE_THRESHOLD = -80

export function ThreadCard({ thread, index, onClick }: ThreadCardProps) {
  const deleteThread = useStore((s) => s.deleteThread)
  const x = useMotionValue(0)
  const [swiped, setSwiped] = useState(false)

  const deleteOpacity = useTransform(x, [-120, -60, 0], [1, 0.6, 0])
  const deleteScale = useTransform(x, [-120, -60], [1, 0.8])
  const cardOpacity = useTransform(x, [-120, 0], [0.7, 1])

  const lastMsg = thread.messages[thread.messages.length - 1]
  const preview = lastMsg
    ? lastMsg.content.slice(0, 80) + (lastMsg.content.length > 80 ? '…' : '')
    : 'Start a conversation'

  const stage = thread.context.stage || 'general'
  const stageLabel = STAGE_LABELS[stage]
  const accentColor = thread.accentColor || '#7c5cfc'

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < DELETE_THRESHOLD) {
      // Delete
      animate(x, -window.innerWidth, { duration: 0.2 })
      setTimeout(() => deleteThread(thread.id), 220)
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 })
    }
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
      {/* Delete background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(239,68,68,0.15)',
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 20,
          opacity: deleteOpacity,
        }}
      >
        <motion.div style={{ scale: deleteScale }}>
          <Trash2 size={20} color="#ef4444" />
        </motion.div>
      </motion.div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, opacity: cardOpacity, touchAction: 'pan-y' }}
        initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{
          delay: index * 0.06,
          duration: 0.35,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        onTap={onClick}
        onPointerDown={(e) => {
          // Prevent propagation so the card click still works if not swiped
        }}
        onTapCancel={() => {}}
      >
        <div
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
            userSelect: 'none',
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
            width: 48, height: 48,
            borderRadius: 16,
            background: thread.companyImageUrl
              ? undefined
              : `linear-gradient(135deg, ${accentColor}55, ${accentColor}22)`,
            border: `1px solid ${accentColor}33`,
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
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '2px 7px', borderRadius: 6,
                  background: `${accentColor}22`, color: accentColor, flexShrink: 0,
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

          {/* Unread indicator */}
          {thread.messages.length > 0 && (
            <div style={{
              width: 8, height: 8,
              borderRadius: '50%',
              background: accentColor,
              flexShrink: 0,
              boxShadow: `0 0 8px ${accentColor}88`,
            }} />
          )}
        </div>
      </motion.div>
    </div>
  )
}
