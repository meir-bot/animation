'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'
import { SkillsCloud } from './SkillsCloud'
import { CareerStats } from './CareerStats'
import { MagazineCard } from './MagazineCard'
import { BarChart3, Cloud, TrendingUp } from 'lucide-react'

type ViewMode = 'timeline' | 'skills' | 'stats'

export function CareerView() {
  const profile = useStore((s) => s.profile)
  const [mode, setMode] = useState<ViewMode>('timeline')

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'timeline', label: 'Timeline', icon: <BarChart3 size={14} /> },
    { id: 'skills',   label: 'Skills',   icon: <Cloud size={14} /> },
    { id: 'stats',    label: 'Insights', icon: <TrendingUp size={14} /> },
  ]

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '52px 20px 12px', flexShrink: 0 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 4 }}>
          Career Map
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.4)', marginBottom: 16 }}>
          {profile.careerEntries.length} roles · {profile.skills.length} skills
        </p>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: 6,
          padding: 4,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
        }}>
          {tabs.map(({ id, label, icon }) => (
            <motion.button
              key={id}
              onClick={() => setMode(id)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px 0',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: mode === id ? 600 : 400,
                background: mode === id ? 'rgba(124,92,252,0.2)' : 'transparent',
                color: mode === id ? '#7c5cfc' : 'rgba(244,244,246,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: 100,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <AnimatePresence mode="wait">
          {mode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '8px 20px' }}
            >
              {/* Career summary card */}
              <CareerSummaryCard profile={profile} />

              {/* Magazine timeline */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', marginBottom: 16 }}>
                  Career History
                </p>
                {profile.careerEntries.map((entry, i) => (
                  <MagazineCard
                    key={entry.id}
                    entry={entry}
                    index={i}
                    featured={i === 0}
                  />
                ))}
              </div>

              {/* Education */}
              {profile.education.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', marginBottom: 12 }}>
                    Education
                  </p>
                  {profile.education.map((edu, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{
                        padding: '14px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16,
                        marginBottom: 8,
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 24 }}>🎓</div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#f4f4f6', marginBottom: 2 }}>
                          {edu.degree} in {edu.field}
                        </p>
                        <p style={{ fontSize: 13, color: 'rgba(244,244,246,0.5)' }}>
                          {edu.institution} · {edu.graduationYear}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {mode === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '8px 20px' }}
            >
              <SkillsCloud skills={profile.skills} />
            </motion.div>
          )}

          {mode === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '8px 20px' }}
            >
              <CareerStats profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active="career" />
    </div>
  )
}

function CareerSummaryCard({ profile }: { profile: import('@/lib/types').UserProfile }) {
  const totalYears = profile.careerEntries.reduce((acc, entry) => {
    const start = new Date(entry.startDate)
    const end = entry.endDate ? new Date(entry.endDate) : new Date()
    return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(124,92,252,0.12) 0%, rgba(0,212,255,0.08) 100%)',
        border: '1px solid rgba(124,92,252,0.2)',
        borderRadius: 20,
        marginBottom: 24,
        display: 'flex',
        gap: 20,
        alignItems: 'center',
      }}
    >
      <div style={{
        width: 60, height: 60,
        borderRadius: 20,
        background: profile.avatarUrl ? undefined : 'linear-gradient(135deg, #7c5cfc, #00d4ff)',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          profile.name.charAt(0).toUpperCase()
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: '#f4f4f6', marginBottom: 2 }}>
          {profile.name}
        </p>
        <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.6)', marginBottom: 8 }}>
          {profile.title}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <Stat value={Math.round(totalYears)} label="yrs exp" />
          <Stat value={profile.careerEntries.length} label="roles" />
          <Stat value={profile.skills.length} label="skills" />
        </div>
      </div>
    </motion.div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p style={{ fontSize: 20, fontWeight: 800, color: '#7c5cfc', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: 'rgba(244,244,246,0.4)', fontWeight: 500 }}>{label}</p>
    </div>
  )
}
