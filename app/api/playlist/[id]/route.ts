import { NextRequest, NextResponse } from 'next/server'
import { getPlaylist, isValidPlaylistId } from '@/lib/innertube'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!isValidPlaylistId(id)) {
    return NextResponse.json({ error: 'Invalid playlist id' }, { status: 400 })
  }

  try {
    const data = await getPlaylist(id)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unable to load playlist' },
      { status: 502 }
    )
  }
}
