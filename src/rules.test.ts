import { describe, expect, it } from 'vitest'
import { conflictsFor, overlaps, seededData } from './rules'
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

  it('rejects a team member who is not configured for the service', () => {
    const data = seededData()
    const draft: Booking = { id: 'invalid-assignment', date: '2026-08-28', start: '09:00', minutes: 60, staffId: 'ava', serviceId: 'visit', resourceIds: ['van'], client: '', createdAt: 0 }
    expect(conflictsFor(data, draft)).toContainEqual({
      kind: 'staff',
      label: 'Ava does not provide Mobile visit',
      detail: 'Choose a team member listed for this service.'
    })
  })

  it('finds staff, resource, and pair conflicts across midnight', () => {
    const data = seededData()
    data.bookings = [{ id: 'late', date: '2026-08-28', start: '23:30', minutes: 60, staffId: 'ava', serviceId: 'treatment', resourceIds: ['chair'], client: '', createdAt: 0 }]

    const staffDraft: Booking = { id: 'staff-draft', date: '2026-08-29', start: '00:00', minutes: 30, staffId: 'ava', serviceId: 'consult', resourceIds: [], client: '', createdAt: 0 }
    const resourceDraft: Booking = { id: 'resource-draft', date: '2026-08-29', start: '00:00', minutes: 30, staffId: 'leo', serviceId: 'consult', resourceIds: ['chair'], client: '', createdAt: 0 }
    const pairDraft: Booking = { id: 'pair-draft', date: '2026-08-29', start: '00:00', minutes: 60, staffId: 'leo', serviceId: 'visit', resourceIds: ['van'], client: '', createdAt: 0 }

    expect(conflictsFor(data, staffDraft).map((issue) => issue.kind)).toContain('staff')
    expect(conflictsFor(data, resourceDraft).map((issue) => issue.kind)).toContain('resource')
    expect(conflictsFor(data, pairDraft).map((issue) => issue.kind)).toContain('pair')
  })

  it('allows an exact endpoint at midnight', () => {
    const endingAtMidnight: Booking = { id: 'ending', date: '2026-08-28', start: '23:30', minutes: 30, staffId: 'ava', serviceId: 'consult', resourceIds: [], client: '', createdAt: 0 }
    const startingAtMidnight: Booking = { id: 'starting', date: '2026-08-29', start: '00:00', minutes: 30, staffId: 'ava', serviceId: 'consult', resourceIds: [], client: '', createdAt: 0 }
    expect(overlaps(endingAtMidnight, startingAtMidnight)).toBe(false)
  })
})
