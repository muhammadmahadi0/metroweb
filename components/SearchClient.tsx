'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SearchX } from 'lucide-react'
import { useChannels } from '@/lib/useChannels'
import { useFeed } from '@/lib/useFeed'
import ChannelCard from '@/components/ChannelCard'
import VideoListItem from '@/components/VideoListItem'
import { SkeletonGrid } from '@/components/VideoGrid'

export default function SearchClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const { channels, ready } = useChannels()
  const { videos, loading } = useFeed(channels)
  const [input, setInput] = useState(query)
  const q = query.toLowerCase()

  const matchedChannels = useMemo(
    () =>
      channels.filter(
        (channel) =>
          channel.title.toLowerCase().includes(q) ||
          channel.description.toLowerCase().includes(q)
      ),
    [channels, q]
  )

  const matchedVideos = useMemo(
    () =>
      videos.filter(
        (video) =>
          video.title.toLowerCase().includes(q) ||
          video.channelTitle.toLowerCase().includes(q)
      ),
    [videos, q]
  )

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <Search className="h-16 w-16 text-yt-secondary" />
        <h1 className="mt-4 text-xl font-semibold text-yt-text">
          Search your channels
        </h1>
        <p className="mt-2 max-w-md text-sm text-yt-secondary">
          Find channels and videos from the channels you added.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const value = input.trim()
            if (value) router.push(`/search?q=${encodeURIComponent(value)}`)
          }}
          className="mt-6 flex w-full max-w-xl"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="yt-search-input"
            placeholder="Search your channels"
            autoFocus
          />
          <button type="submit" className="yt-search-btn" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
    )
  }

  if (!ready || (loading && channels.length > 0)) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <SkeletonGrid />
      </div>
    )
  }

  const hasResults = matchedChannels.length > 0 || matchedVideos.length > 0

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <SearchX className="h-16 w-16 text-yt-secondary" />
        <h1 className="mt-4 text-xl font-semibold text-yt-text">
          No results found
        </h1>
        <p className="mt-2 max-w-md text-sm text-yt-secondary">
          No channels or videos matched “{query}” in your added channels.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
      {matchedChannels.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-yt-text">Channels</h2>
          <div className="space-y-1">
            {matchedChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </section>
      ) : null}

      {matchedVideos.length > 0 ? (
        <section>
          <h2 className="mb-4 text-lg font-medium text-yt-text">Videos</h2>
          <div className="space-y-4">
            {matchedVideos.map((video) => (
              <VideoListItem key={video.videoId} video={video} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
