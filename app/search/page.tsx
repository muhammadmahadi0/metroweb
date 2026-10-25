import { Suspense } from 'react'
import SearchClient from '@/components/SearchClient'

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-yt-secondary">Loading…</div>}
    >
      <SearchClient />
    </Suspense>
  )
}
