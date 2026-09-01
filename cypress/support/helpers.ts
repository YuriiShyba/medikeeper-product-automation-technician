import { registrationTestData } from '../constants/registration.constants'

export interface CalendarDate {
  month: number
  day: number
  year: number
}

export interface SyntheticRegistrant {
  firstName: string
  lastName: string
  dob: CalendarDate
  memberId: string
  zip: string
  email: string
  password: string
}

export function calendarDateYearsAgo(
  years: number,
  dayOffset = 0,
  now = new Date(),
): CalendarDate {
  const date = new Date(
    now.getFullYear() - years,
    now.getMonth(),
    now.getDate() + dayOffset,
    12,
  )

  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear(),
  }
}

export function buildSyntheticRegistrant(dob: CalendarDate): SyntheticRegistrant {
  const token = `${Date.now()}${Math.floor(Math.random() * 10_000)}`

  return {
    firstName: registrationTestData.firstName,
    lastName: `${registrationTestData.lastNamePrefix}${token}`,
    dob,
    memberId: `${registrationTestData.memberIdPrefix}${token.slice(-12)}`,
    zip: registrationTestData.zip,
    email: `${registrationTestData.emailLocalPrefix}${token}@${registrationTestData.emailDomain}`,
    password: registrationTestData.compliantPassword,
  }
}

export function uniqueSyntheticValue(prefix: string): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 10_000)}`
}
