import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization' }, { status: 401 })
    }
    const accessToken = authHeader.replace('Bearer ', '')

    // Verify the token belongs to a real, currently-authenticated user before deleting anything.
    // This uses the anon key + the user's own access token -- it can only ever resolve to
    // the account that token belongs to, so there's no way to delete someone else's account.
    const verifyClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_3BnSyxM0zyXudw2OZXF3wA_I0cuODRG'
    )
    const { data: userData, error: verifyError } = await verifyClient.auth.getUser(accessToken)
    if (verifyError || !userData?.user) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
    }
    const userId = userData.user.id

    // Deleting an auth user requires the service role key -- this is the only correct,
    // secure way to permanently delete an account. The cards/profiles/goals/assets/
    // transactions/card_applications tables all reference auth.users(id) with
    // "on delete cascade", so this single call removes all of that user's data too.
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)
    if (deleteError) {
      console.error('Delete account error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account route error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
