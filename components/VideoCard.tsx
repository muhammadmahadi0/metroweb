'use client'

import Link from 'next/link'
import { formatRelativeDate } from '@/lib/index'
import { Play, Clock, Eye } from 'lucide-react'

interface VideoCardProps {
  video: {
    videoId: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    channelId: string
    watchUrl: string
  }
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      href={video.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer"
    >
      <div className="flex-shrink-0 w-48 h-27 rounded-xl bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
        <img
          src={video.thumbnail}
          alt=""
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          <Play className="w-3 h-3 mr-1" />
        </div>
      </div>
      <div className="min-w-0 flex-1 leading-snug">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {video.channelTitle}
        </p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeDate(video.publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
