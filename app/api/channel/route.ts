import { NextRequest, NextResponse } from 'next/server'
import { resolveChannel } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing ?url=' }, { status: 400 })
  }

  try {
    const resolved = await resolveChannel(url)
    return NextResponse.json(resolved)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to resolve channel' },
      { status: 400 }
    )
  }
}
