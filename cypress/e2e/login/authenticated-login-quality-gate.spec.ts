import { authenticatedEnvironmentKeys } from '../../constants/login.constants'
import { LoginPage } from '../../pages/LoginPage'

interface LastLoginSnapshot {
  value: string | null
}

interface LastLoginChangeObservation {
  currentLastLogin: string | null
  observedAtMs: number
  elapsedMs: number
}

interface LoginAuditResult {
  exists: boolean
}

function requiredCypressEnvironment(name: string): string {
  const value = Cypress.env(name)

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `[authenticated-gate] Missing CYPRESS_${name}. Run only with a provisioned automation account, controlled MFA, and backend environment.`,
    )
  }

  return value
}

function positiveCypressDuration(name: string, defaultValue: number): number {
  const configuredValue = Cypress.env(name)

  if (configuredValue === undefined || configuredValue === '') {
    return defaultValue
  }

  const duration = Number(configuredValue)

  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`[authenticated-gate] CYPRESS_${name} must be a positive number.`)
  }

  return duration
}

describe('Authenticated login backend quality gate', () => {
  it('updates Last Login and creates a corresponding login audit event', () => {
    cy.task('db:assertConfigured').then(() => {
      const username = requiredCypressEnvironment(authenticatedEnvironmentKeys.username)
      const password = requiredCypressEnvironment(authenticatedEnvironmentKeys.password)
      const mfaCode = requiredCypressEnvironment(authenticatedEnvironmentKeys.mfaCode)
      const mfaInputSelector = requiredCypressEnvironment(
        authenticatedEnvironmentKeys.mfaInputSelector,
      )
      const mfaSubmitSelector = requiredCypressEnvironment(
        authenticatedEnvironmentKeys.mfaSubmitSelector,
      )
      const authenticatedStateSelector = requiredCypressEnvironment(
        authenticatedEnvironmentKeys.authenticatedStateSelector,
      )
      const lastLoginUpdateTimeoutMs = positiveCypressDuration(
        authenticatedEnvironmentKeys.lastLoginUpdateTimeoutMs,
        2_000,
      )

      cy.task('db:readLastLogin', { userLookupKey: username }, { log: false }).then(
        (beforeResult) => {
          const before = beforeResult as LastLoginSnapshot

          LoginPage.visit()
          LoginPage.login(username, password)
          LoginPage.completeControlledMfa(mfaInputSelector, mfaCode, mfaSubmitSelector)
          LoginPage.expectAuthenticatedState(authenticatedStateSelector)

          cy.then(() => Date.now()).then((observationStartedAtMs) => {
            cy.task(
              'db:waitForLastLoginChange',
              {
                userLookupKey: username,
                previousLastLogin: before.value,
                observationStartedAtMs,
                timeoutMs: lastLoginUpdateTimeoutMs,
              },
              { log: false },
            ).then((observationResult) => {
              const observation = observationResult as LastLoginChangeObservation

              expect(observation.currentLastLogin, 'updated Last Login value').not.to.eq(
                before.value,
              )
              expect(
                observation.elapsedMs,
                'time until the Last Login change became observable',
              ).to.be.at.most(lastLoginUpdateTimeoutMs)
              expect(observation.observedAtMs).to.eq(
                observationStartedAtMs + observation.elapsedMs,
              )

              cy.task(
                'db:findLoginAuditEvent',
                {
                  userLookupKey: username,
                  previousLastLogin: before.value,
                  currentLastLogin: observation.currentLastLogin,
                },
                { log: false },
              ).then((auditResult) => {
                expect(
                  (auditResult as LoginAuditResult).exists,
                  'corresponding login audit event',
                ).to.eq(true)
              })
            })
          })
        },
      )
    })
  })
})
