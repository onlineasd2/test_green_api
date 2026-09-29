import { create } from 'zustand'

export type ConnectionStatus = 'connecting' | 'online' | 'error'

interface ConnectionStore {
  status: ConnectionStatus
  error: string | null
  setOnline: () => void
  setError: (error: string) => void
  reset: () => void
}

/** Состояние канала получения сообщений — читается статусом в шапке, пишется циклом опроса */
export const useConnectionStore = create<ConnectionStore>()((set) => ({
  status: 'connecting',
  error: null,
  setOnline: () => set({ status: 'online', error: null }),
  setError: (error) => set({ status: 'error', error }),
  reset: () => set({ status: 'connecting', error: null }),
}))
