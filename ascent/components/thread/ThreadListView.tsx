'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import type { Thread } from '@/lib/types'
import { ThreadCard } from './ThreadCard'
import { NewThreadModal } from './NewThreadModal'
import { BottomNav } from '@/components/layout/BottomNav'
import { SpringButton } from '@/components/ui/SpringButton'
import { Plus, Sparkles } from 'lucide-react'

export function ThreadListView() {
  const router = useRouter()
  const threads = useStore((s) => s.threads)
  const [showNew, setShowNew] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const pinned = threads.filter((t) => t.pinned)
  const recent = threads
    .filter((t) => !t.pinned)
    .filter((t) =>
      searchQuery
        ? t.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  function openThread(id: string) {
    router.push(`/thread/${id}`)
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          padding: '56px 20px 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <div style={{
                width: 28, height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #7c5cfc, #00d4ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={14} color="#fff" />
              </div>
              <span style={{ fontSize: 14, color: 'rgba(244,244,246,0.4)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ascent</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#f4f4f6' }}>
              Career Hub
            </h1>
          </div>

          <SpringButton
            variant="primary"
            size="icon"
            onClick={() => setShowNew(true)}
            style={{ borderRadius: 16, width: 48, height: 48 }}
          >
            <Plus size={20} />
          </SpringButton>
        </div>

        {/* Search */}
        <div style={{
          position: 'relative',
          marginBottom: 8,
        }}>
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 16px',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              color: '#f4f4f6',
              fontSize: 15,
              outline: 'none',
            }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 20px',
          paddingBottom: 100,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {threads.length === 0 ? (
          <EmptyState onNew={() => setShowNew(true)} />
        ) : (
          <>
            {pinned.length > 0 && (
              <Section label="Pinned">
                {pinned.map((thread, i) => (
                  <ThreadCard key={thread.id} thread={thread} index={i} onClick={() => openThread(thread.id)} />
                ))}
              </Section>
            )}

            <Section label={searchQuery ? 'Results' : 'Recent'}>
              {recent.length === 0 && searchQuery ? (
                <p style={{ color: 'rgba(244,244,246,0.3)', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
                  No threads match "{searchQuery}"
                </p>
              ) : (
                recent.map((thread, i) => (
                  <ThreadCard key={thread.id} thread={thread} index={i} onClick={() => openThread(thread.id)} />
                ))
              )}
            </Section>
          </>
        )}
      </div>

      <BottomNav active="home" />

      <AnimatePresence>
        {showNew && <NewThreadModal onClose={() => setShowNew(false)} />}
      </AnimatePresence>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(244,244,246,0.3)',
        padding: '12px 4px 8px',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{
        width: 72, height: 72,
        borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(124,92,252,0.2), rgba(0,212,255,0.2))',
        border: '1px solid rgba(124,92,252,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32,
        marginBottom: 8,
      }}>
        🚀
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#f4f4f6' }}>
        Start your journey
      </h2>
      <p style={{ fontSize: 15, color: 'rgba(244,244,246,0.45)', lineHeight: 1.6, maxWidth: 260 }}>
        Create your first thread to research jobs, polish your resume, or get career advice.
      </p>
      <SpringButton variant="primary" onClick={onNew} style={{ marginTop: 8 }}>
        <Plus size={16} />
        New Thread
      </SpringButton>
    </motion.div>
  )
}
