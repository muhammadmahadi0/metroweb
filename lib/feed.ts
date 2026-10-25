import type { Channel } from '@/lib/index'

export interface FeedVideo {
  videoId: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  channelId: string
  publishedAt: string
  publishedText: string
  viewCountText: string
  durationText?: string
  watchUrl: string
  channelThumbnail?: string
  channelLocalId?: string
}

/** Approximate a relative YouTube date ("3 months ago") as a timestamp. */
export function parseRelativeDate(text?: string): number {
  if (!text) return 0
  const match = text
    .toLowerCase()
    .match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s+ago/)
  if (!match) return 0
  const amount = Number(match[1])
  const seconds: Record<string, number> = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2592000,
    year: 31536000,
  }
  return Date.now() - amount * (seconds[match[2]] || 0) * 1000
}

const cache = new Map<string, { videos: FeedVideo[]; ts: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000

export async function fetchChannelVideos(channel: Channel): Promise<FeedVideo[]> {
  const cached = cache.get(channel.channelId)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.videos
  }

  const res = await fetch(
    `/api/channel/${encodeURIComponent(channel.channelId)}/videos?channelId=${encodeURIComponent(channel.channelId)}`
  )
  const json = await res.json()

  const videos: FeedVideo[] = (json.videos || []).map((video: any) => ({
    videoId: video.videoId,
    title: video.title || 'Untitled',
    description: video.description || '',
    thumbnail: video.thumbnail || '',
    channelTitle: video.channelTitle || channel.title,
    channelId: video.channelId || channel.channelId,
    publishedAt: video.publishedAt || '',
    publishedText: video.publishedText || '',
    viewCountText: video.viewCountText || '',
    durationText: video.durationText || '',
    watchUrl: video.watchUrl || `https://www.youtube.com/watch?v=${video.videoId}`,
    channelThumbnail: channel.thumbnail,
    channelLocalId: channel.id,
  }))

  cache.set(channel.channelId, { videos, ts: Date.now() })
  return videos
}

export async function fetchFeed(channels: Channel[]): Promise<FeedVideo[]> {
  const lists = await Promise.all(
    channels.map((channel) => fetchChannelVideos(channel).catch(() => []))
  )

  const seen = new Set<string>()
  const videos: FeedVideo[] = []
  for (const video of lists.flat()) {
    if (seen.has(video.videoId)) continue
    seen.add(video.videoId)
    videos.push(video)
  }

  videos.sort(
    (a, b) => parseRelativeDate(b.publishedText) - parseRelativeDate(a.publishedText)
  )
  return videos
}

export function clearFeedCache() {
  cache.clear()
}
