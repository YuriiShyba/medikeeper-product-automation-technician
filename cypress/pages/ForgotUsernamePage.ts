import {
  recoveryMessages,
  recoverySelectors,
} from '../constants/recovery.constants'

export const ForgotUsernamePage = {
  open() {
    cy.contains('a', recoverySelectors.forgotUsernameLinkText).click()
    cy.get(recoverySelectors.forgotUsernameDialog).should('be.visible')
  },

  enterEmail(email: string) {
    cy.get(recoverySelectors.forgotUsernameEmail).clear().type(email)
  },

  blurEmail() {
    cy.get(recoverySelectors.forgotUsernameEmail).press('Tab')
  },

  submit() {
    cy.get(recoverySelectors.forgotUsernameSubmit).click()
  },

  expectInvalidEmail() {
    cy.get(recoverySelectors.forgotUsernameDialog)
      .contains(recoveryMessages.invalidEmail)
      .should('be.visible')
  },

  expectSubmitDisabled() {
    cy.get(recoverySelectors.forgotUsernameSubmit).should(
      'have.attr',
      'disabled',
      'disabled',
    )
  },

  expectSubmitEnabled() {
    cy.get(recoverySelectors.forgotUsernameSubmit).should('not.have.attr', 'disabled')
  },

  expectGenericResponse() {
    cy.get(recoverySelectors.forgotUsernameDialog)
      .contains(recoveryMessages.forgotUsernameSubmitted)
      .should('be.visible')
  },
}
