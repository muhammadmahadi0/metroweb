'use client'

import { Play } from 'lucide-react'

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

interface VideoGridProps {
  videos: Video[]
}

function formatRelative(iso: string): string {
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

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="rounded-m3-lg bg-surface-container-low px-6 py-12 text-center">
        <p className="text-sm text-on-surface-variant">No videos found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <a
          key={video.videoId}
          href={video.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="m3-card group block overflow-hidden"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high">
            <img
              src={video.thumbnail}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/25">
              <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-m3-full bg-black/60 text-white opacity-0 backdrop-blur transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-on-surface">
              {video.title}
            </h3>
            <p className="mt-1.5 truncate text-[13px] text-on-surface-variant">
              {video.channelTitle}
            </p>
            <p className="mt-0.5 text-[11px] text-on-surface-variant">
              {formatRelative(video.publishedAt)}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
