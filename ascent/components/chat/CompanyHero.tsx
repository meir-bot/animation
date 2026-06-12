'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CompanyHeroProps {
  imageUrl: string
  companyName: string
  role?: string
  accentColor?: string
}

export function CompanyHero({ imageUrl, companyName, role, accentColor = '#7c5cfc' }: CompanyHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const parent = ref.current?.closest('[data-scroll]')
    if (!parent) return
    function onScroll() {
      setOffset((parent as Element).scrollTop * 0.4)
    }
    parent.addEventListener('scroll', onScroll, { passive: true })
    return () => parent.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', height: 180, overflow: 'hidden', borderRadius: '0 0 24px 24px', marginBottom: 16 }}>
      {/* Parallax image */}
      <div style={{
        position: 'absolute',
        inset: -40,
        transform: `translateY(${offset}px)`,
        willChange: 'transform',
      }}>
        <img
          src={imageUrl}
          alt={companyName}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(1.2)' }}
        />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, transparent 20%, rgba(7,7,15,0.95) 100%)`,
      }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '16px 20px',
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 10px 3px 6px',
          background: `${accentColor}22`,
          border: `1px solid ${accentColor}44`,
          borderRadius: 20,
          marginBottom: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: accentColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            AI Generated
          </span>
        </div>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {companyName}
        </p>
        {role && (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{role}</p>
        )}
      </motion.div>
    </div>
  )
}
