'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import type { Message, RichCard, JobCard, ResumeBullet, LinkedInTip, MatchScore } from '@/lib/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { JobRichCard } from './rich-cards/JobRichCard'
import { ResumeBulletCard } from './rich-cards/ResumeBulletCard'
import { LinkedInTipCard } from './rich-cards/LinkedInTipCard'
import { MatchScoreCard } from './rich-cards/MatchScoreCard'
import { ImageRichCard } from './rich-cards/ImageRichCard'

interface MessageBubbleProps {
  message: Message
  index: number
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.isStreaming

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 35,
        delay: 0,
      }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        padding: '3px 0',
      }}
    >
      <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {/* Main bubble */}
        <div style={{
          padding: '11px 15px',
          borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
          background: isUser
            ? 'linear-gradient(135deg, #7c5cfc 0%, #5b8af5 100%)'
            : 'rgba(255,255,255,0.06)',
          backdropFilter: isUser ? undefined : 'blur(20px)',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isUser ? '0 4px 20px rgba(124,92,252,0.3)' : undefined,
          minWidth: 40,
        }}>
          {isStreaming && !message.content ? (
            <div style={{ display: 'flex', gap: 4, padding: '2px 0' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="typing-dot"
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'rgba(244,244,246,0.5)',
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <StreamingMarkdown content={message.content} isStreaming={isStreaming} isUser={isUser} />
          )}
        </div>

        {/* Rich cards */}
        {message.richCards && message.richCards.length > 0 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {message.richCards.map((card, i) => (
              <RichCardRenderer key={i} card={card} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function StreamingMarkdown({
  content,
  isStreaming,
  isUser,
}: {
  content: string
  isStreaming?: boolean
  isUser: boolean
}) {
  const prevLen = useRef(0)

  if (!content) return null

  const textColor = isUser ? '#fff' : '#f4f4f6'
  const mutedColor = isUser ? 'rgba(255,255,255,0.7)' : 'rgba(244,244,246,0.5)'

  return (
    <div style={{ fontSize: 15, lineHeight: 1.6, color: textColor }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p style={{ margin: '0 0 8px', color: textColor }}>{children}</p>,
          strong: ({ children }) => <strong style={{ color: textColor, fontWeight: 600 }}>{children}</strong>,
          em: ({ children }) => <em style={{ color: mutedColor }}>{children}</em>,
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            return isBlock ? (
              <code style={{
                display: 'block',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 13,
                fontFamily: 'ui-monospace, monospace',
                color: '#a5f3fc',
                margin: '8px 0',
                overflowX: 'auto',
              }}>
                {children}
              </code>
            ) : (
              <code style={{
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 5,
                padding: '1px 5px',
                fontSize: 13,
                fontFamily: 'ui-monospace, monospace',
                color: isUser ? '#e0e7ff' : '#a5f3fc',
              }}>
                {children}
              </code>
            )
          },
          ul: ({ children }) => <ul style={{ paddingLeft: 18, margin: '4px 0 8px', color: textColor }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ paddingLeft: 18, margin: '4px 0 8px', color: textColor }}>{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: 3, color: textColor }}>{children}</li>,
          h1: ({ children }) => <h1 style={{ fontSize: 18, fontWeight: 700, color: textColor, marginBottom: 8 }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 6 }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 600, color: textColor, marginBottom: 4 }}>{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: `3px solid ${isUser ? 'rgba(255,255,255,0.4)' : 'rgba(124,92,252,0.6)'}`,
              paddingLeft: 12,
              color: mutedColor,
              margin: '6px 0',
            }}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: isUser ? '#c7d2fe' : '#7c5cfc', textDecoration: 'underline' }}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span style={{
          display: 'inline-block',
          width: 2,
          height: 14,
          background: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(124,92,252,0.9)',
          borderRadius: 1,
          marginLeft: 1,
          verticalAlign: 'middle',
          animation: 'glowPulse 0.7s ease-in-out infinite',
        }} />
      )}
    </div>
  )
}

function RichCardRenderer({ card }: { card: RichCard }) {
  switch (card.type) {
    case 'job':    return <JobRichCard data={card.data as JobCard} />
    case 'resume_bullet': return <ResumeBulletCard data={card.data as ResumeBullet} />
    case 'linkedin_tip': return <LinkedInTipCard data={card.data as LinkedInTip} />
    case 'match_score':  return <MatchScoreCard data={card.data as MatchScore} />
    case 'image':  return <ImageRichCard data={card.data as { url: string; prompt: string; caption?: string }} />
    default: return null
  }
}
