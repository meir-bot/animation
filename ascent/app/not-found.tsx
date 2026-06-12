import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
      textAlign: 'center',
      background: '#07070f',
      color: '#f4f4f6',
    }}>
      <p style={{ fontSize: 48 }}>🔍</p>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>Page not found</h1>
      <p style={{ fontSize: 15, color: 'rgba(244,244,246,0.4)' }}>This page doesn't exist.</p>
      <Link href="/" style={{
        marginTop: 8,
        padding: '10px 24px',
        background: 'linear-gradient(135deg, #7c5cfc, #00d4ff)',
        borderRadius: 14,
        color: '#fff',
        fontWeight: 600,
        textDecoration: 'none',
        fontSize: 15,
      }}>
        Back to Home
      </Link>
    </div>
  )
}
