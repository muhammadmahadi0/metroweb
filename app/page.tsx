'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Youtube } from 'lucide-react'
import ChannelCard from '@/components/ChannelCard'
import AddChannelDialog from '@/components/AddChannelDialog'
import EmptyState from '@/components/EmptyState'
import ThemeToggle from '@/components/ThemeToggle'
import { getChannels, removeChannel } from '@/lib/index'

interface ChannelListItem {
  id: string
  channelId: string
  title: string
  description: string
  thumbnail: string
  url: string
  addedAt: string
  videoCount?: number
  lastVideo?: { title: string; publishedAt: string }
}

export default function HomePage() {
  const router = useRouter()
  const [channels, setChannels] = useState<ChannelListItem[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadChannels = useCallback(() => {
    setChannels(getChannels())
  }, [])

  useEffect(() => {
    loadChannels()
  }, [loadChannels])

  const handleAdd = () => {
    loadChannels()
    router.refresh()
  }

  const handleRemove = (id: string) => {
    setChannels(removeChannel(id))
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* M3 top app bar */}
      <header className="sticky top-0 z-20 bg-surface backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-m3-md bg-primary-container text-on-primary-container">
              <Youtube className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-medium tracking-tight">MetroList</h1>
              <p className="text-[11px] text-on-surface-variant">YouTube channels</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {channels.length > 0 && (
              <span className="m3-chip hidden sm:inline-flex">
                {channels.length} channel{channels.length !== 1 ? 's' : ''}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
        <div className="m3-divider" />
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6">
        <section className="mb-8">
          <h2 className="text-[28px] font-normal leading-9 tracking-tight text-on-surface">
            Your Channels
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Browse each channel&apos;s latest videos. Tap a channel to open it.
          </p>
        </section>

        {channels.length === 0 ? (
          <EmptyState onAdd={() => setDialogOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>

      {/* Extended FAB */}
      <button
        onClick={() => setDialogOpen(true)}
        className="m3-fab fixed bottom-6 right-6 z-30"
        aria-label="Add channel"
      >
        <Plus className="h-5 w-5" />
        <span>Add channel</span>
      </button>

      <AddChannelDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
