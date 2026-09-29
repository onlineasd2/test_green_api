import { describe, expect, it } from 'vitest'
import type { NotificationBody } from '@/shared/api'
import { parseNotification } from './parse-notification'

const senderData = {
  chatId: '10000000',
  chatName: 'Василиса Премудрая',
  senderName: 'Василиса Премудрая',
  senderContactName: 'Василиса',
  senderPhoneNumber: 79998887766,
}

describe('parseNotification', () => {
  it('входящее текстовое сообщение', () => {
    const body: NotificationBody = {
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1763115112,
      idMessage: '1763115112345',
      senderData,
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    }
    expect(parseNotification(body)).toEqual({
      type: 'message',
      message: {
        chatId: '10000000',
        phone: '79998887766',
        title: 'Василиса',
        isApiEcho: false,
        message: {
          id: '1763115112345',
          text: 'Привет',
          timestamp: 1763115112000,
          direction: 'incoming',
          status: undefined,
        },
      },
    })
  })

  it('текст со ссылкой (extendedTextMessage)', () => {
    const result = parseNotification({
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1,
      idMessage: '1',
      senderData,
      messageData: { typeMessage: 'extendedTextMessage', extendedTextMessageData: { text: 'https://green-api.com' } },
    })
    expect(result?.type === 'message' && result.message.message.text).toBe('https://green-api.com')
  })

  it('эхо отправленного через API сообщения', () => {
    const result = parseNotification({
      typeWebhook: 'outgoingAPIMessageReceived',
      timestamp: 1,
      idMessage: '1',
      senderData,
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
    })
    expect(result).toMatchObject({
      type: 'message',
      message: { isApiEcho: true, phone: undefined, message: { direction: 'outgoing', status: 'sent' } },
    })
  })

  it('статус исходящего сообщения', () => {
    expect(
      parseNotification({ typeWebhook: 'outgoingMessageStatus', timestamp: 1, idMessage: '42', status: 'noAccount' }),
    ).toEqual({ type: 'status', id: '42', status: 'failed' })
  })

  it('игнорирует нетекстовые сообщения и служебные уведомления', () => {
    expect(
      parseNotification({
        typeWebhook: 'incomingMessageReceived',
        timestamp: 1,
        idMessage: '1',
        senderData,
        messageData: { typeMessage: 'imageMessage' },
      }),
    ).toBeNull()
    expect(parseNotification({ typeWebhook: 'stateInstanceChanged', timestamp: 1 })).toBeNull()
  })
})
