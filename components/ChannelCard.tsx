'use client'

import Link from 'next/link'
import { formatRelativeDate } from '@/lib/index'
import { MoreHorizontal, Play, Clock } from 'lucide-react'

interface ChannelCardProps {
  channel: {
    id: string
    channelId: string
    title: string
    description: string
    thumbnail: string
    url: string
    videoCount?: number
    lastVideo?: { title: string; publishedAt: string }
  }
  onRemove?: (id: string) => void
}

export default function ChannelCard({
  channel,
  onRemove,
}: ChannelCardProps) {
  return (
    <Link
      href={`/channel/${channel.id}`}
      className="metro-card overflow-hidden group hover:border-blue-400/60 transition-colors duration-200 aspect-video"
    >
      <div className="relative h-40 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
        <img
          src={channel.thumbnail}
          alt=""
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
          <div className="flex items-end justify-between gap-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                onRemove?.(channel.id)
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Remove channel"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <img
              src={channel.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              {channel.title}
            </h3>
            {channel.lastVideo && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {channel.lastVideo.title}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {channel.lastVideo
                ? formatRelativeDate(channel.lastVideo.publishedAt)
                : '--'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
