import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiter: max 20 requests per user per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Separate, tighter limit on web-search-triggered requests (search costs more)
const searchRateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 20

  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  entry.count++
  return { allowed: true }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
  for (const [key, val] of searchRateLimitMap.entries()) {
    if (now > val.resetAt) searchRateLimitMap.delete(key)
  }
}, 5 * 60 * 1000)

const LIVE_DATA_INSTRUCTIONS = `

LIVE DATA RULE: Credit card APRs, sign-up bonuses, annual fees, and transfer ratios change throughout the year. Whenever the user asks about any of these for a SPECIFIC card -- the current bonus offer, the current APR, whether a fee changed, current transfer ratios, or "is this still accurate" -- use the web_search tool to look up the current, real information before answering. Don't rely on your training data or the static numbers from the app for these questions, since they may be outdated. After searching, clearly state what you found and approximately how recent your source is. If you search and still aren't sure, say so honestly rather than guessing. Do not search for general advice questions that don't need current data (e.g. "should I pay off debt or save" doesn't need a search).`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              || req.headers.get('x-real-ip')
              || 'anonymous'

    const { allowed, retryAfter } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${retryAfter} seconds before trying again.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const body = await req.json()
    const { messages, systemPrompt } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request: messages array required' }, { status: 400 })
    }

    const cappedMessages = messages.slice(-20)

    const fullSystemPrompt = (systemPrompt || 'You are WiseCard, an AI financial advisor specializing in credit card optimization.') + LIVE_DATA_INSTRUCTIONS

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1536,
        system: fullSystemPrompt,
        messages: cappedMessages,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 3, // cap searches per request to control cost/latency
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'AI service temporarily unavailable' },
        { status: response.status }
      )
    }

    // Response content can have multiple blocks: text, server_tool_use (the search call),
    // and web_search_tool_result (the raw results). We only want to display the text blocks.
    const usedSearch = Array.isArray(data.content) && data.content.some((b: any) => b.type === 'server_tool_use' && b.name === 'web_search')
    const text = Array.isArray(data.content)
      ? data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n\n')
      : ''

    return NextResponse.json({
      text: text || 'Sorry, I could not generate a response.',
      usedSearch,
    })

  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
