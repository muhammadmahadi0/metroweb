'use client'

import { ExternalLink, Youtube } from 'lucide-react'

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
    <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-m3-xl bg-surface-container-high shadow-m3-1">
        {/* Backdrop */}
        <div className="absolute inset-0">
          {channel.thumbnail ? (
            <img
              src={channel.thumbnail}
              alt=""
              className="h-full w-full scale-110 object-cover opacity-40 blur-2xl"
            />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-tertiary-container opacity-40" />

        {/* Content */}
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-m3-xl bg-surface-container-highest shadow-m3-2 sm:h-28 sm:w-28">
            {channel.thumbnail ? (
              <img
                src={channel.thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant">
                <Youtube className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="m3-chip mb-2">
              <Youtube className="h-3.5 w-3.5" />
              YouTube channel
            </span>
            <h1 className="truncate text-[28px] font-medium leading-9 tracking-tight text-on-surface">
              {channel.title}
            </h1>
            {channel.description && (
              <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-on-surface-variant">
                {channel.description}
              </p>
            )}
          </div>

          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="m3-btn m3-btn-tonal self-start sm:self-center"
          >
            <ExternalLink className="h-4 w-4" />
            Open on YouTube
          </a>
        </div>
      </div>
    </div>
  )
}
