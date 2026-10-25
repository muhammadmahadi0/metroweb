export interface Channel {
  id: string
  channelId: string
  title: string
  description: string
  thumbnail: string
  url: string
  addedAt: string
}

export interface Video {
  videoId: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  publishedText?: string
  viewCountText?: string
  durationText?: string
  channelId: string
  watchUrl: string
}

export interface ResolvedChannel {
  channelId: string
  title: string
  description: string
  thumbnail: string
  url: string
}

export const STORAGE_KEY = 'metrolist_channels'
export const CHANNELS_EVENT = 'metrolist:channels'

export function getChannels(): Channel[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveChannels(channels: Channel[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels))
    window.dispatchEvent(new Event(CHANNELS_EVENT))
  } catch {
    // ignore quota errors
  }
}

export function addChannel(channel: Channel): Channel[] {
  const channels = getChannels()
  const next = [channel, ...channels.filter((c) => c.channelId !== channel.channelId)]
  saveChannels(next)
  return next
}

export function removeChannel(id: string): Channel[] {
  const channels = getChannels().filter((c) => c.id !== id)
  saveChannels(channels)
  return channels
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatRelativeDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(days / 365)}y ago`
}
