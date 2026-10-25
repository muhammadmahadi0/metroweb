'use client'

import Link from 'next/link'
import type { FeedVideo } from '@/lib/feed'

export default function VideoListItem({
  video,
  compact = false,
}: {
  video: FeedVideo
  compact?: boolean
}) {
  return (
    <Link href={`/watch/${video.videoId}`} className="group flex gap-3 sm:gap-4">
      <div
        className={`relative aspect-video flex-shrink-0 overflow-hidden rounded-lg bg-yt-skeleton ${
          compact ? 'w-40' : 'w-40 sm:w-64'
        }`}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : null}
        {video.durationText ? (
          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium leading-4 text-white">
            {video.durationText}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <h3
          className={`line-clamp-2 font-medium leading-5 text-yt-text ${
            compact ? 'text-sm' : 'text-sm sm:text-base'
          }`}
        >
          {video.title}
        </h3>
        <p className="mt-1 truncate text-xs text-yt-secondary sm:text-[13px]">
          {[video.viewCountText, video.publishedText]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {video.channelThumbnail ? (
            <img
              src={video.channelThumbnail}
              alt=""
              className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yt-chip text-[10px] font-medium">
              {video.channelTitle.slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="truncate text-xs text-yt-secondary">
            {video.channelTitle}
          </span>
        </div>
      </div>
    </Link>
  )
}
