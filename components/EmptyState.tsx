'use client'

import { Plus, Youtube } from 'lucide-react'

interface EmptyStateProps {
  onAdd: () => void
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-m3-xl bg-surface-container-low px-6 py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-m3-full bg-primary-container text-on-primary-container">
        <Youtube className="h-11 w-11" />
      </div>
      <h2 className="text-2xl font-normal leading-8 text-on-surface">
        No channels yet
      </h2>
      <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
        Add a YouTube channel by pasting its link to start building your
        personal list.
      </p>
      <button onClick={onAdd} className="m3-btn m3-btn-filled mt-6">
        <Plus className="h-4 w-4" />
        Add channel
      </button>
    </div>
  )
}
