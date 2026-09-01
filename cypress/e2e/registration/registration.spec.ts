import { registrationTestData } from '../../constants/registration.constants'
import { LoginPage } from '../../pages/LoginPage'
import { RegistrationPage } from '../../pages/RegistrationPage'
import {
  buildSyntheticRegistrant,
  calendarDateYearsAgo,
} from '../../support/helpers'

describe('Registration', { testIsolation: false }, () => {
  before(() => {
    LoginPage.visit()
  })

  beforeEach(() => {
    LoginPage.restore()
    RegistrationPage.open()
    RegistrationPage.clearForm()
  })

  it('shows required validation for an empty registration form', () => {
    RegistrationPage.submit()
    RegistrationPage.expectRequiredValidations()
  })

  it('rejects invalid email addresses', () => {
    RegistrationPage.enterEmail(registrationTestData.malformedEmail)
    RegistrationPage.submit()
    RegistrationPage.expectEmailInvalid()
  })

  it('limits ZIP to seven characters', () => {
    RegistrationPage.enterZip('1234567890')
    RegistrationPage.expectZipLimitedTo('1234567')
  })

  it('rejects a user who is one day younger than 18', () => {
    const registrant = buildSyntheticRegistrant(calendarDateYearsAgo(18, 1))

    RegistrationPage.interceptPasswordCheck('passwordCheck-registration-under18')
    RegistrationPage.fillRegistrant(registrant)
    RegistrationPage.waitForPasswordCheck('passwordCheck-registration-under18')
    RegistrationPage.submit()
    RegistrationPage.expectUnder18Result()
  })

  it('allows a user who is exactly 18 to pass the age gate', () => {
    const registrant = buildSyntheticRegistrant(calendarDateYearsAgo(18))

    RegistrationPage.interceptPasswordCheck('passwordCheck-registration-exactly18')
    RegistrationPage.fillRegistrant(registrant)
    RegistrationPage.waitForPasswordCheck('passwordCheck-registration-exactly18')
    RegistrationPage.submit()
    RegistrationPage.expectInformationNotVerifiedResult()
  })
})
