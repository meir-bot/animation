'use client'

import { useEffect, useRef } from 'react'

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const orbs = [
      { x: 0.15, y: 0.2,  r: 0.45, color: [124, 92, 252],  speed: 0.00018 },
      { x: 0.85, y: 0.8,  r: 0.4,  color: [0,  212, 255],  speed: 0.00023 },
      { x: 0.5,  y: 0.6,  r: 0.35, color: [255, 107, 157], speed: 0.00015 },
      { x: 0.7,  y: 0.15, r: 0.3,  color: [255, 179, 71],  speed: 0.0002  },
    ]

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#07070f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      orbs.forEach((orb, i) => {
        const ox = orb.x + Math.sin(t * orb.speed * 1000 + i * 2.1) * 0.12
        const oy = orb.y + Math.cos(t * orb.speed * 800  + i * 1.7) * 0.10
        const px = ox * canvas.width
        const py = oy * canvas.height
        const radius = orb.r * Math.min(canvas.width, canvas.height)

        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius)
        const [r, g, b] = orb.color
        grad.addColorStop(0,   `rgba(${r},${g},${b},0.12)`)
        grad.addColorStop(0.4, `rgba(${r},${g},${b},0.06)`)
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      t += 16
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
