import { loginRoute } from '../../constants/login.constants'
import { LoginPage } from '../../pages/LoginPage'

describe('Login', { testIsolation: false }, () => {
  before(() => {
    LoginPage.visit()
  })

  beforeEach(() => {
    LoginPage.restore()
  })

  it('shows required validation when login fields are empty', () => {
    let submissionRequests = 0

    cy.intercept('POST', `**${loginRoute}`, () => {
      submissionRequests += 1
    })

    LoginPage.submitEmpty()
    LoginPage.expectRequiredMessages()

    cy.then(() => {
      expect(submissionRequests, 'login submission requests').to.eq(0)
    })
  })

  it('shows a generic error for invalid credentials', () => {
    LoginPage.submitSyntheticInvalidCredentials()
    LoginPage.expectInvalidCredentialsMessage()
  })
})
