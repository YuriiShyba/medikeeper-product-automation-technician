import { registrationMessages, registrationSelectors } from '../../constants/registration.constants'
import { LoginPage } from '../../pages/LoginPage'
import { RegistrationPage } from '../../pages/RegistrationPage'

describe('Known defect: invalid registration DOB', () => {
  it('shows a readable validation message for an impossible date of birth', () => {
    LoginPage.visit()
    RegistrationPage.open()
    RegistrationPage.enterDob({ month: 13, day: 40, year: 2020 })
    RegistrationPage.submit()

    cy.get(registrationSelectors.dobValidator)
      .should('be.visible')
      .and('have.attr', 'role', 'alert')
      .and('have.attr', 'aria-live', 'polite')
      .and('contain.text', registrationMessages.invalidDob)
  })
})
