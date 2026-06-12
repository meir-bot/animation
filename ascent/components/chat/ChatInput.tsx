'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Square, Paperclip } from 'lucide-react'

interface ChatInputProps {
  onSend: (content: string) => void
  onStop: () => void
  isStreaming: boolean
  disabled: boolean
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function autoResize() {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }

  useEffect(() => { autoResize() }, [text])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = text.trim().length > 0 && !disabled

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      style={{
        padding: '8px 16px 24px',
        background: 'rgba(7,7,15,0.6)',
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 22,
        padding: '8px 8px 8px 14px',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); autoResize() }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your career..."
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: '#f4f4f6',
            fontSize: 16,
            lineHeight: 1.5,
            fontFamily: 'inherit',
            maxHeight: 160,
            overflowY: 'auto',
          }}
        />

        <AnimatePresence mode="wait">
          {isStreaming ? (
            <motion.button
              key="stop"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={onStop}
              style={{
                width: 36, height: 36,
                borderRadius: 12,
                background: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
                color: '#ef4444',
              }}
            >
              <Square size={14} fill="#ef4444" />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!canSend}
              style={{
                width: 36, height: 36,
                borderRadius: 12,
                background: canSend
                  ? 'linear-gradient(135deg, #7c5cfc 0%, #00d4ff 100%)'
                  : 'rgba(255,255,255,0.06)',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canSend ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                transition: 'background 0.2s',
                boxShadow: canSend ? '0 2px 12px rgba(124,92,252,0.4)' : 'none',
              }}
            >
              <Send size={14} color={canSend ? '#fff' : 'rgba(244,244,246,0.2)'} style={{ transform: 'translateX(1px)' }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
