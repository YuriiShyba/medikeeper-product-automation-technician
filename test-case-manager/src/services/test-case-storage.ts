import {
  priorities,
  type NewTestCase,
  type Priority,
  type TestCase,
} from '../types/test-case'

export const TEST_CASE_STORAGE_KEY = 'qa-test-case-manager.records.v1'
export const DUPLICATE_SCRIPT_PATH_MESSAGE =
  'A test case with this Script Path already exists.'

export type CreateTestCaseResult =
  | { ok: true; records: TestCase[]; created: TestCase }
  | { ok: false; message: string }

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && priorities.includes(value as Priority)
}

function isTestCase(value: unknown): value is TestCase {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Partial<TestCase>

  return (
    typeof record.id === 'string' &&
    typeof record.testName === 'string' &&
    typeof record.scriptPath === 'string' &&
    isPriority(record.priority) &&
    typeof record.createdBy === 'string'
  )
}

function persistTestCases(records: TestCase[]): void {
  const storage = getLocalStorage()

  if (!storage) {
    throw new Error('Browser storage is unavailable. Test cases could not be saved.')
  }

  storage.setItem(TEST_CASE_STORAGE_KEY, JSON.stringify(records))
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `test-case-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function loadTestCases(): TestCase[] {
  const storage = getLocalStorage()

  if (!storage) {
    return []
  }

  const storedValue = storage.getItem(TEST_CASE_STORAGE_KEY)

  if (!storedValue?.trim()) {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue.filter(isTestCase) : []
  } catch {
    return []
  }
}

export function hasDuplicateScriptPath(records: TestCase[], scriptPath: string): boolean {
  const trimmedScriptPath = scriptPath.trim()
  return records.some((record) => record.scriptPath === trimmedScriptPath)
}

export function createTestCase(
  records: TestCase[],
  input: NewTestCase,
): CreateTestCaseResult {
  const normalizedInput: NewTestCase = {
    testName: input.testName.trim(),
    scriptPath: input.scriptPath.trim(),
    priority: input.priority,
    createdBy: input.createdBy.trim(),
  }

  if (hasDuplicateScriptPath(records, normalizedInput.scriptPath)) {
    return { ok: false, message: DUPLICATE_SCRIPT_PATH_MESSAGE }
  }

  const created: TestCase = {
    id: createId(),
    ...normalizedInput,
  }
  const nextRecords = [created, ...records]

  persistTestCases(nextRecords)
  return { ok: true, records: nextRecords, created }
}

export function updateTestCasePriority(
  records: TestCase[],
  id: string,
  priority: Priority,
): TestCase[] {
  const nextRecords = records.map((record) =>
    record.id === id ? { ...record, priority } : record,
  )

  persistTestCases(nextRecords)
  return nextRecords
}

export function deleteTestCase(records: TestCase[], id: string): TestCase[] {
  const nextRecords = records.filter((record) => record.id !== id)

  persistTestCases(nextRecords)
  return nextRecords
}
