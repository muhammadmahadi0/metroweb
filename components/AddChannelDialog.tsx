'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X } from 'lucide-react'
import { channelFromResolved } from '@/lib/channel'
import { addChannel } from '@/lib/index'

interface AddChannelDialogProps {
  open: boolean
  onClose: () => void
  onAdd?: () => void
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!url.trim() || loading) return

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
      onAdd?.()
      onClose()
      setUrl('')
      router.push(`/channel/${channel.id}`)
    } catch (err: any) {
      setError(err?.message || 'Could not add that channel.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-yt-elevated p-6 text-yt-text shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Add channel</h2>
            <p className="mt-1 text-sm text-yt-secondary">
              Paste a YouTube channel link to add it to your feed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="yt-icon-btn -mr-2 -mt-2 flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="channel-url"
            className="mb-2 block text-sm font-medium"
          >
            Channel link
          </label>
          <input
            id="channel-url"
            className="yt-text-field"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/@channelname"
            autoFocus
          />
          <p className="mt-2 text-xs text-yt-secondary">
            Works with @handles, /channel/, /c/ and /user/ links.
          </p>

          {error ? (
            <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="yt-btn yt-btn-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="yt-btn yt-btn-red"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                'Add channel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
