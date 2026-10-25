'use client'

import Link from 'next/link'
import type { Channel } from '@/lib/index'

export default function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <Link
      href={`/channel/${channel.id}`}
      className="flex flex-col items-center gap-4 rounded-xl p-4 hover:bg-yt-hover sm:flex-row"
    >
      {channel.thumbnail ? (
        <img
          src={channel.thumbnail}
          alt=""
          className="h-24 w-24 flex-shrink-0 rounded-full object-cover sm:h-32 sm:w-32"
        />
      ) : (
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-yt-chip text-2xl font-medium sm:h-32 sm:w-32">
          {channel.title.slice(0, 1).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h3 className="text-lg font-medium text-yt-text">{channel.title}</h3>
        <p className="text-sm text-yt-secondary">Channel</p>
        {channel.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-yt-secondary">
            {channel.description}
          </p>
        ) : null}
      </div>

      <span className="yt-btn yt-btn-tonal flex-shrink-0">View channel</span>
    </Link>
  )
}
