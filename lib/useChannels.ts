'use client'

import { useCallback, useEffect, useState } from 'react'
import { CHANNELS_EVENT, getChannels, type Channel } from '@/lib/index'

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [ready, setReady] = useState(false)

  const reload = useCallback(() => {
    setChannels(getChannels())
  }, [])

  useEffect(() => {
    reload()
    setReady(true)

    const sync = () => reload()
    window.addEventListener(CHANNELS_EVENT, sync)
    window.addEventListener('storage', sync)

    return () => {
      window.removeEventListener(CHANNELS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [reload])

  return { channels, ready, reload }
}
