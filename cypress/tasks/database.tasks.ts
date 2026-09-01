const requiredBackendEnvironment = ['TAKEHOME_DB_ADAPTER', 'TAKEHOME_DB_CONNECTION'] as const
const lastLoginPollIntervalMs = 100

interface LastLoginSnapshot {
  value: string | null
}

interface LoginAuditResult {
  exists: boolean
}

interface BackendAdapter {
  readLastLogin(input: { userLookupKey: string }): Promise<LastLoginSnapshot>
  findLoginAuditEvent(input: {
    userLookupKey: string
    previousLastLogin: string | null
    currentLastLogin: string | null
  }): Promise<LoginAuditResult>
}

interface WaitForLastLoginChangeInput {
  userLookupKey: string
  previousLastLogin: string | null
  observationStartedAtMs: number
  timeoutMs: number
}

interface LastLoginChangeObservation {
  currentLastLogin: string | null
  observedAtMs: number
  elapsedMs: number
}

export const backendVerificationContract = {
  userTable: '<USER_TABLE>',
  lastLoginColumn: '<LAST_LOGIN_COLUMN>',
  loginAuditTable: '<LOGIN_AUDIT_TABLE>',
} as const

function assertBackendConfiguration(): void {
  const missing = requiredBackendEnvironment.filter((name) => !process.env[name])

  if (missing.length > 0) {
    throw new Error(
      `[authenticated-gate] Backend verification is not configured. Missing: ${missing.join(
        ', ',
      )}. Provide a provisioned adapter and secret connection configuration before running this gate.`,
    )
  }
}

function adapterNotImplemented(taskName: string): never {
  throw new Error(
    `[authenticated-gate] ${taskName} cannot run because no database adapter has been implemented. ` +
      'Implement the provisioned backend contract without replacing <USER_TABLE>, <LAST_LOGIN_COLUMN>, or <LOGIN_AUDIT_TABLE> with guessed internal schema names.',
  )
}

function provisionedBackendAdapter(taskName: string): BackendAdapter {
  assertBackendConfiguration()
  return adapterNotImplemented(taskName)
}

function waitForNextPoll(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs))
}

async function pollForLastLoginChange(
  adapter: BackendAdapter,
  input: WaitForLastLoginChangeInput,
): Promise<LastLoginChangeObservation> {
  if (!Number.isFinite(input.timeoutMs) || input.timeoutMs <= 0) {
    throw new Error('[authenticated-gate] Last Login update timeout must be a positive number.')
  }

  const deadlineMs = input.observationStartedAtMs + input.timeoutMs

  while (true) {
    const current = await adapter.readLastLogin({ userLookupKey: input.userLookupKey })
    const observedAtMs = Date.now()
    const elapsedMs = observedAtMs - input.observationStartedAtMs

    if (current.value !== input.previousLastLogin) {
      if (observedAtMs > deadlineMs) {
        throw new Error(
          `[authenticated-gate] Last Login changed, but it was first observed after the configured ${input.timeoutMs} ms timeout.`,
        )
      }

      return {
        currentLastLogin: current.value,
        observedAtMs,
        elapsedMs,
      }
    }

    if (observedAtMs >= deadlineMs) {
      throw new Error(
        `[authenticated-gate] Last Login did not change within the configured ${input.timeoutMs} ms timeout.`,
      )
    }

    await waitForNextPoll(Math.min(lastLoginPollIntervalMs, deadlineMs - observedAtMs))
  }
}

export function registerDatabaseTasks(on: Cypress.PluginEvents): void {
  on('task', {
    'db:assertConfigured'() {
      assertBackendConfiguration()
      return {
        configured: true,
        contract: backendVerificationContract,
      }
    },

    'db:readLastLogin'(input: { userLookupKey: string }) {
      return provisionedBackendAdapter('db:readLastLogin').readLastLogin(input)
    },

    'db:waitForLastLoginChange'(input: WaitForLastLoginChangeInput) {
      const adapter = provisionedBackendAdapter('db:waitForLastLoginChange')
      return pollForLastLoginChange(adapter, input)
    },

    'db:findLoginAuditEvent'(input: {
      userLookupKey: string
      previousLastLogin: string | null
      currentLastLogin: string | null
    }) {
      return provisionedBackendAdapter('db:findLoginAuditEvent').findLoginAuditEvent(input)
    },
  })
}
