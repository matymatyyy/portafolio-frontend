import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/formatters'

describe('formatDate', () => {
  it('formats an ISO date string to en-US short format', () => {
    const result = formatDate('2024-06-15T12:00:00Z')
    expect(result).toMatch(/Jun \d{2}, 2024/)
  })

  it('formats dates consistently with two-digit days', () => {
    const result = formatDate('2024-07-05T12:00:00Z')
    expect(result).toMatch(/Jul 0[45], 2024/)
  })

  it('formats a date-only string', () => {
    const result = formatDate('2023-03-10')
    expect(result).toMatch(/Mar \d{2}, 2023/)
  })

  it('returns a string with month abbreviation, day, and year', () => {
    const result = formatDate('2024-11-20T15:30:00Z')
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{2}, \d{4}$/)
  })

  it('handles different months correctly', () => {
    const months = [
      ['2024-01-15T12:00:00Z', 'Jan'],
      ['2024-06-15T12:00:00Z', 'Jun'],
      ['2024-12-15T12:00:00Z', 'Dec'],
    ]
    for (const [input, expected] of months) {
      expect(formatDate(input)).toContain(expected)
    }
  })
})
