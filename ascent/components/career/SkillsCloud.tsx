'use client'

import { motion } from 'framer-motion'
import type { Skill } from '@/lib/types'

const CATEGORY_COLORS = {
  technical: '#7c5cfc',
  soft:      '#00d4ff',
  domain:    '#ff6b9d',
}

const LEVEL_SIZES = {
  1: { fontSize: 12, padding: '5px 12px' },
  2: { fontSize: 13, padding: '6px 13px' },
  3: { fontSize: 14, padding: '7px 14px' },
  4: { fontSize: 15, padding: '8px 16px' },
  5: { fontSize: 16, padding: '9px 18px' },
}

export function SkillsCloud({ skills }: { skills: Skill[] }) {
  const technical = skills.filter((s) => s.category === 'technical')
  const soft = skills.filter((s) => s.category === 'soft')
  const domain = skills.filter((s) => s.category === 'domain')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SkillSection label="Technical" color={CATEGORY_COLORS.technical} skills={technical} />
      <SkillSection label="Domain Expertise" color={CATEGORY_COLORS.domain} skills={domain} />
      <SkillSection label="Soft Skills" color={CATEGORY_COLORS.soft} skills={soft} />

      {/* Legend */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{ fontSize: 11, color: 'rgba(244,244,246,0.3)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Tag size = proficiency level
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {([1,2,3,4,5] as const).map((level) => (
            <div key={level} style={{
              ...LEVEL_SIZES[level],
              borderRadius: 30,
              background: 'rgba(124,92,252,0.12)',
              color: 'rgba(124,92,252,0.7)',
              border: '1px solid rgba(124,92,252,0.2)',
              display: 'flex', alignItems: 'center',
              fontWeight: 500,
            }}>
              {'L' + level}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillSection({ label, color, skills }: { label: string; color: string; skills: Skill[] }) {
  if (skills.length === 0) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: color }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(244,244,246,0.6)', letterSpacing: '0.04em' }}>
          {label}
        </p>
        <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.25)' }}>{skills.length}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills
          .sort((a, b) => b.level - a.level)
          .map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 30 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                ...LEVEL_SIZES[skill.level],
                borderRadius: 30,
                background: `${color}14`,
                color: color,
                border: `1px solid ${color}30`,
                fontWeight: 500,
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {skill.name}
              {skill.level >= 4 && (
                <span style={{ fontSize: 10, opacity: 0.7 }}>{'★'.repeat(skill.level - 3)}</span>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  )
}
