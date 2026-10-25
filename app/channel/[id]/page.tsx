'use client'

import { useParams, useRouter } from 'next/navigation'
import { useChannels } from '@/lib/useChannels'
import { useFeed } from '@/lib/useFeed'
import { removeChannel } from '@/lib/index'
import ChannelHeader from '@/components/ChannelHeader'
import VideoGrid, { SkeletonGrid } from '@/components/VideoGrid'

export default function ChannelPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const { channels, ready } = useChannels()
  const channel = channels.find((item) => item.id === id)
  const { videos, loading } = useFeed(channel ? [channel] : [])

  if (!ready) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <SkeletonGrid />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-yt-text">
          Channel not found
        </h1>
        <p className="mt-2 text-sm text-yt-secondary">
          This channel isn&apos;t in your list. It may have been removed.
        </p>
        <button
          onClick={() => router.push('/')}
          className="yt-btn yt-btn-red mt-6"
        >
          Back to home
        </button>
      </div>
    )
  }

  const channelId = channel.id

  function handleRemove() {
    removeChannel(channelId)
    router.push('/')
  }

  return (
    <div className="pb-6">
      <ChannelHeader
        channel={channel}
        videoCount={videos.length}
        onRemove={handleRemove}
      />

      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <VideoGrid videos={videos} loading={loading} />
      </div>
    </div>
  )
}
