import {
  registrationMessages,
  registrationSelectors,
} from '../constants/registration.constants'
import { loginSelectors } from '../constants/login.constants'
import {
  passwordEndpoint,
  passwordRules,
  passwordSelectors,
  type PasswordRuleStatus,
  type PasswordRuleText,
} from '../constants/password.constants'
import type { CalendarDate, SyntheticRegistrant } from '../support/helpers'

export const RegistrationPage = {
  open() {
    cy.get(loginSelectors.switchToRegistration).click()
    cy.get(registrationSelectors.container).should('be.visible')
  },

  clearForm() {
    const fieldSelectors = [
      registrationSelectors.firstName,
      registrationSelectors.lastName,
      registrationSelectors.dobMonth,
      registrationSelectors.dobDay,
      registrationSelectors.dobYear,
      registrationSelectors.memberId,
      registrationSelectors.zip,
      registrationSelectors.email,
      registrationSelectors.password,
    ]

    fieldSelectors.forEach((selector) => {
      cy.get(selector).then(($input) => {
        if ($input.val()) {
          cy.wrap($input).clear()
        }
      })
    })
  },

  enterFirstName(firstName: string) {
    cy.get(registrationSelectors.firstName).clear().type(firstName)
  },

  enterLastName(lastName: string) {
    cy.get(registrationSelectors.lastName).clear().type(lastName)
  },

  enterDob(dob: CalendarDate) {
    cy.get(registrationSelectors.dobMonth).clear().type(String(dob.month), { delay: 0 })
    cy.get(registrationSelectors.dobDay).clear().type(String(dob.day), { delay: 0 })
    cy.get(registrationSelectors.dobYear).clear().type(String(dob.year), { delay: 0 })
  },

  enterMemberId(memberId: string) {
    cy.get(registrationSelectors.memberId).clear().type(memberId)
  },

  enterZip(zip: string) {
    cy.get(registrationSelectors.zip).clear().type(zip)
  },

  enterEmail(email: string) {
    cy.get(registrationSelectors.email).clear().type(email)
  },

  enterPassword(password: string) {
    cy.get(registrationSelectors.password).clear().type(password, { delay: 0, log: false })
  },

  submit() {
    cy.get(registrationSelectors.submit).click()
  },

  fillRegistrant(registrant: SyntheticRegistrant) {
    this.enterFirstName(registrant.firstName)
    this.enterLastName(registrant.lastName)
    this.enterDob(registrant.dob)
    this.enterMemberId(registrant.memberId)
    this.enterZip(registrant.zip)
    this.enterEmail(registrant.email)
    this.enterPassword(registrant.password)
  },

  interceptPasswordCheck(alias: string) {
    cy.intercept('POST', `**${passwordEndpoint}`).as(alias)
  },

  waitForPasswordCheck(alias: string) {
    cy.wait(`@${alias}`).then((interception) => {
      expect(interception.response, 'password-check response').to.exist
      expect(interception.response?.statusCode).to.eq(200)
      expect(interception.response?.body).to.have.property('reused').and.to.be.a('boolean')
      expect(interception.response?.body).to.have.property('validationErrorType')

      const validationErrorType = interception.response?.body.validationErrorType
      expect(
        validationErrorType === null || typeof validationErrorType === 'string',
        'validationErrorType is null or a string',
      ).to.eq(true)
    })
  },

  expectRuleStatus(ruleText: PasswordRuleText, status: PasswordRuleStatus) {
    const expectedClass =
      status === 'success' ? passwordSelectors.success : passwordSelectors.error

    cy.contains(passwordSelectors.rule, ruleText)
      .should('be.visible')
      .and('have.class', expectedClass)
  },

  expectAllRulesSuccessful() {
    Object.values(passwordRules).forEach((ruleText) => {
      this.expectRuleStatus(ruleText, 'success')
    })
  },

  expectAssociatedValidationVisible(inputSelector: string) {
    cy.get(inputSelector)
      .closest('.form__group')
      .find(registrationSelectors.associatedValidation)
      .filter(':visible')
      .should('have.length.at.least', 1)
  },

  expectRequiredValidations() {
    cy.contains(registrationMessages.firstNameRequired).should('be.visible')
    cy.contains(registrationMessages.lastNameRequired).should('be.visible')
    cy.get(registrationSelectors.dobValidator).should('be.visible')
    cy.contains(registrationMessages.memberIdRequired).should('be.visible')
    this.expectAssociatedValidationVisible(registrationSelectors.zip)
    cy.get(registrationSelectors.emailRequired).should('be.visible')
    cy.get(registrationSelectors.passwordRequired)
      .should('be.visible')
      .and('contain.text', registrationMessages.passwordRequired)
  },

  expectEmailInvalid() {
    cy.get(
      `${registrationSelectors.emailRequired}:visible, ${registrationSelectors.emailFormat}:visible`,
    ).should('have.length.at.least', 1)
  },

  expectUnder18Result() {
    cy.get(registrationSelectors.alertContent)
      .should('be.visible')
      .and('contain.text', registrationMessages.under18)
  },

  expectInformationNotVerifiedResult() {
    cy.get(registrationSelectors.alertContent)
      .contains(registrationMessages.informationNotVerified)
    cy.contains(registrationMessages.under18).should('not.exist')
  },

  expectZipLimitedTo(expectedValue: string) {
    cy.get(registrationSelectors.zip)
      .should('have.attr', 'maxlength', '7')
      .and('have.value', expectedValue)
  },

  expectPasswordType(type: 'password' | 'text') {
    cy.get(registrationSelectors.password).should('have.attr', 'type', type)
  },

  togglePasswordVisibility() {
    cy.get(registrationSelectors.passwordToggle).click()
  },
}
