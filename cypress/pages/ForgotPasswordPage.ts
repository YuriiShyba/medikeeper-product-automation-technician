import {
  recoveryMessages,
  recoverySelectors,
} from '../constants/recovery.constants'
import type { CalendarDate } from '../support/helpers'

export const ForgotPasswordPage = {
  open() {
    cy.contains('a', recoverySelectors.forgotPasswordLinkText).click()
    cy.get(recoverySelectors.forgotPasswordDialog).should('be.visible')
  },

  enterUsername(username: string) {
    cy.get(recoverySelectors.forgotPasswordUsername).clear().type(username)
  },

  submitUsername() {
    cy.get(recoverySelectors.forgotPasswordNext).click()
  },

  expectDobStep() {
    cy.get(recoverySelectors.forgotPasswordDobMonth).should('be.visible')
    cy.get(recoverySelectors.forgotPasswordDobDay).should('be.visible')
    cy.get(recoverySelectors.forgotPasswordDobYear).should('be.visible')
    cy.contains(recoveryMessages.forgotPasswordDobPrompt).should('be.visible')
  },

  enterDob(dob: CalendarDate) {
    cy.get(recoverySelectors.forgotPasswordDobMonth)
      .clear()
      .type(String(dob.month), { delay: 0 })
    cy.get(recoverySelectors.forgotPasswordDobDay).clear().type(String(dob.day), { delay: 0 })
    cy.get(recoverySelectors.forgotPasswordDobYear).clear().type(String(dob.year), { delay: 0 })
  },

  blurDobYear() {
    cy.get(recoverySelectors.forgotPasswordDobYear).blur()
  },

  expectNormalizedDob(dob: CalendarDate) {
    const normalizedDob = `${dob.month}/${dob.day}/${dob.year}`

    cy.get(recoverySelectors.forgotPasswordDobComposite).should(
      'have.value',
      normalizedDob,
    )
  },

  expectDobSubmitActionable() {
    cy.get(recoverySelectors.forgotPasswordDobSubmit)
      .should('be.visible')
      .and('not.have.attr', 'disabled')
  },

  submitDob() {
    cy.get(recoverySelectors.forgotPasswordDobSubmit).click()
  },

  expectM01() {
    cy.get(recoverySelectors.requestMessaging)
      .contains(recoveryMessages.forgotPasswordM01)
  },
}
