'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { SpringButton } from '@/components/ui/SpringButton'
import { X, Building2, Lightbulb, FileText, User } from 'lucide-react'

interface NewThreadModalProps {
  onClose: () => void
}

const QUICK_STARTS = [
  { icon: '🔍', label: 'Research a company', prompt: 'Help me research a company I\'m interested in', stage: 'exploring' as const },
  { icon: '📄', label: 'Improve my resume', prompt: 'Review and improve my resume for a specific role', stage: 'general' as const },
  { icon: '💼', label: 'Prep for interview', prompt: 'Help me prepare for an upcoming interview', stage: 'interviewing' as const },
  { icon: '🤝', label: 'LinkedIn profile', prompt: 'Help me optimize my LinkedIn profile', stage: 'general' as const },
  { icon: '💰', label: 'Negotiate offer', prompt: 'I have an offer I want to negotiate', stage: 'offered' as const },
  { icon: '🎯', label: 'Job search strategy', prompt: 'Help me build a job search strategy', stage: 'general' as const },
]

export function NewThreadModal({ onClose }: NewThreadModalProps) {
  const router = useRouter()
  const createThread = useStore((s) => s.createThread)
  const addMessage = useStore((s) => s.addMessage)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')

  function start(prompt: string, stage?: string, companyName?: string) {
    const thread = createThread({
      stage: (stage as 'general') || 'general',
      company: companyName || company || undefined,
      jobTitle: role || undefined,
    })
    if (companyName || company) {
      // Update title
      useStore.getState().updateThread(thread.id, {
        title: companyName
          ? `${companyName} Research`
          : company
          ? `${company}${role ? ` — ${role}` : ''}`
          : 'New Thread',
      })
    }
    onClose()
    router.push(`/thread/${thread.id}?init=${encodeURIComponent(prompt)}`)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
        }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          background: '#0e0e1a',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '28px 28px 0 0',
          padding: '12px 20px 40px',
          zIndex: 101,
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{
          width: 36, height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.15)',
          margin: '4px auto 20px',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>New Thread</h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 32, height: 32,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(244,244,246,0.5)',
            }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Quick starts */}
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', marginBottom: 10 }}>Quick Start</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {QUICK_STARTS.map((qs) => (
            <motion.button
              key={qs.label}
              whileTap={{ scale: 0.96 }}
              whileHover={{ background: 'rgba(255,255,255,0.07)' }}
              onClick={() => start(qs.prompt, qs.stage)}
              style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}
            >
              <span style={{ fontSize: 20 }}>{qs.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#f4f4f6', lineHeight: 1.3 }}>{qs.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Custom */}
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', marginBottom: 10 }}>Or be specific</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            placeholder="Company name (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#f4f4f6',
              fontSize: 15,
              outline: 'none',
            }}
          />
          <input
            placeholder="Role title (optional)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#f4f4f6',
              fontSize: 15,
              outline: 'none',
            }}
          />
          <textarea
            placeholder="What do you want to explore? (optional)"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#f4f4f6',
              fontSize: 15,
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
          <SpringButton
            variant="primary"
            fullWidth
            onClick={() => {
              const prompt = customPrompt
                || (company && role ? `Help me research ${role} role at ${company}` : null)
                || (company ? `Tell me about ${company} as a potential employer` : null)
                || 'I want to talk about my career'
              start(prompt!, 'exploring', company || undefined)
            }}
          >
            Start Thread
          </SpringButton>
        </div>
      </motion.div>
    </>
  )
}
