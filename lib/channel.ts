import { ResolvedChannel } from '@/lib/youtube'
import { Channel } from '@/lib/index'

export function channelFromResolved(resolved: ResolvedChannel): Channel {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    channelId: resolved.channelId,
    title: resolved.title,
    description: resolved.description,
    thumbnail: resolved.thumbnail,
    url: resolved.url,
    addedAt: new Date().toISOString(),
  }
}
