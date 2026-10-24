'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, ExternalLink, AlertTriangle, Play } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

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

function formatCount(n?: number): string {
  if (!n) return ''
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(n)
}

function formatDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export default function WatchPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const [data, setData] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useEmbed, setUseEmbed] = useState(false)
  const [expanded, setExpanded] = useState(false)

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

  const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-20 bg-surface backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => router.back()}
              className="m3-icon-btn"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="truncate text-base font-medium">Now playing</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="m3-divider" />
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-m3-lg bg-black shadow-m3-2">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-9 w-9 animate-m3-spin text-white/80" />
            </div>
          ) : useEmbed ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
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

        {error && useEmbed && (
          <div className="mt-4 flex items-start gap-3 rounded-m3-md bg-surface-container-high px-4 py-3 text-sm text-on-surface-variant">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-tertiary" />
            <p>
              InnerTube stream unavailable — playing with the YouTube embed
              player instead.
            </p>
          </div>
        )}

        {/* Info */}
        <section className="mt-6">
          {loading ? (
            <div className="space-y-3">
              <div className="h-7 w-3/4 animate-pulse rounded-m3-sm bg-surface-container-high" />
              <div className="h-4 w-1/3 animate-pulse rounded-m3-sm bg-surface-container-high" />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-medium leading-7 text-on-surface sm:text-2xl sm:leading-8">
                {data?.title || 'YouTube video'}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                {data?.author && (
                  <span className="font-medium text-on-surface">
                    {data.author}
                  </span>
                )}
                {data?.viewCount ? (
                  <span>· {formatCount(data.viewCount)} views</span>
                ) : null}
                {data?.publishDate ? (
                  <span>· {formatDate(data.publishDate)}</span>
                ) : null}
                {data?.durationSeconds ? (
                  <span>· {formatDuration(data.durationSeconds)}</span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {data?.quality && (
                  <span className="m3-chip">{data.quality}</span>
                )}
                <span className="m3-chip">InnerTube</span>
                <a
                  href={`https://www.youtube.com/watch?v=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-btn m3-btn-text -ml-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open on YouTube
                </a>
              </div>

              {data?.description && (
                <div className="mt-5 rounded-m3-lg bg-surface-container-low p-5">
                  <p
                    className={`whitespace-pre-line text-sm leading-6 text-on-surface-variant ${
                      expanded ? '' : 'line-clamp-4'
                    }`}
                  >
                    {data.description}
                  </p>
                  {data.description.length > 320 && (
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      className="mt-2 text-sm font-medium text-primary hover:underline"
                    >
                      {expanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}
