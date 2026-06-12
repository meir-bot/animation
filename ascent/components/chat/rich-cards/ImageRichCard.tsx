'use client'

import { motion } from 'framer-motion'

export function ImageRichCard({ data }: { data: { url: string; prompt: string; caption?: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.1 }}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <img
        src={data.url}
        alt={data.caption || data.prompt}
        className="image-reveal"
        style={{ width: '100%', display: 'block' }}
      />
      {data.caption && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(7,7,15,0.8)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(244,244,246,0.5)', fontStyle: 'italic' }}>{data.caption}</p>
        </div>
      )}
    </motion.div>
  )
}
