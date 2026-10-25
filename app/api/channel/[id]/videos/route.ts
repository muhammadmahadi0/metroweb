import { NextRequest, NextResponse } from 'next/server'
import { getChannelVideos } from '@/lib/innertube'

export const dynamic = 'force-dynamic'

/**
 * Channel uploads, fetched through YouTube's InnerTube `browse` endpoint.
 * No API key required.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get('channelId') || id

  try {
    const { videos, channelTitle } = await getChannelVideos(channelId, 30)
    return NextResponse.json({ videos, channelTitle })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || 'Failed to load channel videos',
        videos: [],
      },
      { status: 502 }
    )
  }
}
