'use client'

import Link from 'next/link'
import type { FeedVideo } from '@/lib/feed'

export default function VideoCard({ video }: { video: FeedVideo }) {
  return (
    <Link href={`/watch/${video.videoId}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-yt-skeleton">
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

      <div className="mt-3 flex gap-3 pr-2">
        {video.channelThumbnail ? (
          <img
            src={video.channelThumbnail}
            alt=""
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-yt-chip text-xs font-medium">
            {video.channelTitle.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-5 text-yt-text">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-[13px] text-yt-secondary">
            {video.channelTitle}
          </p>
          <p className="truncate text-[13px] text-yt-secondary">
            {[video.viewCountText, video.publishedText]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </div>
    </Link>
  )
}
