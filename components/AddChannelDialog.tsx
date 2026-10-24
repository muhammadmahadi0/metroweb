'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'
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
      onAdd()
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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="fixed inset-0 animate-m3-scrim bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-m3-in overflow-hidden rounded-m3-xl bg-surface-container-high text-on-surface shadow-m3-3">
        <div className="flex items-start justify-between p-6 pb-2">
          <div>
            <h2 className="text-2xl font-normal leading-8">Add channel</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Paste a YouTube channel link to add it to your list.
            </p>
          </div>
          <button
            onClick={onClose}
            className="m3-icon-btn -mr-2 -mt-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 pt-2">
            <label
              htmlFor="channel-url"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-on-surface-variant"
            >
              Channel link
            </label>
            <input
              id="channel-url"
              className="m3-text-field"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/@channelname"
              autoFocus
            />
            <p className="mt-2 text-xs text-on-surface-variant">
              Works with @handles, /channel/, /c/ and /user/ links.
            </p>

            {error && (
              <div className="mt-4 rounded-m3-md bg-error-container px-4 py-3 text-sm text-on-error-container">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="m3-btn m3-btn-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="m3-btn m3-btn-filled"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-m3-spin" />
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
