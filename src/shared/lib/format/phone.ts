/** Оставляет только цифры; российский номер с 8 в начале приводит к формату 7XXXXXXXXXX */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  return digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits
}

export function isValidPhone(phone: string): boolean {
  return /^\d{10,15}$/.test(phone)
}

export function formatPhone(phone: string): string {
  const m = phone.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/)
  return m ? `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : `+${phone}`
}
