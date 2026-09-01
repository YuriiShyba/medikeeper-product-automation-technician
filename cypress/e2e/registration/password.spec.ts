import {
  passwordCases,
  passwordRules,
  type PasswordRuleStatus,
} from '../../constants/password.constants'
import { LoginPage } from '../../pages/LoginPage'
import { RegistrationPage } from '../../pages/RegistrationPage'

describe('Registration password validation', () => {
  beforeEach(() => {
    LoginPage.visit()
    RegistrationPage.open()
  })

  passwordCases.forEach((passwordCase) => {
    it(passwordCase.title, () => {
      RegistrationPage.interceptPasswordCheck(passwordCase.alias)
      RegistrationPage.enterPassword(passwordCase.value)
      RegistrationPage.waitForPasswordCheck(passwordCase.alias)

      if (passwordCase.expectAllSuccessful) {
        RegistrationPage.expectAllRulesSuccessful()
        return
      }

      Object.entries(passwordCase.expectedRules).forEach(([ruleName, status]) => {
        const ruleText = passwordRules[ruleName as keyof typeof passwordRules]
        RegistrationPage.expectRuleStatus(ruleText, status as PasswordRuleStatus)
      })
    })
  })

  it('toggles password visibility', () => {
    RegistrationPage.expectPasswordType('password')

    RegistrationPage.togglePasswordVisibility()
    RegistrationPage.expectPasswordType('text')

    RegistrationPage.togglePasswordVisibility()
    RegistrationPage.expectPasswordType('password')
  })
})
