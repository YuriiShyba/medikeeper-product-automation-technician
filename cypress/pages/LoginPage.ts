import {
  invalidLoginData,
  loginMessages,
  loginRoute,
  loginSelectors,
} from '../constants/login.constants'
import { recoverySelectors } from '../constants/recovery.constants'
import { registrationSelectors } from '../constants/registration.constants'
import { uniqueSyntheticValue } from '../support/helpers'

export const LoginPage = {
  visit() {
    cy.visit(loginRoute)
    cy.get(loginSelectors.username).should('be.visible')
  },

  restore() {
    cy.get('body').then(($body) => {
      const $panelClose = $body.find(`${recoverySelectors.panelClose}:visible`).first()

      if ($panelClose.length) {
        cy.wrap($panelClose).click()
      }
    })

    cy.get('body').then(($body) => {
      if ($body.find(`${registrationSelectors.container}:visible`).length) {
        cy.get(registrationSelectors.backToLogin).click()
      }
    })

    cy.get('body').then(($body) => {
      const $alertClose = $body.find(`${loginSelectors.alertClose}:visible`).first()

      if ($alertClose.length) {
        cy.wrap($alertClose).click()
      }
    })

    cy.get(loginSelectors.username).should('be.visible').clear()
    cy.get(loginSelectors.password).clear()
  },

  enterUsername(username: string) {
    cy.get(loginSelectors.username).clear().type(username)
  },

  enterPassword(password: string) {
    cy.get(loginSelectors.password).clear().type(password, { log: false })
  },

  submit() {
    cy.get(loginSelectors.submit).click()
  },

  submitEmpty() {
    this.submit()
  },

  submitSyntheticInvalidCredentials() {
    this.enterUsername(uniqueSyntheticValue(invalidLoginData.usernamePrefix))
    this.enterPassword(invalidLoginData.password)
    this.submit()
  },

  openRegistration() {
    cy.get(loginSelectors.switchToRegistration).click()
  },

  expectRequiredMessages() {
    cy.contains(loginMessages.usernameRequired).should('be.visible')
    cy.contains(loginMessages.passwordRequired).should('be.visible')
  },

  expectInvalidCredentialsMessage() {
    cy.get(loginSelectors.alertContent)
      .should('be.visible')
      .and('contain.text', loginMessages.invalidCredentials)
  },

  login(username: string, password: string) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.submit()
  },

  completeControlledMfa(inputSelector: string, code: string, submitSelector: string) {
    cy.get(inputSelector).should('be.visible').type(code, { log: false })
    cy.get(submitSelector).click()
  },

  expectAuthenticatedState(authenticatedStateSelector: string) {
    cy.get(authenticatedStateSelector, { log: false }).should('be.visible')
  },
}
