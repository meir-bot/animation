import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AmbientBackground } from '@/components/ui/AmbientBackground'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Ascent — Career Intelligence',
  description: 'Your AI-powered career companion',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Ascent' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07070f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="grain-overlay" aria-hidden />
        <AmbientBackground />
        <Providers>
          <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', zIndex: 1 }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
