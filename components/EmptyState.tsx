'use client'

import { Plus, Youtube } from 'lucide-react'
import { useAppShell } from '@/lib/app-shell'

export default function EmptyState() {
  const { openAddChannel } = useAppShell()

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yt-chip">
        <Youtube className="h-12 w-12 text-yt-secondary" />
      </div>
      <h2 className="text-2xl font-semibold text-yt-text">No channels yet</h2>
      <p className="mt-2 max-w-md text-sm text-yt-secondary">
        Add a YouTube channel to start building your feed.
      </p>
      <button onClick={openAddChannel} className="yt-btn yt-btn-red mt-6">
        <Plus className="h-5 w-5" />
        Add channel
      </button>
    </div>
  )
}
