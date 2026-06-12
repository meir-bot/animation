import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `You are Ascent, a brilliant, warm, and deeply knowledgeable career intelligence agent. You help users navigate their careers with genuine insight — like a trusted mentor who also happens to know the tech industry inside and out.

Your personality:
- Smart and direct, but never clinical or robotic
- Genuinely excited about helping people grow
- Playfully confident — you back your recommendations with data
- You notice details and make them feel seen

Your capabilities (tools):
- search_jobs: Find real job listings matching criteria
- analyze_company: Deep research on a company (culture, financials, growth, red flags)
- generate_company_image: Create a stunning visual representation of a company
- improve_resume_bullet: Transform weak bullet points into impact-driven statements
- linkedin_review: Analyze and optimize LinkedIn profile sections
- calculate_match: Score how well the user matches a role
- web_search: Search the web for current information

When using tools, narrate what you're doing ("Let me pull up their latest funding..." not just calling the tool silently). Keep responses focused and actionable. Use markdown for structure when helpful. Return rich cards for jobs, resume bullets, and tips — the UI renders them beautifully.

When generating company images or suggesting visual content, always call generate_company_image.

User context will be provided. Use it to personalize every response.`

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_jobs',
    description: 'Search for job listings based on title, company, location, and other criteria. Returns structured job data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Job title, skills, or keywords' },
        location: { type: 'string', description: 'City, state, or remote' },
        salary_min: { type: 'number', description: 'Minimum salary' },
        company_size: { type: 'string', enum: ['startup', 'mid', 'enterprise', 'any'] },
      },
      required: ['query'],
    },
  },
  {
    name: 'analyze_company',
    description: 'Deep research on a company including culture, growth, funding, glassdoor insights, and hiring trends.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_name: { type: 'string', description: 'Name of the company' },
        aspects: {
          type: 'array',
          items: { type: 'string', enum: ['culture', 'funding', 'growth', 'salary', 'interview', 'tech_stack', 'leadership'] },
          description: 'Which aspects to analyze',
        },
      },
      required: ['company_name'],
    },
  },
  {
    name: 'generate_company_image',
    description: 'Generate a beautiful, professional studio-style image representing a company or job opportunity. Returns an image URL.',
    input_schema: {
      type: 'object' as const,
      properties: {
        company_name: { type: 'string' },
        industry: { type: 'string', description: 'e.g. fintech, AI, healthcare, e-commerce' },
        vibe: { type: 'string', description: 'e.g. innovative startup, enterprise, creative agency' },
        style: { type: 'string', enum: ['architectural', 'abstract', 'office', 'tech', 'minimal'], description: 'Visual style' },
      },
      required: ['company_name'],
    },
  },
  {
    name: 'improve_resume_bullet',
    description: 'Transform a weak resume bullet point into a powerful, impact-driven statement using the STAR/XYZ method.',
    input_schema: {
      type: 'object' as const,
      properties: {
        bullet: { type: 'string', description: 'The original bullet point to improve' },
        role: { type: 'string', description: 'The role this bullet is for' },
        impact_area: { type: 'string', description: 'What area of impact (revenue, performance, users, etc.)' },
      },
      required: ['bullet'],
    },
  },
  {
    name: 'linkedin_review',
    description: 'Analyze and provide specific improvements for a LinkedIn profile section.',
    input_schema: {
      type: 'object' as const,
      properties: {
        section: { type: 'string', enum: ['headline', 'summary', 'experience', 'skills', 'about', 'connections'] },
        current_content: { type: 'string', description: 'Current content of the section' },
        target_role: { type: 'string', description: 'The kind of role they are targeting' },
      },
      required: ['section'],
    },
  },
  {
    name: 'calculate_match',
    description: 'Calculate how well the user matches a job based on their profile and the job requirements.',
    input_schema: {
      type: 'object' as const,
      properties: {
        job_title: { type: 'string' },
        job_requirements: { type: 'array', items: { type: 'string' } },
        company: { type: 'string' },
      },
      required: ['job_title'],
    },
  },
  {
    name: 'web_search',
    description: 'Search the web for current information about companies, jobs, salary data, or industry trends.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  },
]

function buildSSE(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

async function generateCompanyImage(
  companyName: string,
  industry: string = 'tech',
  style: string = 'architectural',
  openaiKey: string
): Promise<string | null> {
  if (!openaiKey) return null

  const styleMap: Record<string, string> = {
    architectural: 'modern glass architecture, architectural photography, golden hour, professional',
    abstract: 'abstract fluid art, gradient waves, dynamic shapes, premium',
    office: 'modern office space, open plan, natural light, premium interior',
    tech: 'futuristic technology, circuit patterns, blue purple gradient, premium',
    minimal: 'minimalist design, clean lines, white space, editorial',
  }

  const prompt = `A stunning, premium studio photograph representing ${companyName}, a ${industry} company. Style: ${styleMap[style] || styleMap.architectural}. Cinematic lighting, award-winning photography, ultra detailed, photorealistic, 8k. No text, no logos.`

  try {
    const resp = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size: '1792x1024',
        quality: 'hd',
        style: 'natural',
        n: 1,
      }),
    })

    if (!resp.ok) return null
    const data = await resp.json()
    return data.data?.[0]?.url ?? null
  } catch {
    return null
  }
}

function mockToolResult(toolName: string, input: Record<string, unknown>, userProfile: Record<string, unknown>): unknown {
  switch (toolName) {
    case 'search_jobs':
      return {
        jobs: [
          {
            title: input.query as string,
            company: 'Stripe',
            location: (input.location as string) || 'Remote',
            salary: '$180k–$240k',
            tags: ['TypeScript', 'React', 'Node.js', 'Distributed Systems'],
            matchScore: 87,
            url: 'https://stripe.com/jobs',
            description: 'Join Stripe to build economic infrastructure for the internet.',
          },
          {
            title: input.query as string,
            company: 'Vercel',
            location: 'Remote',
            salary: '$160k–$200k',
            tags: ['Next.js', 'TypeScript', 'Edge Computing'],
            matchScore: 82,
            url: 'https://vercel.com/careers',
          },
          {
            title: input.query as string,
            company: 'Linear',
            location: 'Remote',
            salary: '$150k–$190k',
            tags: ['React', 'TypeScript', 'WebSockets', 'Design'],
            matchScore: 79,
            url: 'https://linear.app/careers',
          },
        ],
      }

    case 'analyze_company':
      return {
        company: input.company_name,
        overview: `${input.company_name} is a leading company in its space with strong growth metrics and a compelling product vision.`,
        culture_score: 4.2,
        glassdoor_rating: 4.1,
        growth_stage: 'Series B / Growth',
        notable_perks: ['Remote-first', 'Equity compensation', 'Learning budget', 'Unlimited PTO'],
        interview_process: ['Recruiter screen', 'Technical assessment', 'System design', 'Team interviews', 'Offer'],
        tech_stack: ['React', 'TypeScript', 'Go', 'PostgreSQL', 'AWS'],
        red_flags: [],
        green_flags: ['Strong engineering culture', 'Transparent leadership', 'High employee retention'],
        recent_news: [`${input.company_name} raised $50M Series B`, 'Named a top workplace 2024'],
      }

    case 'improve_resume_bullet':
      return {
        original: input.bullet as string,
        improved: `Engineered a highly optimized ${input.bullet} solution, resulting in 40% performance improvement and $2M in annual cost savings, directly contributing to Q3 revenue growth.`,
        reason: 'Added quantifiable impact, specificity about the solution, and business outcome. Used strong action verb.',
        impact: 'high',
      }

    case 'linkedin_review':
      return {
        section: input.section,
        current_issues: ['Too generic', 'Missing keywords for ATS', 'No quantifiable achievements'],
        improved_version: `Results-driven ${(userProfile.title as string) || 'Engineer'} with a track record of shipping impactful products. Passionate about ${input.section === 'headline' ? 'building at the intersection of design and engineering' : 'solving hard problems with elegant solutions'}.`,
        tips: [
          { tip: 'Add 3-5 relevant keywords for your target roles', priority: 'high' },
          { tip: 'Include a specific achievement with numbers', priority: 'high' },
          { tip: 'Use first-person for the About section', priority: 'medium' },
        ],
      }

    case 'calculate_match':
      return {
        score: Math.floor(Math.random() * 30) + 65,
        strengths: [
          'Strong TypeScript and React experience',
          'Relevant domain experience',
          'Leadership background',
        ],
        gaps: [
          'Could strengthen system design portfolio',
          'More distributed systems experience would help',
        ],
        recommendation: 'You\'re a competitive candidate. Focus on demonstrating scale and impact in your resume.',
      }

    case 'web_search':
      return {
        results: [
          {
            title: `${input.query} — Latest Updates 2025`,
            snippet: 'Comprehensive analysis of the latest trends and data in this space...',
            url: 'https://example.com',
          },
        ],
        summary: `Based on current data about "${input.query}": The market is showing strong demand with competitive compensation. Companies are particularly valuing candidates with cross-functional experience.`,
      }

    default:
      return { result: 'Tool executed successfully' }
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { messages, profile, context, apiKey } = body

  if (!apiKey) {
    return Response.json({ error: 'No Anthropic API key provided. Add it in Settings.' }, { status: 401 })
  }

  const anthropic = new Anthropic({ apiKey })

  const userContext = `
User profile:
- Name: ${profile?.name || 'Unknown'}
- Current title: ${profile?.title || 'Not specified'}
- Skills: ${profile?.skills?.join(', ') || 'Not specified'}
- Experience: ${profile?.experience?.join('; ') || 'Not specified'}
${context?.company ? `- Currently exploring: ${context.company}${context.jobTitle ? ` for ${context.jobTitle} role` : ''}` : ''}
${context?.stage ? `- Stage: ${context.stage}` : ''}
`.trim()

  const openaiKey = body.openaiKey || ''

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(buildSSE(data)))
      }

      try {
        const anthropicMessages = messages as Anthropic.MessageParam[]
        let continueLoop = true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let currentMessages: any[] = [...anthropicMessages]

        while (continueLoop) {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: `${SYSTEM_PROMPT}\n\n${userContext}`,
            tools: TOOLS,
            messages: currentMessages as Anthropic.MessageParam[],
            stream: true,
          })

          let toolUses: Array<{ id: string; name: string; input: Record<string, unknown> }> = []
          let currentToolId = ''
          let currentToolName = ''
          let currentToolInputStr = ''
          let textBuffer = ''
          let hasToolUse = false

          for await (const event of response) {
            if (event.type === 'content_block_start') {
              if (event.content_block.type === 'tool_use') {
                hasToolUse = true
                currentToolId = event.content_block.id
                currentToolName = event.content_block.name
                currentToolInputStr = ''
                send({ type: 'status', text: `Using ${currentToolName.replace(/_/g, ' ')}...` })
              }
            } else if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                textBuffer += event.delta.text
                send({ type: 'text', text: event.delta.text })
              } else if (event.delta.type === 'input_json_delta') {
                currentToolInputStr += event.delta.partial_json
              }
            } else if (event.type === 'content_block_stop') {
              if (currentToolName) {
                let toolInput: Record<string, unknown> = {}
                try { toolInput = JSON.parse(currentToolInputStr) } catch { /* */ }
                toolUses.push({ id: currentToolId, name: currentToolName, input: toolInput })
                currentToolName = ''
                currentToolId = ''
                currentToolInputStr = ''
              }
            } else if (event.type === 'message_stop') {
              continueLoop = hasToolUse
            }
          }

          if (toolUses.length === 0) {
            continueLoop = false
            break
          }

          // Process tool calls
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const assistantContent: any[] = []
          if (textBuffer) {
            assistantContent.push({ type: 'text', text: textBuffer })
          }
          for (const tu of toolUses) {
            assistantContent.push({ type: 'tool_use', id: tu.id, name: tu.name, input: tu.input })
          }

          const toolResults: Anthropic.ToolResultBlockParam[] = []

          for (const tu of toolUses) {
            send({ type: 'status', text: getToolStatusText(tu.name, tu.input) })

            // Special handling: image generation via OpenAI
            if (tu.name === 'generate_company_image') {
              const imageUrl = await generateCompanyImage(
                tu.input.company_name as string,
                tu.input.industry as string,
                tu.input.style as string,
                openaiKey
              )
              if (imageUrl) {
                send({
                  type: 'card',
                  card: {
                    type: 'image',
                    data: {
                      url: imageUrl,
                      prompt: `${tu.input.company_name} company image`,
                      caption: `${tu.input.company_name} — AI generated`,
                    },
                  },
                })
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: tu.id,
                  content: JSON.stringify({ image_url: imageUrl, success: true }),
                })
              } else {
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: tu.id,
                  content: JSON.stringify({ success: false, reason: 'No OpenAI key configured or generation failed' }),
                })
              }
            } else {
              // Mock other tools (in production, these would call real APIs)
              const result = mockToolResult(tu.name, tu.input, profile || {})

              // Emit rich cards for certain tools
              if (tu.name === 'search_jobs') {
                const jobs = (result as { jobs: unknown[] }).jobs || []
                for (const job of jobs.slice(0, 3)) {
                  send({ type: 'card', card: { type: 'job', data: job } })
                }
              } else if (tu.name === 'improve_resume_bullet') {
                send({ type: 'card', card: { type: 'resume_bullet', data: result } })
              } else if (tu.name === 'calculate_match') {
                send({ type: 'card', card: { type: 'match_score', data: result } })
              } else if (tu.name === 'linkedin_review') {
                const r = result as { section: string; tips: Array<{ tip: string; priority: string }> }
                for (const tip of r.tips || []) {
                  send({
                    type: 'card',
                    card: {
                      type: 'linkedin_tip',
                      data: { section: r.section, tip: tip.tip, priority: tip.priority },
                    },
                  })
                }
              }

              toolResults.push({
                type: 'tool_result',
                tool_use_id: tu.id,
                content: JSON.stringify(result),
              })
            }
          }

          // Add tool results to messages for next iteration
          currentMessages = [
            ...currentMessages,
            { role: 'assistant', content: assistantContent } as Anthropic.MessageParam,
            { role: 'user', content: toolResults } as Anthropic.MessageParam,
          ]

          toolUses = []
          hasToolUse = false
          textBuffer = ''
        }

        send({ type: 'done' })
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        send({ type: 'error', message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

function getToolStatusText(toolName: string, input: Record<string, unknown>): string {
  switch (toolName) {
    case 'search_jobs':
      return `Searching for ${input.query || 'jobs'}${input.location ? ` in ${input.location}` : ''}...`
    case 'analyze_company':
      return `Researching ${input.company_name}...`
    case 'generate_company_image':
      return `Generating image for ${input.company_name}...`
    case 'improve_resume_bullet':
      return 'Rewriting resume bullet...'
    case 'linkedin_review':
      return `Analyzing your LinkedIn ${input.section}...`
    case 'calculate_match':
      return `Calculating match score for ${input.job_title}...`
    case 'web_search':
      return `Searching: ${input.query}...`
    default:
      return `Running ${toolName}...`
  }
}
