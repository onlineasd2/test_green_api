import { describe, expect, it } from 'vitest'
import { formatDayLabel, formatPhone, getInitials, isValidPhone, normalizePhone } from '.'

describe('normalizePhone', () => {
  it('убирает форматирование', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567')
  })

  it('заменяет ведущую 8 на 7 для российских номеров', () => {
    expect(normalizePhone('8 999 123 45 67')).toBe('79991234567')
  })

  it('не трогает иностранные номера', () => {
    expect(normalizePhone('+375 29 123-45-67')).toBe('375291234567')
  })
})

describe('isValidPhone', () => {
  it.each([
    ['79991234567', true],
    ['375291234567', true],
    ['12345', false],
    ['', false],
  ])('%s → %s', (phone, expected) => {
    expect(isValidPhone(phone)).toBe(expected)
  })
})

describe('formatPhone', () => {
  it('форматирует российский номер', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67')
  })

  it('добавляет + к остальным номерам', () => {
    expect(formatPhone('375291234567')).toBe('+375291234567')
  })
})

describe('formatDayLabel', () => {
  const now = new Date(2026, 8, 29, 12)

  it('сегодня и вчера', () => {
    expect(formatDayLabel(new Date(2026, 8, 29, 9).getTime(), now)).toBe('Сегодня')
    expect(formatDayLabel(new Date(2026, 8, 28, 23).getTime(), now)).toBe('Вчера')
  })
})

describe('getInitials', () => {
  it.each([
    ['Иван Петров', 'ИП'],
    ['Анна', 'А'],
    ['+7 999 123-45-67', '67'],
    ['', '#'],
  ])('%s → %s', (title, expected) => {
    expect(getInitials(title)).toBe(expected)
  })
})
