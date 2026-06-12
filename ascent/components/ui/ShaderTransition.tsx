'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const VERT_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision mediump float;
uniform float u_time;
uniform float u_progress;
uniform vec2 u_resolution;
uniform vec2 u_origin;

float easeInOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 st = uv - u_origin / u_resolution;
  st.x *= u_resolution.x / u_resolution.y;

  float dist = length(st);
  float maxDist = length(vec2(1.0, 1.0));
  float ripple = sin(dist * 18.0 - u_time * 8.0) * 0.5 + 0.5;
  float wave = easeInOut(u_progress);
  float reveal = smoothstep(wave - 0.25, wave + 0.05, dist / maxDist + ripple * 0.04);

  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
  float alpha = reveal * (1.0 - wave) + noise * 0.015;
  alpha = clamp(1.0 - reveal, 0.0, 1.0);

  vec3 color = mix(
    vec3(0.04, 0.04, 0.06),
    vec3(0.49, 0.36, 0.99),
    ripple * (1.0 - wave)
  );

  gl_FragColor = vec4(color, alpha * (1.0 - smoothstep(0.6, 1.0, wave)));
}
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

export function ShaderTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animRef = useRef<number>(0)
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const clickOrigin = useRef({ x: 0.5, y: 0.5 })

  // Track click origin for ripple source
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      clickOrigin.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const runTransition = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize WebGL once
    if (!glRef.current) {
      const gl = canvas.getContext('webgl', { premultipliedAlpha: false })
      if (!gl) return
      glRef.current = gl

      const prog = gl.createProgram()!
      gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC))
      gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC))
      gl.linkProgram(prog)
      programRef.current = prog

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'a_position')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }

    const gl = glRef.current
    const prog = programRef.current!
    gl.useProgram(prog)

    const origin = clickOrigin.current
    gl.uniform2f(gl.getUniformLocation(prog, 'u_resolution'), canvas.width, canvas.height)
    gl.uniform2f(gl.getUniformLocation(prog, 'u_origin'), origin.x, canvas.height - origin.y)

    let start: number | null = null
    const DURATION = 700

    cancelAnimationFrame(animRef.current)
    canvas.style.pointerEvents = 'auto'

    function frame(ts: number) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / DURATION, 1)

      if (!canvas || !gl || !prog) return
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_time'), ts / 1000)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_progress'), progress)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        canvas.style.pointerEvents = 'none'
      }
    }
    animRef.current = requestAnimationFrame(frame)
  }, [])

  // Trigger on path change
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      runTransition()
    }
  }, [pathname, runTransition])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  )
}
