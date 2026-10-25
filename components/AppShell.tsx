'use client'

import { useState } from 'react'
import YouTubeHeader from '@/components/YouTubeHeader'
import Sidebar, { MobileDrawer } from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import AddChannelDialog from '@/components/AddChannelDialog'
import { AppShellContext } from '@/lib/app-shell'
import { useChannels } from '@/lib/useChannels'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [addOpen, setAddOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { channels } = useChannels()

  function handleMenu() {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches
    ) {
      setCollapsed((value) => !value)
    } else {
      setDrawerOpen(true)
    }
  }

  return (
    <AppShellContext.Provider value={{ openAddChannel: () => setAddOpen(true) }}>
      <div className="min-h-screen bg-yt-bg text-yt-text">
        <YouTubeHeader onMenu={handleMenu} onAdd={() => setAddOpen(true)} />

        <div className="flex">
          <Sidebar
            channels={channels}
            collapsed={collapsed}
            onAdd={() => setAddOpen(true)}
          />
          <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
        </div>

        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          channels={channels}
          onAdd={() => {
            setDrawerOpen(false)
            setAddOpen(true)
          }}
        />

        <BottomNav
          onAdd={() => setAddOpen(true)}
          onGuide={() => setDrawerOpen(true)}
        />

        <AddChannelDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
        />
      </div>
    </AppShellContext.Provider>
  )
}
