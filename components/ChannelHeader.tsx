'use client'

import type { Channel } from '@/lib/index'

export default function ChannelHeader({
  channel,
  videoCount,
  onRemove,
}: {
  channel: Channel
  videoCount: number
  onRemove: () => void
}) {
  return (
    <div>
      {/* Banner */}
      <div className="relative h-24 w-full overflow-hidden bg-yt-chip sm:h-40 lg:h-48">
        {channel.thumbnail ? (
          <img
            src={channel.thumbnail}
            alt=""
            className="h-full w-full scale-110 object-cover opacity-40 blur-2xl"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-yt-bg/40 via-transparent to-yt-bg/40" />
      </div>

      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          {channel.thumbnail ? (
            <img
              src={channel.thumbnail}
              alt=""
              className="-mt-10 h-20 w-20 flex-shrink-0 rounded-full border-4 border-yt-bg object-cover sm:-mt-14 sm:h-32 sm:w-32"
            />
          ) : (
            <div className="-mt-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-4 border-yt-bg bg-yt-chip text-2xl font-medium sm:-mt-14 sm:h-32 sm:w-32">
              {channel.title.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1 text-center sm:pt-2 sm:text-left">
            <h1 className="text-2xl font-bold text-yt-text sm:text-3xl">
              {channel.title}
            </h1>
            <p className="mt-1 text-sm text-yt-secondary">
              Channel · {videoCount} video{videoCount === 1 ? '' : 's'}
            </p>
            {channel.description ? (
              <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-yt-secondary">
                {channel.description}
              </p>
            ) : null}
          </div>

          <button
            onClick={onRemove}
            className="yt-btn yt-btn-tonal flex-shrink-0 sm:mt-2"
          >
            Remove channel
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-yt-border">
          <div className="flex gap-8">
            <span className="border-b-2 border-yt-text px-1 pb-3 text-sm font-medium text-yt-text">
              Videos
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
