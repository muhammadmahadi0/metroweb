import { Suspense } from 'react'
import WatchClient from '@/components/WatchClient'

export default function WatchPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-yt-secondary">Loading…</div>}
    >
      <WatchClient />
    </Suspense>
  )
}
