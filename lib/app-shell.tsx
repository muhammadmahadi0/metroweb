'use client'

import { createContext, useContext } from 'react'

export interface AppShellApi {
  openAddChannel: () => void
}

export const AppShellContext = createContext<AppShellApi>({
  openAddChannel: () => {},
})

export function useAppShell() {
  return useContext(AppShellContext)
}
