import { NextRequest, NextResponse } from 'next/server'
import { getPlayerData, isValidVideoId } from '@/lib/innertube'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!isValidVideoId(id)) {
    return NextResponse.json({ error: 'Invalid video id' }, { status: 400 })
  }

  try {
    const data = await getPlayerData(id)
    const videoItag = data.bestProgressive?.itag
    const audioItag = data.bestAudio?.itag

    return NextResponse.json({
      videoId: data.videoId,
      title: data.title,
      author: data.author,
      channelId: data.channelId,
      thumbnail: data.thumbnail,
      durationSeconds: data.durationSeconds,
      viewCount: data.viewCount,
      publishDate: data.publishDate,
      description: data.description,
      quality: data.bestProgressive?.qualityLabel || null,
      itag: videoItag ?? null,
      streamUrl: videoItag ? `/api/video/${id}/stream?itag=${videoItag}` : null,
      audioItag: audioItag ?? null,
      audioUrl: audioItag ? `/api/video/${id}/stream?itag=${audioItag}` : null,
      audioQuality: data.bestAudio?.audioQuality || null,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || 'Unable to load this video',
        streamUrl: null,
        audioUrl: null,
        embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
      },
      { status: 502 }
    )
  }
}
