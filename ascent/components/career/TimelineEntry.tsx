'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CareerEntry } from '@/lib/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TimelineEntryProps {
  entry: CareerEntry
  index: number
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function TimelineEntry({ entry, index }: TimelineEntryProps) {
  const [expanded, setExpanded] = useState(false)
  const accent = entry.accentColor || '#7c5cfc'
  const isCurrent = !entry.endDate

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
      style={{ position: 'relative', marginBottom: 16 }}
    >
      {/* Timeline dot */}
      <div style={{
        position: 'absolute',
        left: -32 + 5,
        top: 20,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: accent,
        border: '2px solid #07070f',
        boxShadow: `0 0 12px ${accent}88`,
        zIndex: 1,
      }}>
        {isCurrent && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: `${accent}22`,
            animation: 'glowPulse 2s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Card */}
      <motion.div
        layout
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${expanded ? accent + '33' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 18,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Hero image or gradient */}
        <div style={{
          height: 72,
          background: entry.companyImageUrl
            ? undefined
            : `linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)`,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
        }}>
          {entry.companyImageUrl ? (
            <img
              src={entry.companyImageUrl}
              alt={entry.company}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, opacity: 0.3,
            }}>
              🏢
            </div>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(7,7,15,0.85) 100%)',
          }} />
          {isCurrent && (
            <div style={{
              position: 'absolute', top: 8, right: 8,
              padding: '3px 8px',
              background: 'rgba(16,185,129,0.2)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 20,
              fontSize: 10, fontWeight: 700, color: '#10b981',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Current
            </div>
          )}
        </div>

        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f6', letterSpacing: '-0.02em', marginBottom: 2 }}>
                {entry.role}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: accent, marginBottom: 4 }}>
                {entry.company}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)' }}>
                {formatDate(entry.startDate)} — {entry.endDate ? formatDate(entry.endDate) : 'Present'}
              </p>
            </div>
            <div style={{ color: 'rgba(244,244,246,0.3)', flexShrink: 0, marginLeft: 8, marginTop: 2 }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {/* Skills pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
            {entry.skills.slice(0, expanded ? undefined : 4).map((skill) => (
              <span key={skill} style={{
                fontSize: 11, fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 20,
                background: `${accent}15`,
                color: accent,
                border: `1px solid ${accent}30`,
              }}>
                {skill}
              </span>
            ))}
            {!expanded && entry.skills.length > 4 && (
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 20,
                color: 'rgba(244,244,246,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                +{entry.skills.length - 4}
              </span>
            )}
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 12, marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.6)', lineHeight: 1.6, marginBottom: 12 }}>
                    {entry.description}
                  </p>
                  {entry.achievements.length > 0 && (
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', marginBottom: 8 }}>
                        Key Achievements
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {entry.achievements.map((ach, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0, marginTop: 6 }} />
                            <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.7)', lineHeight: 1.5 }}>{ach}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
