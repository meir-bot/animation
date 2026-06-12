'use client'

import { motion } from 'framer-motion'
import type { JobCard } from '@/lib/types'
import { MapPin, DollarSign, ExternalLink, Star } from 'lucide-react'

export function JobRichCard({ data }: { data: JobCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30, delay: 0.1 }}
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      {/* Hero image */}
      {data.companyImageUrl && (
        <div style={{ height: 100, overflow: 'hidden', position: 'relative' }}>
          <img
            src={data.companyImageUrl}
            alt={data.company}
            className="image-reveal"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(7,7,15,0.9) 100%)',
          }} />
        </div>
      )}

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f6', letterSpacing: '-0.02em', marginBottom: 2 }}>
              {data.title}
            </p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#7c5cfc' }}>{data.company}</p>
          </div>
          {data.matchScore !== undefined && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 10px',
              borderRadius: 20,
              background: data.matchScore >= 80 ? 'rgba(16,185,129,0.15)' : data.matchScore >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${data.matchScore >= 80 ? 'rgba(16,185,129,0.3)' : data.matchScore >= 60 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              <Star size={10} color={data.matchScore >= 80 ? '#10b981' : data.matchScore >= 60 ? '#f59e0b' : '#ef4444'} fill={data.matchScore >= 80 ? '#10b981' : data.matchScore >= 60 ? '#f59e0b' : '#ef4444'} />
              <span style={{ fontSize: 12, fontWeight: 700, color: data.matchScore >= 80 ? '#10b981' : data.matchScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                {data.matchScore}%
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
          {data.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} color="rgba(244,244,246,0.4)" />
              <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.5)' }}>{data.location}</span>
            </div>
          )}
          {data.salary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <DollarSign size={12} color="rgba(244,244,246,0.4)" />
              <span style={{ fontSize: 12, color: 'rgba(244,244,246,0.5)' }}>{data.salary}</span>
            </div>
          )}
        </div>

        {data.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: data.url ? 12 : 0 }}>
            {data.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 9px',
                borderRadius: 20,
                background: 'rgba(124,92,252,0.12)',
                color: 'rgba(124,92,252,0.9)',
                border: '1px solid rgba(124,92,252,0.2)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '8px 12px',
              background: 'rgba(124,92,252,0.12)',
              border: '1px solid rgba(124,92,252,0.2)',
              borderRadius: 10,
              color: '#7c5cfc',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              width: 'fit-content',
            }}
          >
            <ExternalLink size={12} />
            View Job
          </a>
        )}
      </div>
    </motion.div>
  )
}
