import { describe, expect, it } from 'vitest'
import { addMessage, confirmMessage, openChat, selectChat, setMessageStatus } from './chat-transitions'
import type { Message } from '@/entities/message/@x/chat'
import type { ChatsState } from './types'

const empty: ChatsState = { chats: [], activeChatId: null }

function msg(overrides: Partial<Message> = {}): Message {
  return { id: 'm1', text: 'Привет', timestamp: 1000, direction: 'incoming', ...overrides }
}

describe('openChat', () => {
  it('создаёт чат и делает его активным', () => {
    const state = openChat(empty, '10000000', '79991234567')
    expect(state.activeChatId).toBe('10000000')
    expect(state.chats).toHaveLength(1)
    expect(state.chats[0]).toMatchObject({ chatId: '10000000', phone: '79991234567' })
  })

  it('открывает существующий чат по номеру вместо создания дубликата', () => {
    const state = openChat(openChat(empty, '10000000', '79991234567'), 'other', '79991234567')
    expect(state.chats).toHaveLength(1)
    expect(state.activeChatId).toBe('10000000')
  })
})

describe('addMessage', () => {
  it('создаёт чат для нового собеседника и считает непрочитанные', () => {
    const state = addMessage(empty, { chatId: '1', title: 'Иван', message: msg() })
    expect(state.chats[0]).toMatchObject({ chatId: '1', title: 'Иван', unread: 1 })
  })

  it('не увеличивает счётчик непрочитанных в открытом чате', () => {
    const opened = openChat(empty, '1')
    expect(addMessage(opened, { chatId: '1', message: msg() }).chats[0].unread).toBe(0)
  })

  it('игнорирует дубликаты по idMessage', () => {
    const once = addMessage(empty, { chatId: '1', message: msg() })
    expect(addMessage(once, { chatId: '1', message: msg() })).toBe(once)
  })

  it('заменяет chatId вида номер@c.us на настоящий, найдя чат по номеру', () => {
    const opened = openChat(empty, '79991234567@c.us', '79991234567')
    const state = addMessage(opened, { chatId: '10000000', phone: '79991234567', message: msg() })
    expect(state.chats).toHaveLength(1)
    expect(state.chats[0].chatId).toBe('10000000')
    expect(state.activeChatId).toBe('10000000')
  })

  it('пропускает эхо API-сообщения, которое ещё ждёт ответа sendMessage', () => {
    const pending = addMessage(openChat(empty, '1'), {
      chatId: '1',
      message: msg({ id: 'local-1', direction: 'outgoing', status: 'pending' }),
    })
    const echo = addMessage(pending, {
      chatId: '1',
      isApiEcho: true,
      message: msg({ id: 'server-1', direction: 'outgoing', status: 'sent' }),
    })
    expect(echo).toBe(pending)
  })

  it('поднимает чат с новым сообщением наверх списка', () => {
    const two = addMessage(addMessage(empty, { chatId: '1', message: msg() }), {
      chatId: '2',
      message: msg({ id: 'm2' }),
    })
    const state = addMessage(two, { chatId: '1', message: msg({ id: 'm3', timestamp: 2000 }) })
    expect(state.chats.map((c) => c.chatId)).toEqual(['1', '2'])
  })
})

describe('confirmMessage', () => {
  const pending = addMessage(openChat(empty, '1'), {
    chatId: '1',
    message: msg({ id: 'local-1', direction: 'outgoing', status: 'pending' }),
  })

  it('подставляет idMessage и статус sent', () => {
    const state = confirmMessage(pending, 'local-1', 'server-1')
    expect(state.chats[0].messages[0]).toMatchObject({ id: 'server-1', status: 'sent' })
  })

  it('убирает локальную копию, если уведомление пришло раньше ответа', () => {
    const withEcho = addMessage(pending, {
      chatId: '1',
      message: msg({ id: 'server-1', text: 'другой текст', direction: 'outgoing', status: 'sent' }),
    })
    const state = confirmMessage(withEcho, 'local-1', 'server-1')
    expect(state.chats[0].messages.map((m) => m.id)).toEqual(['server-1'])
  })
})

describe('setMessageStatus', () => {
  const sent = addMessage(empty, { chatId: '1', message: msg({ direction: 'outgoing', status: 'sent' }) })

  it('повышает статус', () => {
    expect(setMessageStatus(sent, 'm1', 'read').chats[0].messages[0].status).toBe('read')
  })

  it('не понижает статус', () => {
    const read = setMessageStatus(sent, 'm1', 'read')
    expect(setMessageStatus(read, 'm1', 'delivered').chats[0].messages[0].status).toBe('read')
  })
})

describe('selectChat', () => {
  it('сбрасывает счётчик непрочитанных', () => {
    const unread = addMessage(empty, { chatId: '1', message: msg() })
    expect(selectChat(unread, '1').chats[0].unread).toBe(0)
  })
})
