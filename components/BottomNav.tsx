'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Menu, Plus, Search } from 'lucide-react'

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: typeof Home
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex w-16 flex-col items-center gap-0.5 ${
        active ? 'text-yt-text' : 'text-yt-secondary'
      }`}
    >
      <Icon className={`h-6 w-6 ${active ? 'fill-current' : ''}`} />
      <span className="text-[10px] leading-3">{label}</span>
    </Link>
  )
}

export default function BottomNav({
  onAdd,
  onGuide,
}: {
  onAdd: () => void
  onGuide: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-yt-border bg-yt-bg lg:hidden">
      <NavItem href="/" label="Home" icon={Home} active={pathname === '/'} />
      <NavItem
        href="/search"
        label="Search"
        icon={Search}
        active={pathname.startsWith('/search')}
      />
      <button
        onClick={onAdd}
        className="flex w-16 flex-col items-center gap-0.5 text-yt-secondary"
      >
        <Plus className="h-6 w-6" />
        <span className="text-[10px] leading-3">Add</span>
      </button>
      <button
        onClick={onGuide}
        className="flex w-16 flex-col items-center gap-0.5 text-yt-secondary"
      >
        <Menu className="h-6 w-6" />
        <span className="text-[10px] leading-3">Channels</span>
      </button>
    </nav>
  )
}
