import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Credentials } from '@/shared/api'
import { STORAGE_KEYS } from '@/shared/config'

interface SessionStore {
  credentials: Credentials | null
  start: (credentials: Credentials) => void
  end: () => void
}

/** Сессия = ключи инстанса GREEN-API, под которыми работает пользователь */
export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      credentials: null,
      start: (credentials) => set({ credentials }),
      end: () => set({ credentials: null }),
    }),
    {
      name: STORAGE_KEYS.session,
      version: 1,
      partialize: (state) => ({ credentials: state.credentials }),
    },
  ),
)
