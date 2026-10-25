'use client'

import VideoCard from '@/components/VideoCard'
import type { FeedVideo } from '@/lib/feed'

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-video w-full animate-pulse rounded-xl bg-yt-skeleton" />
          <div className="mt-3 flex gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-yt-skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-11/12 animate-pulse rounded bg-yt-skeleton" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-yt-skeleton" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-yt-skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function VideoGrid({
  videos,
  loading = false,
}: {
  videos: FeedVideo[]
  loading?: boolean
}) {
  if (loading) {
    return <SkeletonGrid />
  }

  if (videos.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-yt-secondary">
        No videos found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  )
}
