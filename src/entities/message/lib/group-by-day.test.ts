import { describe, expect, it } from 'vitest'
import type { Message } from '../model/types'
import { groupByDay } from './group-by-day'

const at = (id: string, date: Date): Message => ({ id, text: id, timestamp: date.getTime(), direction: 'incoming' })

describe('groupByDay', () => {
  it('ставит подпись дня только на первое сообщение каждого дня', () => {
    const now = new Date(2026, 8, 29, 12)
    const items = groupByDay(
      [at('a', new Date(2026, 8, 28, 10)), at('b', new Date(2026, 8, 28, 11)), at('c', new Date(2026, 8, 29, 9))],
      now,
    )
    expect(items.map((item) => item.dayLabel)).toEqual(['Вчера', undefined, 'Сегодня'])
  })
})
