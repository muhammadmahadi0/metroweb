'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import ChannelCard from '@/components/ChannelCard'
import AddChannelDialog from '@/components/AddChannelDialog'
import EmptyState from '@/components/EmptyState'
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
  const [removing, setRemoving] = useState<string | null>(null)

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
    setRemoving(id)
    setChannels(removeChannel(id))
    setRemoving(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                M
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">
                MetroList
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                {channels.length} channel{channels.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setDialogOpen(true)}
                className="metro-btn-primary"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Your Channels
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse each channel&apos;s latest videos. Tap a channel to open it.
          </p>
        </div>

        {channels.length === 0 ? (
          <EmptyState onAdd={() => setDialogOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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

      <AddChannelDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
