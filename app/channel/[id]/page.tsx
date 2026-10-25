'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, SearchX, ExternalLink } from 'lucide-react'
import { getChannels, Channel } from '@/lib/index'
import ChannelHeader from '@/components/ChannelHeader'
import VideoGrid from '@/components/VideoGrid'
import ThemeToggle from '@/components/ThemeToggle'

interface Video {
  videoId: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  publishedText?: string
  viewCountText?: string
  channelId: string
  watchUrl: string
}

export default function ChannelPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [channel, setChannel] = useState<Channel | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    const channels = getChannels()
    const found = channels.find((c) => c.id === id)
    if (!found) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setChannel(found)
    setLoading(false)

    try {
      const res = await fetch(
        `/api/channel/${encodeURIComponent(found.channelId)}/videos?channelId=${encodeURIComponent(found.channelId)}`
      )
      const json = await res.json()
      if (json.error) setApiError(json.error)
      setVideos(json.videos || [])
    } catch {
      setApiError('Unable to load videos at this time.')
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-m3-spin text-primary" />
      </div>
    )
  }

  if (notFound || !channel) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-m3-full bg-surface-container-high text-on-surface-variant">
          <SearchX className="h-11 w-11" />
        </div>
        <h1 className="text-2xl font-normal text-on-surface">
          Channel not found
        </h1>
        <p className="max-w-sm text-sm text-on-surface-variant">
          This channel isn&apos;t in your list. It may have been removed.
        </p>
        <Link href="/" className="m3-btn m3-btn-filled mt-2">
          Back to channels
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* M3 top app bar */}
      <header className="sticky top-0 z-20 bg-surface backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="m3-icon-btn"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="max-w-[45vw] truncate text-base font-medium">
              {channel.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="m3-chip hidden sm:inline-flex">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </span>
            <ThemeToggle />
          </div>
        </div>
        <div className="m3-divider" />
      </header>

      <ChannelHeader channel={channel} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {apiError && (
          <div className="mb-6 rounded-m3-lg bg-error-container px-5 py-4 text-on-error-container">
            <p className="text-sm">{apiError}</p>
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline"
            >
              Open this channel on YouTube
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium text-on-surface">Latest videos</h2>
        </div>
        <VideoGrid videos={videos} />
      </main>
    </div>
  )
}
