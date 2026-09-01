import { recoveryTestData } from '../../constants/recovery.constants'
import { ForgotPasswordPage } from '../../pages/ForgotPasswordPage'
import { ForgotUsernamePage } from '../../pages/ForgotUsernamePage'
import { LoginPage } from '../../pages/LoginPage'
import { uniqueSyntheticValue } from '../../support/helpers'

describe('Account recovery', { testIsolation: false }, () => {
  before(() => {
    LoginPage.visit()
  })

  beforeEach(() => {
    LoginPage.restore()
  })

  it('keeps Forgot Username Submit disabled for an invalid email', () => {
    ForgotUsernamePage.open()
    ForgotUsernamePage.enterEmail(recoveryTestData.malformedEmail)
    ForgotUsernamePage.blurEmail()
    ForgotUsernamePage.expectInvalidEmail()
    ForgotUsernamePage.expectSubmitDisabled()
  })

  it('shows the generic recovery response for a synthetic valid-format email', () => {
    const syntheticEmail = `${uniqueSyntheticValue(
      recoveryTestData.syntheticEmailPrefix,
    )}@${recoveryTestData.syntheticEmailDomain}`

    ForgotUsernamePage.open()
    ForgotUsernamePage.enterEmail(syntheticEmail)
    ForgotUsernamePage.blurEmail()
    ForgotUsernamePage.expectSubmitEnabled()
    ForgotUsernamePage.submit()
    ForgotUsernamePage.expectGenericResponse()
  })

  it('advances Forgot Password to DOB for a non-empty synthetic username', () => {
    ForgotPasswordPage.open()
    ForgotPasswordPage.enterUsername(
      uniqueSyntheticValue(recoveryTestData.syntheticUsernamePrefix),
    )
    ForgotPasswordPage.submitUsername()
    ForgotPasswordPage.expectDobStep()
  })

  it('shows M01 when synthetic username and DOB cannot be verified', () => {
    ForgotPasswordPage.open()
    ForgotPasswordPage.enterUsername(
      uniqueSyntheticValue(recoveryTestData.syntheticUsernamePrefix),
    )
    ForgotPasswordPage.submitUsername()
    ForgotPasswordPage.expectDobStep()
    ForgotPasswordPage.enterDob(recoveryTestData.syntheticDob)
    ForgotPasswordPage.blurDobYear()
    ForgotPasswordPage.expectNormalizedDob(recoveryTestData.syntheticDob)
    ForgotPasswordPage.expectDobSubmitActionable()
    ForgotPasswordPage.submitDob()
    ForgotPasswordPage.expectM01()
  })
})
