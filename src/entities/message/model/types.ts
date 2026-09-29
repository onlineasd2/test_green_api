export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export type MessageDirection = 'incoming' | 'outgoing'

export interface Message {
  id: string
  text: string
  /** Unix-время в миллисекундах */
  timestamp: number
  direction: MessageDirection
  /** Только для исходящих */
  status?: DeliveryStatus
}
