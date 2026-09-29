export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type StateInstance =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'starting'
  | 'suspended'
  | 'pendingPassword'

export interface SenderData {
  chatId: string
  chatName?: string
  chatType?: string
  sender?: string
  senderName?: string
  senderContactName?: string
  senderPhoneNumber?: number
}

export interface MessageData {
  typeMessage: string
  textMessageData?: { textMessage: string }
  extendedTextMessageData?: { text: string }
}

export interface NotificationBody {
  typeWebhook: string
  timestamp: number
  idMessage?: string
  senderData?: SenderData
  messageData?: MessageData
  /** Есть у уведомлений outgoingMessageStatus */
  chatId?: string
  status?: string
}

export interface Notification {
  receiptId: number
  body: NotificationBody
}

export interface GetStateInstanceResponse {
  stateInstance: StateInstance
}

export interface CheckAccountResponse {
  exist: boolean
  chatId: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface DeleteNotificationResponse {
  result: boolean
}
