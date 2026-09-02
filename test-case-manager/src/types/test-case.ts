export const priorities = ['High', 'Medium', 'Low'] as const

export type Priority = (typeof priorities)[number]

export interface TestCase {
  id: string
  testName: string
  scriptPath: string
  priority: Priority
  createdBy: string
}

export type NewTestCase = Omit<TestCase, 'id'>
