import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Rate limit: 3 password reset attempts per email per 15 minutes
const resetAttempts = new Map<string, { count: number; resetAt: number }>()

function checkResetLimit(email: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const entry = resetAttempts.get(email)
  if (!entry || now > entry.resetAt) {
    resetAttempts.set(email, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    if (!checkResetLimit(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Too many reset attempts. Please wait 15 minutes.' },
        { status: 429 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}