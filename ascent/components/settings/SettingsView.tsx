'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { BottomNav } from '@/components/layout/BottomNav'
import { SpringButton } from '@/components/ui/SpringButton'
import { Eye, EyeOff, Key, Info, ChevronRight, Trash2 } from 'lucide-react'

export function SettingsView() {
  const apiKeys = useStore((s) => s.apiKeys)
  const setApiKeys = useStore((s) => s.setApiKeys)
  const threads = useStore((s) => s.threads)
  const [anthropicKey, setAnthropicKey] = useState(apiKeys.anthropic || '')
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '')
  const [showAnthropic, setShowAnthropic] = useState(false)
  const [showOpenAI, setShowOpenAI] = useState(false)
  const [saved, setSaved] = useState(false)

  function save() {
    setApiKeys({ anthropic: anthropicKey, openai: openaiKey })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function clearAll() {
    if (confirm('Delete all conversation threads? This cannot be undone.')) {
      useStore.getState().threads.forEach((t) => useStore.getState().deleteThread(t.id))
    }
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '52px 20px 12px', flexShrink: 0 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.4)' }}>Configure your AI keys</p>
      </motion.div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px', paddingBottom: 100 }}>
        {/* API Keys section */}
        <Section label="API Keys">
          <div style={{
            padding: '12px 16px',
            background: 'rgba(124,92,252,0.06)',
            border: '1px solid rgba(124,92,252,0.15)',
            borderRadius: 14,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            marginBottom: 12,
          }}>
            <Info size={14} color="rgba(124,92,252,0.7)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.5)', lineHeight: 1.6 }}>
              Keys are stored locally in your browser and never sent to our servers. Only used directly with AI provider APIs.
            </p>
          </div>

          <ApiKeyField
            label="Anthropic (Claude)"
            description="Powers the AI agent — required"
            value={anthropicKey}
            onChange={setAnthropicKey}
            show={showAnthropic}
            onToggle={() => setShowAnthropic(!showAnthropic)}
            placeholder="sk-ant-..."
          />

          <ApiKeyField
            label="OpenAI"
            description="Used for company image generation"
            value={openaiKey}
            onChange={setOpenaiKey}
            show={showOpenAI}
            onToggle={() => setShowOpenAI(!showOpenAI)}
            placeholder="sk-..."
          />

          <SpringButton
            variant={saved ? 'glass' : 'primary'}
            fullWidth
            onClick={save}
            style={{ marginTop: 4 }}
          >
            <Key size={15} />
            {saved ? '✓ Saved' : 'Save API Keys'}
          </SpringButton>
        </Section>

        {/* App info */}
        <Section label="About">
          <SettingsRow label="Version" value="1.0.0" />
          <SettingsRow label="Threads" value={`${threads.length}`} />
          <SettingsRow label="Model" value="Claude claude-sonnet-4-6" />
          <SettingsRow label="Image Gen" value="OpenAI DALL-E 3" />
        </Section>

        {/* Danger zone */}
        <Section label="Data">
          <SpringButton
            variant="danger"
            fullWidth
            onClick={clearAll}
            style={{ borderRadius: 14 }}
          >
            <Trash2 size={15} />
            Clear All Threads
          </SpringButton>
        </Section>
      </div>

      <BottomNav active="settings" />
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: 24 }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,244,246,0.3)', padding: '12px 4px 8px' }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </motion.div>
  )
}

function ApiKeyField({
  label, description, value, onChange, show, onToggle, placeholder,
}: {
  label: string; description: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; placeholder: string;
}) {
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f6', marginBottom: 1 }}>{label}</p>
        <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.4)' }}>{description}</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '9px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            color: '#f4f4f6',
            fontSize: 13,
            outline: 'none',
            fontFamily: 'ui-monospace, monospace',
          }}
        />
        <button
          onClick={onToggle}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(244,244,246,0.4)', flexShrink: 0,
          }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {value && (
        <p style={{ fontSize: 11, color: 'rgba(16,185,129,0.7)' }}>
          ✓ {value.length > 8 ? `${value.slice(0,4)}...${value.slice(-4)}` : '****'}
        </p>
      )}
    </div>
  )
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: 14, color: 'rgba(244,244,246,0.6)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'rgba(244,244,246,0.4)', fontFamily: 'ui-monospace, monospace' }}>{value}</span>
    </div>
  )
}
