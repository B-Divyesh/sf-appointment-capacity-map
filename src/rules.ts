import type { Booking, Data, Id, Service } from './types'

export type Conflict = { kind: 'staff' | 'resource' | 'pair'; label: string; detail: string; bookingId?: Id }
const minutes = (time: string) => { const [h, m] = time.split(':').map(Number); return h * 60 + m }
export const overlaps = (a: Booking, b: Booking) => {
  if (a.date !== b.date) return false
  return minutes(a.start) < minutes(b.start) + b.minutes && minutes(b.start) < minutes(a.start) + a.minutes
}
export const serviceById = (data: Data, value: Id) => data.services.find((x) => x.id === value)
export const staffById = (data: Data, value: Id) => data.staff.find((x) => x.id === value)
export const resourceById = (data: Data, value: Id) => data.resources.find((x) => x.id === value)

/** Explains every rule that makes this proposed booking unavailable. */
export function conflictsFor(data: Data, draft: Booking): Conflict[] {
  const service = serviceById(data, draft.serviceId)
  const person = staffById(data, draft.staffId)
  if (!service || !person) return [{ kind: 'staff', label: 'Choose a service and team member', detail: 'This job needs both before capacity can be checked.' }]
  const active = data.bookings.filter((b) => b.id !== draft.id && overlaps(b, draft))
  const results: Conflict[] = []
  const staffUse = active.filter((b) => b.staffId === draft.staffId).length + 1
  if (staffUse > person.parallelSlots) results.push({ kind: 'staff', label: `${person.name} is at capacity`, detail: `${staffUse} overlapping jobs would use ${person.name}; their limit is ${person.parallelSlots}.` })
  for (const resourceId of draft.resourceIds) {
    const resource = resourceById(data, resourceId)
    const use = active.filter((b) => b.resourceIds.includes(resourceId)).length + 1
    if (resource && use > resource.capacity) results.push({ kind: 'resource', label: `${resource.name} is already in use`, detail: `${use} overlapping jobs would need it; its capacity is ${resource.capacity}.` })
  }
  for (const booking of active) {
    const other = serviceById(data, booking.serviceId)
    const rule = data.rules.find((r) => !r.allowed && ((r.serviceA === draft.serviceId && r.serviceB === booking.serviceId) || (r.serviceB === draft.serviceId && r.serviceA === booking.serviceId)))
    if (rule) results.push({ kind: 'pair', label: `${service.name} and ${other?.name ?? 'this service'} do not overlap`, detail: rule.note || 'This service pair has an explicit no-overlap rule.', bookingId: booking.id })
  }
  return results
}

export function availabilityFor(data: Data, service: Service, staffId: Id, date: string, start: string, minutesCount = service.minutes) {
  const draft: Booking = { id: 'draft', date, start, minutes: minutesCount, staffId, serviceId: service.id, resourceIds: service.resourceIds, client: '', createdAt: 0 }
  return conflictsFor(data, draft)
}

export function seededData(): Data {
  const ava = { id: 'ava', name: 'Ava', color: '#176b8a', parallelSlots: 1 }
  const leo = { id: 'leo', name: 'Leo', color: '#a75a18', parallelSlots: 1 }
  const chair = { id: 'chair', name: 'Treatment chair', capacity: 1, color: '#b94e45' }
  const van = { id: 'van', name: 'Service van', capacity: 1, color: '#377353' }
  const consult = { id: 'consult', name: 'Consultation', minutes: 30, staffIds: [ava.id, leo.id], resourceIds: [], color: '#176b8a' }
  const treatment = { id: 'treatment', name: 'Treatment', minutes: 60, staffIds: [ava.id], resourceIds: [chair.id], color: '#b94e45' }
  const visit = { id: 'visit', name: 'Mobile visit', minutes: 60, staffIds: [leo.id], resourceIds: [van.id], color: '#377353' }
  return { staff: [ava, leo], resources: [chair, van], services: [consult, treatment, visit], rules: [{ id: 'treatment-visit', serviceA: treatment.id, serviceB: visit.id, allowed: false, note: 'Keep a specialist available for hand-off while a mobile visit is out.' }], bookings: [] }
}
