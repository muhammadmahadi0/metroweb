import { NextRequest, NextResponse } from 'next/server'
import { getChannelPlaylists } from '@/lib/innertube'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const result = await getChannelPlaylists(id)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unable to load playlists', playlists: [] },
      { status: 502 }
    )
  }
}
