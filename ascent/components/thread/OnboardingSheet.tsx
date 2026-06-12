'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { SpringButton } from '@/components/ui/SpringButton'
import { ChevronRight, Sparkles, Key, User, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STEPS = [
  {
    emoji: '✨',
    title: 'Welcome to Ascent',
    subtitle: 'Your AI-powered career intelligence companion',
    body: 'Research companies, polish your resume, prep for interviews, and get LinkedIn advice — all in one beautiful, conversational experience.',
    cta: 'Get Started',
  },
  {
    emoji: '🔑',
    title: 'Add Your API Key',
    subtitle: 'Required to power the AI agent',
    body: 'Your Anthropic API key stays on your device and is never shared. It powers real-time streaming responses with tool use.',
    cta: 'Continue',
    isKeyStep: true,
  },
  {
    emoji: '🚀',
    title: "You're all set",
    subtitle: 'Start your first conversation',
    body: 'Try searching for a company you\'re interested in, or ask for help improving your resume. The agent can search, analyze, and generate visuals.',
    cta: 'Start Exploring',
  },
]

interface OnboardingSheetProps {
  onComplete: () => void
}

export function OnboardingSheet({ onComplete }: OnboardingSheetProps) {
  const [step, setStep] = useState(0)
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const setApiKeys = useStore((s) => s.setApiKeys)
  const router = useRouter()

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function next() {
    if (current.isKeyStep && apiKey) {
      setApiKeys({ anthropic: apiKey })
    }
    if (isLast) {
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(12px)',
          zIndex: 200,
        }}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 36 }}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(180deg, #0e0e1f 0%, #07070f 100%)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '32px 32px 0 0',
          padding: '16px 28px 48px',
          zIndex: 201,
        }}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 36 }}>
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 24 : 6,
                background: i === step ? '#7c5cfc' : 'rgba(255,255,255,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ height: 6, borderRadius: 3 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                style={{
                  fontSize: 56,
                  marginBottom: 20,
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                {current.emoji}
              </motion.div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: '#f4f4f6', marginBottom: 6 }}>
                {current.title}
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.5)', marginBottom: 16, fontWeight: 500 }}>
                {current.subtitle}
              </p>
              <p style={{ fontSize: 15, color: 'rgba(244,244,246,0.65)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                {current.body}
              </p>
            </div>

            {current.isKeyStep && (
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                }}>
                  <Key size={16} color="rgba(124,92,252,0.7)" style={{ flexShrink: 0 }} />
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="sk-ant-api03-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#f4f4f6',
                      fontSize: 14,
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,244,246,0.3)', fontSize: 12 }}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.3)', marginTop: 8, textAlign: 'center' }}>
                  Get your key at console.anthropic.com · Stored locally only
                </p>
                <p style={{
                  fontSize: 12,
                  color: 'rgba(244,244,246,0.3)',
                  marginTop: 6,
                  textAlign: 'center',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={() => next()}
                >
                  Skip for now
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <SpringButton
          variant="primary"
          fullWidth
          onClick={next}
          style={{ fontSize: 16, height: 52, borderRadius: 16 }}
        >
          {current.cta}
          <ChevronRight size={18} />
        </SpringButton>
      </motion.div>
    </>
  )
}
