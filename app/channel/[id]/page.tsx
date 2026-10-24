import { notFound } from 'next/navigation'
import { getChannels } from '@/lib/index'
import ChannelHeader from '@/components/ChannelHeader'
import VideoGrid from '@/components/VideoGrid'

interface ChannelPageProps {
  params: Promise<{ id: string }>
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { id } = await params
  const channels = getChannels()
  const channel = channels.find((c) => c.id === id)

  if (!channel) {
    notFound()
  }

  // Try to load videos via API route. If no API key is configured, the route
  // returns an informative error and an empty video list.
  let videos: Array<{
    videoId: string
    title: string
    description: string
    thumbnail: string
    channelTitle: string
    publishedAt: string
    channelId: string
    watchUrl: string
  }> = []
  let apiError: string | null = null

  try {
    const res = await fetch(
      `/api/channel/${encodeURIComponent(channel.channelId)}/videos?channelId=${encodeURIComponent(channel.channelId)}`,
      { next: { revalidate: 60 } }
    )
    const json = await res.json()
    if (json.error) {
      apiError = json.error
    }
    videos = json.videos || []
  } catch {
    apiError = 'Unable to load videos at this time.'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="/"
              className="metro-btn-ghost"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              <span className="flex items-center gap-2">
                <ArrowLeftIcon /> Back
              </span>
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      <ChannelHeader channel={channel} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiError && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 mb-6">
            <p className="text-sm text-red-700 dark:text-red-400">
              {apiError}
            </p>
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Latest Videos
        </h2>
        <VideoGrid videos={videos} />
      </div>
    </div>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )
}
