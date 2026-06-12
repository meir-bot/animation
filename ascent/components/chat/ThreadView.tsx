'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import type { Message } from '@/lib/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from '@/components/ui/TypingIndicator'
import { ThreadHeader } from './ThreadHeader'
import { AgentStatusBar } from './AgentStatusBar'

interface ThreadViewProps {
  threadId: string
}

export function ThreadView({ threadId }: ThreadViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const thread = useStore((s) => s.threads.find((t) => t.id === threadId))
  const addMessage = useStore((s) => s.addMessage)
  const updateMessage = useStore((s) => s.updateMessage)
  const apiKeys = useStore((s) => s.apiKeys)
  const profile = useStore((s) => s.profile)

  const [isStreaming, setIsStreaming] = useState(false)
  const [agentStatus, setAgentStatus] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const initSent = useRef(false)

  // Redirect if thread not found
  useEffect(() => {
    if (!thread) router.replace('/')
  }, [thread, router])

  // Auto-scroll
  function scrollToBottom(smooth = true) {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }

  useEffect(() => { scrollToBottom(false) }, [])

  // Handle init prompt from URL
  useEffect(() => {
    const init = searchParams.get('init')
    if (init && thread && thread.messages.length === 0 && !initSent.current) {
      initSent.current = true
      sendMessage(init)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread?.id])

  const sendMessage = useCallback(async (content: string) => {
    if (!thread || isStreaming) return

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    addMessage(threadId, userMsg)
    setIsStreaming(true)
    setAgentStatus('Thinking...')
    scrollToBottom()

    const assistantId = generateId()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(threadId, assistantMsg)

    try {
      abortRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...(thread?.messages || []), userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          profile: {
            name: profile.name,
            title: profile.title,
            skills: profile.skills.map((s) => s.name),
            experience: profile.careerEntries.map((e) => `${e.role} at ${e.company}`),
          },
          context: thread?.context,
          apiKey: apiKeys.anthropic,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${response.status}`)
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let richCards: Message['richCards'] = []

      setAgentStatus(null)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'text') {
                fullContent += data.text
                updateMessage(threadId, assistantId, { content: fullContent, isStreaming: true })
                scrollToBottom()
              } else if (data.type === 'status') {
                setAgentStatus(data.text)
              } else if (data.type === 'card') {
                richCards = [...(richCards || []), data.card]
                updateMessage(threadId, assistantId, { richCards })
              } else if (data.type === 'done') {
                updateMessage(threadId, assistantId, {
                  content: fullContent,
                  isStreaming: false,
                  richCards,
                })
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        updateMessage(threadId, assistantId, { isStreaming: false })
      } else {
        const errorMsg = err instanceof Error ? err.message : 'Something went wrong'
        updateMessage(threadId, assistantId, {
          content: `Sorry, I ran into an error: ${errorMsg}\n\nMake sure you've added your Anthropic API key in Settings.`,
          isStreaming: false,
        })
      }
    } finally {
      setIsStreaming(false)
      setAgentStatus(null)
      scrollToBottom()
    }
  }, [thread, isStreaming, threadId, addMessage, updateMessage, apiKeys, profile])

  function stopStreaming() {
    abortRef.current?.abort()
  }

  if (!thread) return null

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ThreadHeader thread={thread} onBack={() => router.push('/')} />

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {thread.messages.length === 0 && (
          <WelcomeHints context={thread.context} onSend={sendMessage} />
        )}

        <AnimatePresence initial={false}>
          {thread.messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              index={i}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isStreaming && agentStatus && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ paddingLeft: 8, paddingTop: 4 }}
            >
              <TypingIndicator label={agentStatus} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      <AnimatePresence>
        {agentStatus && !agentStatus.startsWith('Thinking') && (
          <AgentStatusBar status={agentStatus} />
        )}
      </AnimatePresence>

      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        disabled={false}
      />
    </div>
  )
}

function WelcomeHints({
  context,
  onSend,
}: {
  context: { company?: string; jobTitle?: string; stage?: string }
  onSend: (msg: string) => void
}) {
  const suggestions = context.company
    ? [
        `What's ${context.company}'s culture like?`,
        `What skills matter most for this role?`,
        `Help me tailor my resume for ${context.company}`,
        `What questions should I ask in an interview?`,
      ]
    : [
        'Help me find senior engineering roles at AI companies',
        'Review my resume and suggest improvements',
        'How do I negotiate a higher salary?',
        'What should my LinkedIn headline say?',
      ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '24px 0 8px', display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 32, marginBottom: 10 }}>✨</p>
        <p style={{ fontSize: 18, fontWeight: 600, color: '#f4f4f6', marginBottom: 6, letterSpacing: '-0.02em' }}>
          {context.company ? `Let's dive into ${context.company}` : "I'm here to help"}
        </p>
        <p style={{ fontSize: 14, color: 'rgba(244,244,246,0.4)', lineHeight: 1.6 }}>
          Ask me anything about jobs, your resume, or career strategy.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {suggestions.map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSend(s)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              color: 'rgba(244,244,246,0.7)',
              fontSize: 14,
              textAlign: 'left',
              cursor: 'pointer',
              lineHeight: 1.4,
            }}
          >
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
