'use client'

import { useState } from 'react'
import { useChannels } from '@/lib/useChannels'
import { useFeed } from '@/lib/useFeed'
import VideoGrid from '@/components/VideoGrid'
import EmptyState from '@/components/EmptyState'

export default function HomePage() {
  const { channels, ready } = useChannels()
  const { videos, loading } = useFeed(channels)
  const [activeChannel, setActiveChannel] = useState('all')

  const filtered =
    activeChannel === 'all'
      ? videos
      : videos.filter((video) => video.channelLocalId === activeChannel)

  if (!ready) {
    return (
      <div className="px-4 py-4 sm:px-6">
        <VideoGrid videos={[]} loading />
      </div>
    )
  }

  if (channels.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="no-scrollbar mb-5 flex gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveChannel('all')}
          className={`yt-chip ${activeChannel === 'all' ? 'yt-chip-active' : ''}`}
        >
          All
        </button>
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={`yt-chip ${
              activeChannel === channel.id ? 'yt-chip-active' : ''
            }`}
          >
            {channel.title}
          </button>
        ))}
      </div>

      <VideoGrid videos={filtered} loading={loading} />
    </div>
  )
}
