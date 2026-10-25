'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ListVideo, Loader2, Play } from 'lucide-react'
import { usePlaylist } from '@/lib/usePlaylists'

export default function PlaylistPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data, loading, error } = usePlaylist(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-yt-secondary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <ListVideo className="h-14 w-14 text-yt-secondary" />
        <h1 className="mt-4 text-xl font-semibold text-yt-text">
          Playlist unavailable
        </h1>
        <p className="mt-2 max-w-md text-sm text-yt-secondary">
          {error || 'This playlist could not be loaded.'}
        </p>
      </div>
    )
  }

  const firstVideo = data.videos[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-yt-chip">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-6">
          <div className="relative aspect-video w-full max-w-sm flex-shrink-0 overflow-hidden rounded-xl bg-yt-skeleton">
            {data.thumbnail ? (
              <img
                src={data.thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
              <ListVideo className="h-10 w-10" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-yt-secondary">
              Playlist
            </p>
            <h1 className="mt-1 text-2xl font-bold text-yt-text sm:text-3xl">
              {data.title}
            </h1>
            <p className="mt-2 text-sm text-yt-secondary">{data.channelTitle}</p>
            <p className="text-sm text-yt-secondary">
              {[data.videoCountText, data.updatedText]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {data.description ? (
              <p className="mt-2 line-clamp-3 text-sm text-yt-secondary">
                {data.description}
              </p>
            ) : null}
            {firstVideo ? (
              <Link
                href={`/watch/${firstVideo.videoId}?list=${data.playlistId}`}
                className="yt-btn yt-btn-red mt-4"
              >
                <Play className="h-4 w-4 fill-current" />
                Play all
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        {data.videos.map((video, index) => (
          <Link
            key={video.videoId}
            href={`/watch/${video.videoId}?list=${data.playlistId}`}
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-yt-hover"
          >
            <span className="w-6 flex-shrink-0 text-center text-sm text-yt-secondary">
              {index + 1}
            </span>

            <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-lg bg-yt-skeleton sm:w-40">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : null}
              {video.durationText ? (
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                  {video.durationText}
                </span>
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-sm font-medium text-yt-text">
                {video.title}
              </h2>
              <p className="mt-0.5 truncate text-xs text-yt-secondary">
                {video.channelTitle || data.channelTitle}
              </p>
            </div>
          </Link>
        ))}

        {data.videos.length === 0 ? (
          <p className="py-12 text-center text-sm text-yt-secondary">
            This playlist is empty.
          </p>
        ) : null}
      </div>
    </div>
  )
}
