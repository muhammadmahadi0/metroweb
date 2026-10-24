import { NextRequest, NextResponse } from 'next/server'

interface Video {
  videoId: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  channelId: string
  watchUrl: string
}

export const dynamic = 'force-dynamic'

function apiKey(): string | undefined {
  return process.env.YOUTUBE_DATA_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
}

async function fetchJson(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${qs}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  } as any)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`YouTube API ${res.status}: ${text}`)
  }
  return res.json()
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const channelId = searchParams.get('channelId') || id

  const key = apiKey()
  if (!key) {
    return NextResponse.json(
      {
        error:
          'YouTube Data API key not configured. Set YOUTUBE_DATA_API_KEY in .env.local to load channel videos.',
        videos: [],
      },
      { status: 200 }
    )
  }

  try {
    // 1. Get the channel's uploads playlist ID
    const channelData = await fetchJson('channels', {
      part: 'contentDetails',
      id: channelId,
      key,
    })
    const item = channelData.items?.[0]
    if (!item) {
      return NextResponse.json({ error: 'Channel not found', videos: [] }, { status: 404 })
    }
    const uploadsPlaylistId =
      item.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) {
      return NextResponse.json({ videos: [] })
    }

    // 2. Get uploads playlist items
    const playlistData = await fetchJson('playlistItems', {
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: '30',
      key,
    })

    const videos: Video[] = (playlistData.items || []).map((it: any) => {
      const sn = it.snippet
      const videoId = sn.resourceId?.videoId
      const thumbnails = sn.thumbnails || {}
      const thumbnail =
        thumbnails.maxres?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        thumbnails.default?.url ||
        ''
      return {
        videoId,
        title: sn.title || 'Untitled',
        description: sn.description || '',
        thumbnail,
        channelTitle: sn.channelTitle || '',
        publishedAt: sn.publishedAt || '',
        channelId: sn.channelId || channelId,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      }
    })

    return NextResponse.json({ videos })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to load videos', videos: [] },
      { status: 500 }
    )
  }
}
