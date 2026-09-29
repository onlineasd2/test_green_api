import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { DeliveryStatus } from '@/entities/message/@x/chat'
import { STORAGE_KEYS } from '@/shared/config'
import * as transitions from './chat-transitions'
import type { ChatsState, IncomingMessage } from './types'

interface ChatStore extends ChatsState {
  /** idInstance, которому принадлежат сохранённые чаты */
  ownerId: string | null
  /** Привязывает чаты к инстансу; при смене инстанса история очищается */
  assignOwner: (idInstance: string) => void
  openChat: (chatId: string, phone?: string) => void
  selectChat: (chatId: string | null) => void
  addMessage: (input: IncomingMessage) => void
  confirmMessage: (localId: string, id: string) => void
  setMessageStatus: (id: string, status: DeliveryStatus) => void
  removeMessage: (id: string) => void
}

type PersistedChatStore = Pick<ChatStore, 'ownerId' | 'chats'>

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      ownerId: null,
      chats: [],
      activeChatId: null,

      assignOwner: (idInstance) =>
        set((state) => (state.ownerId === idInstance ? state : { ownerId: idInstance, chats: [], activeChatId: null })),
      openChat: (chatId, phone) => set((state) => transitions.openChat(state, chatId, phone)),
      selectChat: (chatId) => set((state) => transitions.selectChat(state, chatId)),
      addMessage: (input) => set((state) => transitions.addMessage(state, input)),
      confirmMessage: (localId, id) => set((state) => transitions.confirmMessage(state, localId, id)),
      setMessageStatus: (id, status) => set((state) => transitions.setMessageStatus(state, id, status)),
      removeMessage: (id) => set((state) => transitions.removeMessage(state, id)),
    }),
    {
      name: STORAGE_KEYS.chats,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedChatStore => ({ ownerId: state.ownerId, chats: state.chats }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<PersistedChatStore> | undefined
        return { ...current, ...saved, chats: transitions.failPendingMessages(saved?.chats ?? []) }
      },
    },
  ),
)

/** Действия без подписки на состояние — для хуков и обработчиков вне рендера */
export const chatActions = () => useChatStore.getState()
