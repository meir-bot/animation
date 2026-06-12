'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CareerEntry } from '@/lib/types'
import { GradientAvatar } from '@/components/ui/GradientAvatar'

interface MagazineCardProps {
  entry: CareerEntry
  index: number
  featured?: boolean
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function yearsBetween(start: string, end?: string) {
  const s = new Date(start)
  const e = end ? new Date(end) : new Date()
  return +((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1)
}

export function MagazineCard({ entry, index, featured = false }: MagazineCardProps) {
  const [expanded, setExpanded] = useState(false)
  const accent = entry.accentColor || '#7c5cfc'
  const isCurrent = !entry.endDate
  const years = yearsBetween(entry.startDate, entry.endDate)

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 280, damping: 28 }}
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer', marginBottom: 20 }}
      >
        {/* Hero image area */}
        <div style={{ height: 200, borderRadius: 24, overflow: 'hidden', position: 'relative', marginBottom: 0 }}>
          {entry.companyImageUrl ? (
            <img
              src={entry.companyImageUrl}
              alt={entry.company}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65) saturate(1.3)' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, ${accent}44 0%, ${accent}11 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64,
            }}>
              🏢
            </div>
          )}
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, transparent 30%, rgba(7,7,15,1) 100%)`,
          }} />
          {/* Current badge */}
          {isCurrent && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              padding: '4px 12px',
              background: 'rgba(16,185,129,0.2)',
              border: '1px solid rgba(16,185,129,0.5)',
              borderRadius: 20, backdropFilter: 'blur(10px)',
              fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              ● Now
            </div>
          )}
          {/* Issue-style label */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            padding: '3px 10px',
            background: `${accent}33`,
            border: `1px solid ${accent}55`,
            borderRadius: 8, backdropFilter: 'blur(10px)',
            fontSize: 10, fontWeight: 800, color: accent, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            {years}y
          </div>
        </div>

        {/* Card body — overlapping the image */}
        <div style={{
          background: 'rgba(10,10,20,0.96)',
          borderRadius: '0 0 24px 24px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: 'none',
          padding: '20px 20px 16px',
          marginTop: -2,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#f4f4f6', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 4 }}>
                {entry.role}
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: accent }}>{entry.company}</p>
            </div>
            <GradientAvatar name={entry.company} size={44} radius={14} />
          </div>

          <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)', marginBottom: 12, letterSpacing: '0.02em' }}>
            {formatDate(entry.startDate)} — {isCurrent ? 'Present' : formatDate(entry.endDate!)}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {entry.skills.slice(0, 5).map((s) => (
              <span key={s} style={{
                fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                background: `${accent}15`, color: accent, border: `1px solid ${accent}30`,
              }}>
                {s}
              </span>
            ))}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.65)', lineHeight: 1.7, marginBottom: 12 }}>
                    {entry.description}
                  </p>
                  {entry.achievements.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 2 }}>→</span>
                      <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.7)', lineHeight: 1.5 }}>{a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // Compact card
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: '14px 16px',
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent left bar */}
      <div style={{
        position: 'absolute', left: 0, top: '15%', bottom: '15%',
        width: 3, borderRadius: '0 3px 3px 0',
        background: `linear-gradient(to bottom, ${accent}, transparent)`,
      }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <GradientAvatar name={entry.company} size={40} radius={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f4f4f6', letterSpacing: '-0.01em', marginBottom: 1 }}>{entry.role}</p>
          <p style={{ fontSize: 13, color: accent, fontWeight: 600, marginBottom: 1 }}>{entry.company}</p>
          <p style={{ fontSize: 11, color: 'rgba(244,244,246,0.35)' }}>
            {formatDate(entry.startDate)} — {isCurrent ? 'Present' : formatDate(entry.endDate!)} · {years}y
          </p>
        </div>
        {isCurrent && (
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px rgba(16,185,129,0.6)',
            flexShrink: 0,
          }} />
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 12, marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.6)', lineHeight: 1.6, marginBottom: 10 }}>
                {entry.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {entry.skills.map((s) => (
                  <span key={s} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 20,
                    background: `${accent}12`, color: accent, border: `1px solid ${accent}25`,
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
