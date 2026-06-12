'use client'

import { motion } from 'framer-motion'
import type { UserProfile } from '@/lib/types'

export function CareerStats({ profile }: { profile: UserProfile }) {
  const totalYears = profile.careerEntries.reduce((acc, entry) => {
    const start = new Date(entry.startDate)
    const end = entry.endDate ? new Date(entry.endDate) : new Date()
    return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
  }, 0)

  const topSkills = profile.skills
    .sort((a, b) => b.level - a.level || b.yearsExp - a.yearsExp)
    .slice(0, 6)

  const skillsByCategory = {
    technical: profile.skills.filter((s) => s.category === 'technical').length,
    soft:      profile.skills.filter((s) => s.category === 'soft').length,
    domain:    profile.skills.filter((s) => s.category === 'domain').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <StatCard value={`${Math.round(totalYears)}`} label="Years Experience" accent="#7c5cfc" />
        <StatCard value={`${profile.careerEntries.length}`} label="Companies" accent="#00d4ff" />
        <StatCard value={`${profile.skills.length}`} label="Total Skills" accent="#ff6b9d" />
        <StatCard value={`${topSkills[0]?.yearsExp || 0}`} label="Max Years/Skill" accent="#f59e0b" />
      </div>

      {/* Skill distribution */}
      <div style={{
        padding: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(244,244,246,0.5)', marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Skill Mix
        </p>
        <SkillBar label="Technical" value={skillsByCategory.technical} total={profile.skills.length} color="#7c5cfc" />
        <SkillBar label="Domain" value={skillsByCategory.domain} total={profile.skills.length} color="#ff6b9d" />
        <SkillBar label="Soft" value={skillsByCategory.soft} total={profile.skills.length} color="#00d4ff" />
      </div>

      {/* Top skills */}
      <div style={{
        padding: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(244,244,246,0.5)', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Top Skills
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topSkills.map((skill, i) => (
            <div key={skill.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#f4f4f6' }}>{skill.name}</span>
                <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)' }}>{skill.yearsExp}y</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(skill.level / 5) * 100}%` }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    height: '100%',
                    borderRadius: 2,
                    background: `linear-gradient(90deg, #7c5cfc, #00d4ff)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      style={{
        padding: '16px',
        background: `${accent}0c`,
        border: `1px solid ${accent}20`,
        borderRadius: 16,
        textAlign: 'center',
      }}
    >
      <p style={{ fontSize: 28, fontWeight: 800, color: accent, letterSpacing: '-0.04em', lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)', marginTop: 4, fontWeight: 500 }}>{label}</p>
    </motion.div>
  )
}

function SkillBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: 'rgba(244,244,246,0.6)' }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
    </div>
  )
}
