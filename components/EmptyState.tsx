'use client'

import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  onAdd: () => void
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-800">
        <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No channels yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
        Add a YouTube channel by pasting its link to start building your list.
      </p>
      <button onClick={onAdd} className="flex items-center gap-2 metro-btn-primary">
        <Plus className="w-4 h-4" /> Add Channel
      </button>
    </div>
  )
}

interface NavbarProps {
  channels: Array<{ id: string }>
  onAdd: () => void
  onRemove: (id: string) => void
}

export function Navbar({
  channels,
  onAdd,
  onRemove,
}: NavbarProps) {
  return null
}
