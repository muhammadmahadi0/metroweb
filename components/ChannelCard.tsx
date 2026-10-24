'use client'

import Link from 'next/link'
import { formatRelativeDate } from '@/lib/index'
import { Trash2, Play } from 'lucide-react'

interface ChannelCardProps {
  channel: {
    id: string
    channelId: string
    title: string
    description: string
    thumbnail: string
    url: string
    addedAt: string
    videoCount?: number
    lastVideo?: { title: string; publishedAt: string }
  }
  onRemove?: (id: string) => void
}

export default function ChannelCard({ channel, onRemove }: ChannelCardProps) {
  return (
    <Link
      href={`/channel/${channel.id}`}
      className="m3-card group block overflow-hidden"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-container-high">
        {channel.thumbnail ? (
          <img
            src={channel.thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
            <Play className="h-8 w-8" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove?.(channel.id)
          }}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-m3-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-error hover:text-on-error"
          aria-label={`Remove ${channel.title}`}
          title="Remove channel"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-start gap-3 p-4">
        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-m3-full bg-surface-container-high">
          {channel.thumbnail ? (
            <img
              src={channel.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium leading-6 text-on-surface">
            {channel.title}
          </h3>
          {channel.lastVideo ? (
            <>
              <p className="mt-0.5 truncate text-[13px] text-on-surface-variant">
                {channel.lastVideo.title}
              </p>
              <p className="mt-1 text-[11px] text-on-surface-variant">
                {formatRelativeDate(channel.lastVideo.publishedAt)}
              </p>
            </>
          ) : (
            <p className="mt-0.5 truncate text-[13px] text-on-surface-variant">
              Added {formatRelativeDate(channel.addedAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
