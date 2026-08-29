export type Id = string

export type Staff = { id: Id; name: string; color: string; parallelSlots: number }
export type Service = { id: Id; name: string; minutes: number; staffIds: Id[]; resourceIds: Id[]; color: string }
export type Resource = { id: Id; name: string; capacity: number; color: string }
export type Rule = { id: Id; serviceA: Id; serviceB: Id; allowed: boolean; note: string }
export type Booking = {
  id: Id; date: string; start: string; minutes: number; staffId: Id; serviceId: Id
  resourceIds: Id[]; client: string; createdAt: number
}
export type Data = { staff: Staff[]; services: Service[]; resources: Resource[]; rules: Rule[]; bookings: Booking[] }

export const emptyData = (): Data => ({ staff: [], services: [], resources: [], rules: [], bookings: [] })
export const id = () => crypto.randomUUID()
const twoDigits = (value: number) => String(value).padStart(2, '0')
export const localCalendarDate = (date: Date) => `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`
export const today = () => localCalendarDate(new Date())

export const addCalendarDays = (value: string, days: number) => {
  const [year, month, date] = value.split('-').map(Number)
  const result = new Date(Date.UTC(year, month - 1, date + days))
  return `${result.getUTCFullYear()}-${twoDigits(result.getUTCMonth() + 1)}-${twoDigits(result.getUTCDate())}`
}
