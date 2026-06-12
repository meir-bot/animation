'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'
import { SpringButton } from '@/components/ui/SpringButton'
import { Edit3, Plus, X, Save } from 'lucide-react'
import type { CareerEntry, Skill } from '@/lib/types'
import { generateId } from '@/lib/utils'

export function ProfileView() {
  const profile = useStore((s) => s.profile)
  const updateProfile = useStore((s) => s.updateProfile)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [title, setTitle] = useState(profile.title)
  const [summary, setSummary] = useState(profile.summary || '')
  const [location, setLocation] = useState(profile.location || '')
  const [linkedIn, setLinkedIn] = useState(profile.linkedInUrl || '')
  const [saved, setSaved] = useState(false)

  function save() {
    updateProfile({ name, title, summary, location, linkedInUrl: linkedIn })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '52px 20px 12px', flexShrink: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em' }}>Profile</h1>
          <SpringButton variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
            <Edit3 size={14} />
            {editing ? 'Cancel' : 'Edit'}
          </SpringButton>
        </div>
      </motion.div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px', paddingBottom: 100 }}>
        {/* Avatar + name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(124,92,252,0.1), rgba(0,212,255,0.06))',
            border: '1px solid rgba(124,92,252,0.15)',
            borderRadius: 22,
            marginBottom: 20,
          }}
        >
          <div style={{
            width: 72, height: 72,
            borderRadius: 24,
            background: profile.avatarUrl ? undefined : 'linear-gradient(135deg, #7c5cfc, #00d4ff)',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#fff',
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : profile.name.charAt(0).toUpperCase()
            }
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                  style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#f4f4f6', fontSize: 16, fontWeight: 700, outline: 'none' }}
                />
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title"
                  style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(244,244,246,0.7)', fontSize: 14, outline: 'none' }}
                />
              </div>
            ) : (
              <>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#f4f4f6', letterSpacing: '-0.03em' }}>{profile.name}</p>
                <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.6)', marginTop: 2 }}>{profile.title}</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <Section label="About">
          <Field label="Summary" editing={editing}
            value={summary} onChange={setSummary}
            display={profile.summary || '—'} multiline
          />
          <Field label="Location" editing={editing}
            value={location} onChange={setLocation}
            display={profile.location || '—'}
          />
          <Field label="LinkedIn" editing={editing}
            value={linkedIn} onChange={setLinkedIn}
            display={profile.linkedInUrl || '—'}
            placeholder="https://linkedin.com/in/..."
          />
        </Section>

        {editing && (
          <SpringButton variant="primary" fullWidth onClick={save} style={{ marginBottom: 20 }}>
            <Save size={15} />
            Save Changes
          </SpringButton>
        )}

        {/* Quick skill overview */}
        <Section label="Top Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {profile.skills.sort((a,b) => b.level - a.level).slice(0, 12).map((s) => (
              <span key={s.name} style={{
                fontSize: 12, fontWeight: 500,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(124,92,252,0.12)',
                color: 'rgba(124,92,252,0.9)',
                border: '1px solid rgba(124,92,252,0.2)',
              }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>

        {/* Experience summary */}
        <Section label="Experience">
          {profile.careerEntries.map((entry) => (
            <div key={entry.id} style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: `${entry.accentColor || '#7c5cfc'}22`,
                border: `1px solid ${entry.accentColor || '#7c5cfc'}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>🏢</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f6' }}>{entry.role}</p>
                <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.5)' }}>{entry.company}</p>
              </div>
              {!entry.endDate && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 6,
                  background: 'rgba(16,185,129,0.15)', color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.3)', textTransform: 'uppercase',
                }}>
                  Current
                </span>
              )}
            </div>
          ))}
        </Section>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', padding: '12px 4px 8px' }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}

function Field({
  label, editing, value, onChange, display, multiline, placeholder,
}: {
  label: string; editing: boolean; value: string; onChange: (v: string) => void;
  display: string; multiline?: boolean; placeholder?: string;
}) {
  return (
    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', marginBottom: 5 }}>{label}</p>
      {editing ? (
        multiline ? (
          <textarea
            value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || label}
            rows={3}
            style={{ width: '100%', padding: '6px 0', background: 'transparent', border: 'none', color: '#f4f4f6', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
          />
        ) : (
          <input
            value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || label}
            style={{ width: '100%', padding: '4px 0', background: 'transparent', border: 'none', color: '#f4f4f6', fontSize: 14, outline: 'none' }}
          />
        )
      ) : (
        <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.7)', lineHeight: 1.5 }}>{display}</p>
      )}
    </div>
  )
}
