import { describe, expect, it } from 'vitest'
import { conflictsFor, seededData } from './rules'
import type { Booking } from './types'

describe('capacity checks', () => {
  it('explains an occupied shared resource', () => {
    const data = seededData()
    data.bookings.push({ id: 'one', date: '2026-08-28', start: '09:00', minutes: 60, staffId: 'ava', serviceId: 'treatment', resourceIds: ['chair'], client: '', createdAt: 0 })
    const draft: Booking = { id: 'two', date: '2026-08-28', start: '09:30', minutes: 30, staffId: 'leo', serviceId: 'consult', resourceIds: ['chair'], client: '', createdAt: 0 }
    expect(conflictsFor(data, draft).map((x) => x.kind)).toContain('resource')
  })
  it('allows separate people and separate equipment', () => {
    const data = seededData()
    data.bookings.push({ id: 'one', date: '2026-08-28', start: '09:00', minutes: 60, staffId: 'ava', serviceId: 'treatment', resourceIds: ['chair'], client: '', createdAt: 0 })
    const draft: Booking = { id: 'two', date: '2026-08-28', start: '09:30', minutes: 30, staffId: 'leo', serviceId: 'consult', resourceIds: [], client: '', createdAt: 0 }
    expect(conflictsFor(data, draft)).toEqual([])
  })
})
