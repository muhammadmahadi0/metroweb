'use client'

import Link from 'next/link'
import { ListVideo } from 'lucide-react'
import type { FeedPlaylist } from '@/lib/playlists'

export default function PlaylistCard({
  playlist,
}: {
  playlist: FeedPlaylist
}) {
  const count = playlist.videoCountText.match(/\d[\d,]*/)?.[0] || ''

  return (
    <Link href={`/playlist/${playlist.playlistId}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-yt-skeleton">
        {playlist.thumbnail ? (
          <img
            src={playlist.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : null}

        <div className="absolute inset-y-0 right-0 flex w-2/5 flex-col items-center justify-center gap-1 bg-black/75 text-white">
          <ListVideo className="h-5 w-5" />
          <span className="text-xs font-medium">
            {count || playlist.videoCountText}
          </span>
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-[15px] font-medium leading-5 text-yt-text">
        {playlist.title}
      </h3>
      <p className="mt-1 text-[13px] text-yt-secondary">Playlist</p>
      {playlist.updatedText ? (
        <p className="text-[13px] text-yt-secondary">{playlist.updatedText}</p>
      ) : null}
    </Link>
  )
}
