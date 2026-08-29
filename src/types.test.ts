import { describe, expect, it } from 'vitest'
import { addCalendarDays, localCalendarDate } from './types'

describe('calendar dates', () => {
  it('formats local date parts without converting through UTC', () => {
    const localDate = new Date(2026, 7, 30, 0, 5)
    expect(localCalendarDate(localDate)).toBe('2026-08-30')
  })

  it('adds calendar days across month and year boundaries', () => {
    expect(addCalendarDays('2026-08-29', 13)).toBe('2026-09-11')
    expect(addCalendarDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})
