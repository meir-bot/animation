'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Thread, Message, UserProfile, CareerEntry, Skill } from './types'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface AppStore {
  threads: Thread[]
  activeThreadId: string | null
  profile: UserProfile
  apiKeys: { anthropic: string; openai: string }

  // Thread actions
  createThread: (context?: Partial<Thread['context']>) => Thread
  updateThread: (id: string, updates: Partial<Thread>) => void
  deleteThread: (id: string) => void
  setActiveThread: (id: string | null) => void
  addMessage: (threadId: string, message: Message) => void
  updateMessage: (threadId: string, messageId: string, updates: Partial<Message>) => void

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => void
  addCareerEntry: (entry: CareerEntry) => void
  updateCareerEntry: (id: string, updates: Partial<CareerEntry>) => void

  // Settings
  setApiKeys: (keys: { anthropic?: string; openai?: string }) => void
}

const defaultProfile: UserProfile = {
  name: 'Your Name',
  email: '',
  title: 'Software Engineer',
  summary: '',
  location: '',
  avatarUrl: '',
  linkedInUrl: '',
  githubUrl: '',
  careerEntries: [
    {
      id: '1',
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      startDate: '2021-03',
      endDate: undefined,
      description: 'Led development of core platform features',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      achievements: ['Reduced load time by 40%', 'Led team of 5 engineers'],
      accentColor: '#6C63FF',
    },
    {
      id: '2',
      company: 'StartupXYZ',
      role: 'Full Stack Developer',
      startDate: '2019-06',
      endDate: '2021-02',
      description: 'Built product from 0 to 1',
      skills: ['Vue.js', 'Python', 'PostgreSQL'],
      achievements: ['Launched product with 10k users in 3 months'],
      accentColor: '#00D4FF',
    },
  ],
  skills: [
    { name: 'TypeScript', category: 'technical', level: 5, yearsExp: 4 },
    { name: 'React', category: 'technical', level: 5, yearsExp: 5 },
    { name: 'Node.js', category: 'technical', level: 4, yearsExp: 4 },
    { name: 'Python', category: 'technical', level: 3, yearsExp: 3 },
    { name: 'System Design', category: 'domain', level: 4, yearsExp: 3 },
    { name: 'Leadership', category: 'soft', level: 4, yearsExp: 2 },
  ],
  education: [
    {
      institution: 'State University',
      degree: 'B.S.',
      field: 'Computer Science',
      graduationYear: 2019,
    },
  ],
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,
      profile: defaultProfile,
      apiKeys: { anthropic: '', openai: '' },

      createThread: (context = {}) => {
        const thread: Thread = {
          id: generateId(),
          title: context.company ? `${context.company} — ${context.jobTitle || 'Opportunity'}` : 'New Conversation',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
          context: { stage: 'general', ...context },
          accentColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
          emoji: THREAD_EMOJIS[Math.floor(Math.random() * THREAD_EMOJIS.length)],
        }
        set((s) => ({ threads: [thread, ...s.threads], activeThreadId: thread.id }))
        return thread
      },

      updateThread: (id, updates) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        }))
      },

      deleteThread: (id) => {
        set((s) => ({
          threads: s.threads.filter((t) => t.id !== id),
          activeThreadId: s.activeThreadId === id ? null : s.activeThreadId,
        }))
      },

      setActiveThread: (id) => set({ activeThreadId: id }),

      addMessage: (threadId, message) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, message], updatedAt: new Date() }
              : t
          ),
        }))
      },

      updateMessage: (threadId, messageId, updates) => {
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                }
              : t
          ),
        }))
      },

      updateProfile: (updates) => {
        set((s) => ({ profile: { ...s.profile, ...updates } }))
      },

      addCareerEntry: (entry) => {
        set((s) => ({
          profile: {
            ...s.profile,
            careerEntries: [entry, ...s.profile.careerEntries],
          },
        }))
      },

      updateCareerEntry: (id, updates) => {
        set((s) => ({
          profile: {
            ...s.profile,
            careerEntries: s.profile.careerEntries.map((e) =>
              e.id === id ? { ...e, ...updates } : e
            ),
          },
        }))
      },

      setApiKeys: (keys) => {
        set((s) => ({ apiKeys: { ...s.apiKeys, ...keys } }))
      },
    }),
    {
      name: 'ascent-store',
      partialize: (state) => ({
        threads: state.threads,
        profile: state.profile,
        apiKeys: state.apiKeys,
      }),
    }
  )
)

const ACCENT_COLORS = [
  '#6C63FF', '#00D4FF', '#FF6B9D', '#FFB347', '#4ECDC4',
  '#45B7D1', '#96CEB4', '#DDA0DD', '#98D8D8', '#F7DC6F',
]

const THREAD_EMOJIS = ['💼', '🚀', '⭐', '🎯', '💡', '🔥', '✨', '🌟', '🎪', '🏆']
