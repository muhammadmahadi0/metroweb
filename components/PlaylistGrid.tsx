'use client'

import PlaylistCard from '@/components/PlaylistCard'
import type { FeedPlaylist } from '@/lib/playlists'

export function PlaylistSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <div className="aspect-video w-full animate-pulse rounded-xl bg-yt-skeleton" />
          <div className="mt-3 h-4 w-11/12 animate-pulse rounded bg-yt-skeleton" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-yt-skeleton" />
        </div>
      ))}
    </div>
  )
}

export default function PlaylistGrid({
  playlists,
  loading = false,
}: {
  playlists: FeedPlaylist[]
  loading?: boolean
}) {
  if (loading) {
    return <PlaylistSkeletonGrid />
  }

  if (playlists.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-yt-secondary">
        No playlists found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.playlistId} playlist={playlist} />
      ))}
    </div>
  )
}
