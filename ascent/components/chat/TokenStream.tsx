'use client'

import { useEffect, useRef, useState } from 'react'

interface TokenStreamProps {
  content: string
  isStreaming?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders text with a per-token fade-in animation as new content arrives.
 * Splits on whitespace boundaries to animate word-by-word.
 */
export function TokenStream({ content, isStreaming, className, style }: TokenStreamProps) {
  const prevContentRef = useRef('')
  const [tokens, setTokens] = useState<Array<{ text: string; key: number; isNew: boolean }>>([])
  const keyRef = useRef(0)

  useEffect(() => {
    const prev = prevContentRef.current
    if (content === prev) return

    // Find new content appended since last render
    const newText = content.startsWith(prev) ? content.slice(prev.length) : content

    if (newText) {
      // Split new text into word-ish tokens (preserve whitespace)
      const newTokens = newText.split(/(\s+)/).filter(Boolean)

      setTokens((existing) => {
        // If content was reset (new message), start fresh
        if (!content.startsWith(prev)) {
          return content.split(/(\s+)/).filter(Boolean).map((t) => ({
            text: t,
            key: keyRef.current++,
            isNew: false,
          }))
        }
        const incoming = newTokens.map((t) => ({
          text: t,
          key: keyRef.current++,
          isNew: true,
        }))
        const result = [...existing, ...incoming]
        // After animation, mark as not-new
        setTimeout(() => {
          setTokens((ts) => ts.map((tk) => ({ ...tk, isNew: false })))
        }, 400)
        return result
      })
    }

    prevContentRef.current = content
  }, [content])

  if (!content) return null

  return (
    <span className={className} style={{ display: 'inline', ...style }}>
      {tokens.map((token) => (
        <span
          key={token.key}
          style={token.isNew ? {
            display: 'inline',
            animation: 'tokenIn 0.18s ease-out both',
          } : { display: 'inline' }}
        >
          {token.text}
        </span>
      ))}
      {isStreaming && (
        <span style={{
          display: 'inline-block',
          width: 2,
          height: '0.85em',
          background: 'currentColor',
          borderRadius: 1,
          marginLeft: 1,
          verticalAlign: 'middle',
          opacity: 0.7,
          animation: 'glowPulse 0.6s ease-in-out infinite',
        }} />
      )}
    </span>
  )
}
