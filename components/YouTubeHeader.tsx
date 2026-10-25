'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, Menu, Play, Plus, Search } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface YouTubeHeaderProps {
  onMenu: () => void
  onAdd: () => void
}

export default function YouTubeHeader({ onMenu, onAdd }: YouTubeHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [mobileSearch, setMobileSearch] = useState(false)

  const isSubpage =
    pathname.startsWith('/watch') || pathname.startsWith('/channel')

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    setMobileSearch(false)
    router.push(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <header className="sticky top-0 z-40 bg-yt-bg">
      <div className="flex h-14 items-center justify-between gap-2 px-2 sm:px-4">
        {mobileSearch ? (
          <form onSubmit={submit} className="flex w-full items-center gap-1 sm:hidden">
            <button
              type="button"
              onClick={() => setMobileSearch(false)}
              className="yt-icon-btn"
              aria-label="Close search"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-full border border-yt-border bg-yt-search px-4 text-base text-yt-text outline-none"
              placeholder="Search your channels"
            />
            <button type="submit" className="yt-icon-btn" aria-label="Search">
              <Search className="h-6 w-6" />
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-1 sm:gap-2">
              {isSubpage ? (
                <>
                  <button
                    onClick={goBack}
                    className="yt-icon-btn sm:hidden"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={onMenu}
                    className="yt-icon-btn hidden sm:inline-flex"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onMenu}
                  className="yt-icon-btn"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <Link href="/" className="flex items-center gap-1">
                <span className="flex h-[22px] w-8 items-center justify-center rounded-[6px] bg-yt-red text-white">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </span>
                <span className="text-[20px] font-semibold tracking-[-0.6px]">
                  MetroList
                </span>
              </Link>
            </div>

            <form
              onSubmit={submit}
              className="hidden max-w-[640px] flex-1 items-center sm:flex"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="yt-search-input"
                placeholder="Search your channels"
                aria-label="Search your channels"
              />
              <button type="submit" className="yt-search-btn" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMobileSearch(true)}
                className="yt-icon-btn sm:hidden"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
              <button
                onClick={onAdd}
                className="yt-btn yt-btn-tonal hidden sm:inline-flex"
              >
                <Plus className="h-5 w-5" />
                Add
              </button>
              <button
                onClick={onAdd}
                className="yt-icon-btn sm:hidden"
                aria-label="Add channel"
              >
                <Plus className="h-6 w-6" />
              </button>
              <ThemeToggle />
            </div>
          </>
        )}
      </div>
    </header>
  )
}
