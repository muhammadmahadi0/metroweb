'use client'

import { useEffect, useState } from 'react'
import type { Channel } from '@/lib/index'
import { fetchFeed, type FeedVideo } from '@/lib/feed'

export function useFeed(channels: Channel[]) {
  const [videos, setVideos] = useState<FeedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const key = channels.map((channel) => channel.channelId).join(',')

  useEffect(() => {
    if (!key) {
      setVideos([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchFeed(channels).then((result) => {
      if (cancelled) return
      setVideos(result)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { videos, loading }
}
