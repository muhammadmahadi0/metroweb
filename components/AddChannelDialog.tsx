'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, ArrowRight, Loader2 } from 'lucide-react'
import { channelFromResolved } from '@/lib/channel'
import { addChannel } from '@/lib/index'

interface AddChannelDialogProps {
  open: boolean
  onClose: () => void
  onAdd: () => void
}

export default function AddChannelDialog({
  open,
  onClose,
  onAdd,
}: AddChannelDialogProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/channel?url=${encodeURIComponent(url)}`)
      const json = await res.json()
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to resolve channel')
      }
      const channel = channelFromResolved(json)
      addChannel(channel)
      onClose()
      setUrl('')
      router.push(`/channel/${channel.id}`)
    } catch (err: any) {
      setError(err.message || 'Could not add that channel.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add Channel
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              YouTube channel link
            </label>
            <input
              className="metro-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/@channelname or /channel/UC..."
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Paste any YouTube channel link (handle, /channel/, /c/, /user/)
            </p>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 metro-btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 metro-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Add Channel
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
