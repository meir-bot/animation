'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MessageSquare, BarChart3, User, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home',    icon: MessageSquare, label: 'Threads', href: '/' },
  { id: 'career',  icon: BarChart3,     label: 'Career',  href: '/career' },
  { id: 'profile', icon: User,          label: 'Profile', href: '/profile' },
  { id: 'settings',icon: Settings,      label: 'Settings',href: '/settings' },
]

export function BottomNav({ active }: { active: string }) {
  const router = useRouter()

  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      padding: '10px 16px 28px',
      background: 'rgba(7,7,15,0.8)',
      backdropFilter: 'blur(30px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      zIndex: 10,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {NAV_ITEMS.map(({ id, icon: Icon, label, href }) => {
          const isActive = active === id
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.push(href)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '6px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 12,
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 12,
                    background: 'rgba(124,92,252,0.12)',
                    border: '1px solid rgba(124,92,252,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={20}
                color={isActive ? '#7c5cfc' : 'rgba(244,244,246,0.35)'}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#7c5cfc' : 'rgba(244,244,246,0.3)',
                letterSpacing: '0.02em',
              }}>
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
