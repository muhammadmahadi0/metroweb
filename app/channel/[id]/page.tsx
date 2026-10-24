'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { getChannels, Channel } from '@/lib/index'
import ChannelHeader from '@/components/ChannelHeader'
import VideoGrid from '@/components/VideoGrid'

interface Video {
  videoId: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (notFound || !channel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Channel not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          This channel isn&apos;t in your list. It may have been removed.
        </p>
        <Link href="/" className="metro-btn-primary">
          Back to channels
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="metro-btn-ghost"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      <ChannelHeader channel={channel} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiError && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 mb-6">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {apiError}
            </p>
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
            >
              Open this channel on YouTube instead →
            </a>
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Latest Videos
        </h2>
        <VideoGrid videos={videos} />
      </div>
    </div>
  )
}
