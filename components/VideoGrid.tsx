'use client'

interface VideoGridProps {
  videos: Array<{
    videoId: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    channelId: string
    watchUrl: string
  }>
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No videos found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.videoId}>
          <VideoGridItem video={video} />
        </div>
      ))}
    </div>
  )
}

function VideoGridItem({ video }: { video: VideoGridProps['videos'][number] }) {
  return (
    <a
      href={video.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-400/60 hover:shadow-lg transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-44 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src={video.thumbnail}
          alt=""
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-lg">
          ▶
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1.5 leading-snug">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
          {video.channelTitle}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            {formatRelative(video.publishedAt)}
          </span>
        </div>
      </div>
    </a>
  )
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
