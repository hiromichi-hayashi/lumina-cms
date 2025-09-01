import { create } from 'zustand'

interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  locale: string

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLocale: (locale: string) => void
}

export const useAppStore = create<AppState>(set => ({
  sidebarOpen: true,
  theme: 'system',
  locale: 'ja',

  toggleSidebar: () =>
    set(state => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: open => set({ sidebarOpen: open }),

  setTheme: theme => set({ theme }),

  setLocale: locale => set({ locale }),
}))
