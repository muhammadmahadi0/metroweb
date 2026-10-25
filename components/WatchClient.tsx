'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Headphones, Loader2, Play, Share2, Video } from 'lucide-react'
import { useChannels } from '@/lib/useChannels'
import { useFeed } from '@/lib/useFeed'
import { usePlaylist } from '@/lib/usePlaylists'
import VideoListItem from '@/components/VideoListItem'

type PlayMode = 'audio' | 'video'

const PLAY_MODE_KEY = 'metrolist-play-mode'

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
  audioUrl: string | null
  audioQuality?: string | null
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

export default function WatchClient() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params?.id
  const listId = searchParams.get('list') || undefined

  const { channels } = useChannels()
  const { videos: feed } = useFeed(channels)
  const { data: playlist } = usePlaylist(listId)

  const [data, setData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useEmbed, setUseEmbed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<PlayMode>('audio')

  const mediaRef = useRef<HTMLMediaElement | null>(null)
  const timeRef = useRef(0)
  const wasPlayingRef = useRef(false)
  const pendingRestoreRef = useRef(false)

  // Restore the saved play mode. Audio is the default for new visitors.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAY_MODE_KEY)
      if (saved === 'audio' || saved === 'video') setMode(saved)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!id) return
    let cancelled = false

    setLoading(true)
    setError(null)
    setUseEmbed(false)
    pendingRestoreRef.current = false
    timeRef.current = 0

    async function load() {
      try {
        const res = await fetch(`/api/video/${id}`)
        const json = (await res.json()) as VideoData
        if (cancelled) return
        setData(json)
        if (!res.ok || (!json.streamUrl && !json.audioUrl)) {
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

  function switchMode(next: PlayMode) {
    if (next === mode) return

    const media = mediaRef.current
    if (media) {
      timeRef.current = media.currentTime || 0
      wasPlayingRef.current = !media.paused && !media.ended
      pendingRestoreRef.current = true
    }

    setMode(next)
    try {
      localStorage.setItem(PLAY_MODE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  function handleLoadedMetadata(event: React.SyntheticEvent<HTMLMediaElement>) {
    if (!pendingRestoreRef.current) return
    pendingRestoreRef.current = false

    const media = event.currentTarget
    if (timeRef.current > 0) {
      try {
        media.currentTime = Math.min(
          timeRef.current,
          Math.max(0, (media.duration || 0) - 0.25)
        )
      } catch {
        /* ignore seek errors */
      }
    }

    if (wasPlayingRef.current) {
      media.play().catch(() => {})
    } else {
      media.pause()
    }
  }

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
  const audioSrc = data?.audioUrl || data?.streamUrl || null

  const playlistIndex = playlist
    ? playlist.videos.findIndex((video) => video.videoId === id)
    : -1
  const nextVideo =
    playlist && playlistIndex >= 0
      ? playlist.videos[playlistIndex + 1]
      : undefined

  function playNext() {
    if (playlist && nextVideo) {
      router.push(`/watch/${nextVideo.videoId}?list=${playlist.playlistId}`)
    }
  }

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
          ) : mode === 'audio' && audioSrc ? (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
              {data?.thumbnail ? (
                <img
                  src={data.thumbnail}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
                />
              ) : null}
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative flex w-full max-w-md flex-col items-center px-4">
                {data?.thumbnail ? (
                  <img
                    src={data.thumbnail}
                    alt=""
                    className="h-20 w-20 rounded-lg object-cover shadow-xl sm:h-28 sm:w-28"
                  />
                ) : null}
                <p className="mt-2 line-clamp-1 text-center text-sm font-medium text-white sm:mt-3 sm:line-clamp-2">
                  {data?.title || 'YouTube video'}
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  {data?.author || ''}
                </p>
                <audio
                  key={audioSrc}
                  ref={(element) => {
                    mediaRef.current = element
                  }}
                  src={audioSrc}
                  controls
                  autoPlay
                  preload="metadata"
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={playNext}
                  onError={() => setUseEmbed(true)}
                  className="mt-2 w-full sm:mt-3"
                />
              </div>
            </div>
          ) : mode === 'video' && data?.streamUrl ? (
            <video
              key={data.streamUrl}
              ref={(element) => {
                mediaRef.current = element
              }}
              className="h-full w-full bg-black"
              src={data.streamUrl}
              poster={data.thumbnail}
              controls
              autoPlay
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={playNext}
              onError={() => setUseEmbed(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/80">
              <Play className="h-10 w-10" />
              <p className="text-sm">
                {mode === 'video' ? 'Video unavailable' : 'Audio unavailable'}
              </p>
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
            {playlist ? (
              <>
                <span>·</span>
                <Link
                  href={`/playlist/${playlist.playlistId}`}
                  className="hover:text-yt-text"
                >
                  {playlist.title}
                </Link>
              </>
            ) : null}
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

            <div className="flex items-center gap-2">
              {!useEmbed ? (
                <div className="flex items-center rounded-full bg-yt-chip p-0.5">
                  <button
                    onClick={() => switchMode('audio')}
                    aria-pressed={mode === 'audio'}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      mode === 'audio'
                        ? 'bg-yt-text text-yt-bg'
                        : 'text-yt-secondary hover:text-yt-text'
                    }`}
                  >
                    <Headphones className="h-3.5 w-3.5" />
                    Audio
                  </button>
                  <button
                    onClick={() => switchMode('video')}
                    aria-pressed={mode === 'video'}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      mode === 'video'
                        ? 'bg-yt-text text-yt-bg'
                        : 'text-yt-secondary hover:text-yt-text'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    Video
                  </button>
                </div>
              ) : null}

              <button onClick={share} className="yt-btn yt-btn-tonal">
                <Share2 className="h-4 w-4" />
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
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
              {mode === 'audio' ? 'Audio only' : data.quality || 'Video'} ·{' '}
              {formatDuration(data.durationSeconds)}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="w-full flex-shrink-0 pb-6 lg:w-[402px] lg:pb-0">
        {playlist ? (
          <div className="px-4 lg:px-0">
            <div className="rounded-xl border border-yt-border">
              <div className="border-b border-yt-border p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-yt-secondary">
                  Playlist
                </p>
                <h2 className="mt-1 line-clamp-2 text-base font-semibold text-yt-text">
                  {playlist.title}
                </h2>
                <p className="mt-1 text-xs text-yt-secondary">
                  {[playlist.channelTitle, playlist.videoCountText]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

              <div className="max-h-[520px] overflow-y-auto p-2">
                {playlist.videos.map((video, index) => {
                  const active = video.videoId === id
                  return (
                    <Link
                      key={video.videoId}
                      href={`/watch/${video.videoId}?list=${playlist.playlistId}`}
                      className={`flex gap-2 rounded-lg p-2 hover:bg-yt-hover ${
                        active ? 'bg-yt-hover' : ''
                      }`}
                    >
                      <span className="w-4 flex-shrink-0 pt-1 text-center text-[11px] text-yt-secondary">
                        {index + 1}
                      </span>
                      <div className="relative aspect-video w-24 flex-shrink-0 overflow-hidden rounded bg-yt-skeleton">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                        {video.durationText ? (
                          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 text-[9px] font-medium text-white">
                            {video.durationText}
                          </span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs font-medium text-yt-text">
                          {video.title}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-yt-secondary">
                          {active
                            ? 'Now playing'
                            : video.channelTitle || playlist.channelTitle}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </aside>
    </div>
  )
}
