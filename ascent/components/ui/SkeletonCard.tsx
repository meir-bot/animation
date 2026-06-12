'use client'

export function SkeletonCard({ height = 80 }: { height?: number }) {
  return (
    <div
      className="shimmer"
      style={{
        height,
        borderRadius: 20,
        background: 'rgba(255,255,255,0.04)',
      }}
    />
  )
}
