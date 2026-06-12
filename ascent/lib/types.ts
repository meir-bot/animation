export type MessageRole = 'user' | 'assistant' | 'tool'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
  toolResults?: ToolResult[]
  richCards?: RichCard[]
  isStreaming?: boolean
}

export interface ToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface ToolResult {
  toolCallId: string
  content: string
  data?: unknown
}

export type RichCardType = 'job' | 'company' | 'resume_bullet' | 'linkedin_tip' | 'match_score' | 'image'

export interface RichCard {
  type: RichCardType
  data: JobCard | CompanyCard | ResumeBullet | LinkedInTip | MatchScore | ImageCard
}

export interface JobCard {
  title: string
  company: string
  location: string
  salary?: string
  tags: string[]
  matchScore?: number
  url?: string
  companyImageUrl?: string
  description?: string
}

export interface CompanyCard {
  name: string
  industry: string
  size?: string
  description: string
  imageUrl?: string
  website?: string
  culture?: string[]
}

export interface ResumeBullet {
  original?: string
  improved: string
  reason: string
  impact: 'high' | 'medium' | 'low'
}

export interface LinkedInTip {
  section: string
  tip: string
  example?: string
  priority: 'high' | 'medium' | 'low'
}

export interface MatchScore {
  score: number
  strengths: string[]
  gaps: string[]
  recommendation: string
}

export interface ImageCard {
  url: string
  prompt: string
  caption?: string
}

export interface Thread {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
  context: ThreadContext
  pinned?: boolean
  companyImageUrl?: string
  accentColor?: string
  emoji?: string
}

export interface ThreadContext {
  jobTitle?: string
  company?: string
  stage?: 'exploring' | 'applied' | 'interviewing' | 'offered' | 'general'
  jobUrl?: string
  notes?: string
}

export interface CareerEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  description: string
  skills: string[]
  achievements: string[]
  companyImageUrl?: string
  accentColor?: string
}

export interface Skill {
  name: string
  category: 'technical' | 'soft' | 'domain'
  level: 1 | 2 | 3 | 4 | 5
  yearsExp: number
}

export interface UserProfile {
  name: string
  email: string
  title: string
  summary?: string
  location?: string
  avatarUrl?: string
  linkedInUrl?: string
  githubUrl?: string
  careerEntries: CareerEntry[]
  skills: Skill[]
  education: EducationEntry[]
}

export interface EducationEntry {
  institution: string
  degree: string
  field: string
  graduationYear: number
}
