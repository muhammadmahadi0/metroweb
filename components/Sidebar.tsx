'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, X } from 'lucide-react'
import type { Channel } from '@/lib/index'

interface SidebarProps {
  channels: Channel[]
  collapsed: boolean
  onAdd: () => void
}

function ChannelLink({
  channel,
  collapsed,
  onClick,
}: {
  channel: Channel
  collapsed: boolean
  onClick?: () => void
}) {
  if (collapsed) {
    return (
      <Link
        href={`/channel/${channel.id}`}
        onClick={onClick}
        className="mx-auto mt-1 flex h-12 w-12 items-center justify-center rounded-full hover:bg-yt-hover"
        title={channel.title}
      >
        {channel.thumbnail ? (
          <img
            src={channel.thumbnail}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yt-chip text-[10px] font-medium">
            {channel.title.slice(0, 1).toUpperCase()}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={`/channel/${channel.id}`}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-yt-hover"
    >
      {channel.thumbnail ? (
        <img
          src={channel.thumbnail}
          alt=""
          className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yt-chip text-[10px] font-medium">
          {channel.title.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="truncate text-sm">{channel.title}</span>
    </Link>
  )
}

export default function Sidebar({ channels, collapsed, onAdd }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-shrink-0 overflow-y-auto py-3 lg:block ${
        collapsed ? 'w-[72px] px-1' : 'w-60 px-3'
      }`}
    >
      <nav className="space-y-0.5">
        <Link
          href="/"
          className={`flex items-center rounded-lg hover:bg-yt-hover ${
            collapsed ? 'mx-auto h-12 w-12 justify-center' : 'gap-5 px-3 py-2'
          } ${pathname === '/' ? 'bg-yt-hover font-medium' : ''}`}
          title="Home"
        >
          <Home className="h-6 w-6 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Home</span>}
        </Link>

        <button
          onClick={onAdd}
          className={`flex items-center rounded-lg hover:bg-yt-hover ${
            collapsed ? 'mx-auto h-12 w-12 justify-center' : 'w-full gap-5 px-3 py-2'
          }`}
          title="Add channel"
        >
          <Plus className="h-6 w-6 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Add channel</span>}
        </button>
      </nav>

      {channels.length > 0 && (
        <div className="mt-3 border-t border-yt-border pt-3">
          {!collapsed && (
            <p className="px-3 pb-1 text-base font-medium">Your channels</p>
          )}
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <ChannelLink
                key={channel.id}
                channel={channel}
                collapsed={collapsed}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export function MobileDrawer({
  open,
  onClose,
  channels,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  channels: Channel[]
  onAdd: () => void
}) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-64 overflow-y-auto bg-yt-bg px-3 py-3 shadow-2xl">
        <div className="mb-2 flex items-center gap-1 px-1">
          <button onClick={onClose} className="yt-icon-btn" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold">MetroList</span>
        </div>

        <nav className="space-y-0.5">
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-5 rounded-lg px-3 py-2 hover:bg-yt-hover ${
              pathname === '/' ? 'bg-yt-hover font-medium' : ''
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-sm">Home</span>
          </Link>
          <button
            onClick={onAdd}
            className="flex w-full items-center gap-5 rounded-lg px-3 py-2 hover:bg-yt-hover"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Add channel</span>
          </button>
        </nav>

        {channels.length > 0 && (
          <div className="mt-3 border-t border-yt-border pt-3">
            <p className="px-3 pb-1 text-base font-medium">Your channels</p>
            <div className="space-y-0.5">
              {channels.map((channel) => (
                <ChannelLink
                  key={channel.id}
                  channel={channel}
                  collapsed={false}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
