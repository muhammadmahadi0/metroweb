'use client'

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
      {channel.thumbnail && (
        <img
          src={channel.thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 w-full flex items-end gap-4">
        {channel.thumbnail && (
          <img
            src={channel.thumbnail}
            alt=""
            className="h-20 w-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg truncate">
            {channel.title}
          </h1>
          {channel.description && (
            <p className="mt-1 text-sm text-gray-200 drop-shadow-md line-clamp-2 max-w-2xl">
              {channel.description}
            </p>
          )}
        </div>
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
