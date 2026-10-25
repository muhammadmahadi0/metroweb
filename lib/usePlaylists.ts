'use client'

import { useEffect, useState } from 'react'
import {
  fetchChannelPlaylists,
  fetchPlaylist,
  type FeedPlaylist,
  type FeedPlaylistData,
} from '@/lib/playlists'

export function useChannelPlaylists(channelId?: string) {
  const [playlists, setPlaylists] = useState<FeedPlaylist[]>([])
  const [loading, setLoading] = useState(Boolean(channelId))

  useEffect(() => {
    if (!channelId) {
      setPlaylists([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchChannelPlaylists(channelId)
      .then((result) => {
        if (cancelled) return
        setPlaylists(result)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setPlaylists([])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [channelId])

  return { playlists, loading }
}

export function usePlaylist(playlistId?: string) {
  const [data, setData] = useState<FeedPlaylistData | null>(null)
  const [loading, setLoading] = useState(Boolean(playlistId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playlistId) {
      setData(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchPlaylist(playlistId)
      .then((result) => {
        if (cancelled) return
        setData(result)
        setLoading(false)
      })
      .catch((err: any) => {
        if (cancelled) return
        setError(err?.message || 'Unable to load playlist')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [playlistId])

  return { data, loading, error }
}
