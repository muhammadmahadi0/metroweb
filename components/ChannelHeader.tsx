'use client'

import Image from 'next/image'

interface ChannelHeaderProps {
  channel: {
    title: string
    description: string
    thumbnail: string
    url: string
  }
}

export default function ChannelHeader({ channel }: ChannelHeaderProps) {
  return (
    <div className="relative h-64 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={channel.thumbnail}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
          {channel.title}
        </h1>
        {channel.description && (
          <p className="mt-1 text-sm text-gray-200 drop-shadow-md line-clamp-2 max-w-2xl">
            {channel.description}
          </p>
        )}
      </div>
      <a
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur border border-white/20 text-white text-sm hover:bg-black/60 transition-colors"
      >
        View on YouTube
      </a>
    </div>
  )
}
