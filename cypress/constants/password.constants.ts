export const passwordEndpoint = '/components/member/ajax/check-password-reuse.aspx'

export const passwordSelectors = {
  rule: '.password-strength__rule',
  success: 'password-strength__rule--success',
  error: 'password-strength__rule--error',
} as const

export const passwordRules = {
  minimumLength: 'must contain 8 or more characters',
  letter: 'must contain 1 or more letters',
  number: 'must contain 1 or more numbers',
  uncommon: 'must not be common or previously used',
  nonSequential:
    'cannot contain 3 or more sequential or repetitive numbers, letters or characters in a row (111, AAA, $$$)',
} as const

export type PasswordRuleText = (typeof passwordRules)[keyof typeof passwordRules]
export type PasswordRuleStatus = 'success' | 'error'

export interface PasswordCase {
  title: string
  value: string
  alias: string
  expectedRules: Partial<Record<keyof typeof passwordRules, PasswordRuleStatus>>
  expectAllSuccessful?: boolean
}

export const passwordCases: PasswordCase[] = [
  {
    title: 'rejects a password shorter than eight characters',
    value: 'myway1',
    alias: 'passwordCheck-short',
    expectedRules: {
      minimumLength: 'error',
      letter: 'success',
      number: 'success',
    },
  },
  {
    title: 'rejects a password without a letter',
    value: '45823795',
    alias: 'passwordCheck-no-letter',
    expectedRules: {
      minimumLength: 'success',
      letter: 'error',
      number: 'success',
    },
  },
  {
    title: 'rejects a password without a number',
    value: 'greatday!',
    alias: 'passwordCheck-no-number',
    expectedRules: {
      minimumLength: 'success',
      letter: 'success',
      number: 'error',
    },
  },
  {
    title: 'rejects a common password after asynchronous validation',
    value: 'Password1',
    alias: 'passwordCheck-common',
    expectedRules: {
      minimumLength: 'success',
      letter: 'success',
      number: 'success',
      uncommon: 'error',
      nonSequential: 'success',
    },
  },
  {
    title: 'rejects a sequential or repetitive password after asynchronous validation',
    value: 'AAA111!!',
    alias: 'passwordCheck-sequential',
    expectedRules: {
      minimumLength: 'success',
      letter: 'success',
      number: 'success',
      uncommon: 'success',
      nonSequential: 'error',
    },
  },
  {
    title: 'accepts a password that satisfies all five requirements',
    value: 'P@s$w0rDd153',
    alias: 'passwordCheck-valid',
    expectedRules: {},
    expectAllSuccessful: true,
  },
]
