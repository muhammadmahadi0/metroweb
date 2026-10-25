'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Play, Share2 } from 'lucide-react'
import { useChannels } from '@/lib/useChannels'
import { useFeed } from '@/lib/useFeed'
import VideoListItem from '@/components/VideoListItem'

interface VideoData {
  videoId: string
  title: string
  author: string
  channelId: string
  thumbnail: string
  durationSeconds: number
  viewCount?: number
  publishDate?: string
  description: string
  quality: string | null
  streamUrl: string | null
  embedUrl: string
  watchUrl: string
  error?: string
}

function formatCount(value?: number): string {
  if (!value) return ''
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value)
}

function formatDate(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${minutes}:${String(secs).padStart(2, '0')}`
}

export default function WatchPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const { channels } = useChannels()
  const { videos: feed } = useFeed(channels)

  const [data, setData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useEmbed, setUseEmbed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/api/video/${id}`)
        const json = (await res.json()) as VideoData
        if (cancelled) return
        setData(json)
        if (!res.ok || !json.streamUrl) {
          setError(json.error || 'InnerTube stream unavailable')
          setUseEmbed(true)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to reach the video service')
          setUseEmbed(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const upNext = feed.filter((video) => video.videoId !== id).slice(0, 12)
  const channelThumbnail = channels.find(
    (channel) => channel.channelId === data?.channelId
  )?.thumbnail

  const views = data?.viewCount ? `${formatCount(data.viewCount)} views` : ''
  const date = formatDate(data?.publishDate)

  return (
    <div className="mx-auto flex max-w-[1750px] flex-col gap-6 lg:flex-row lg:px-6 lg:py-6">
      <div className="min-w-0 flex-1">
        <div className="relative aspect-video w-full overflow-hidden bg-black lg:rounded-xl">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-9 w-9 animate-spin text-white/80" />
            </div>
          ) : useEmbed ? (
            <iframe
              key={id}
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              title={data?.title || 'YouTube video'}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : data?.streamUrl ? (
            <video
              key={data.streamUrl}
              className="h-full w-full bg-black"
              src={data.streamUrl}
              poster={data.thumbnail}
              controls
              autoPlay
              playsInline
              onError={() => setUseEmbed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/80">
              <Play className="h-10 w-10" />
              <p className="text-sm">Video unavailable</p>
            </div>
          )}
        </div>

        <div className="px-4 pt-3 lg:px-0">
          <h1 className="text-lg font-semibold leading-6 text-yt-text sm:text-xl">
            {data?.title || 'YouTube video'}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-yt-secondary">
            {views ? <span>{views}</span> : null}
            {views && date ? <span>·</span> : null}
            {date ? <span>{date}</span> : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {channelThumbnail ? (
                <img
                  src={channelThumbnail}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yt-chip text-sm font-medium">
                  {(data?.author || '?').slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-yt-text">
                  {data?.author || 'Unknown channel'}
                </p>
                <p className="text-xs text-yt-secondary">Channel</p>
              </div>
            </div>

            <button onClick={share} className="yt-btn yt-btn-tonal">
              <Share2 className="h-4 w-4" />
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>

          {error && useEmbed ? (
            <div className="mt-4 rounded-xl bg-yt-chip p-3 text-sm text-yt-secondary">
              InnerTube stream unavailable — playing with the YouTube embed
              player instead.
            </div>
          ) : null}

          {data?.description ? (
            <div className="mt-4 rounded-xl bg-yt-chip p-3">
              <p className="text-sm font-medium text-yt-text">
                {[views, date].filter(Boolean).join(' · ')}
              </p>
              <p
                className={`mt-1 whitespace-pre-line text-sm text-yt-text ${
                  expanded ? '' : 'line-clamp-3'
                }`}
              >
                {data.description}
              </p>
              {data.description.length > 300 ? (
                <button
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-1 text-sm font-medium text-yt-text hover:underline"
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              ) : null}
            </div>
          ) : null}

          {data?.durationSeconds ? (
            <p className="mt-3 text-xs text-yt-secondary">
              Duration {formatDuration(data.durationSeconds)}
              {data.quality ? ` · ${data.quality}` : ''}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="w-full flex-shrink-0 pb-6 lg:w-[402px] lg:pb-0">
        <h2 className="px-4 pb-3 text-base font-medium text-yt-text lg:px-0">
          Up next
        </h2>
        <div className="space-y-3 px-4 lg:px-0">
          {upNext.map((video) => (
            <VideoListItem key={video.videoId} video={video} compact />
          ))}
          {upNext.length === 0 && !loading ? (
            <p className="text-sm text-yt-secondary">
              Add more channels to see recommendations here.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
