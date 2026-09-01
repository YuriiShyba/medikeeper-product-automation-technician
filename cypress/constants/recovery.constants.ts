export const recoverySelectors = {
  forgotUsernameLinkText: 'Forgot Username',
  forgotPasswordLinkText: 'Forgot Password',
  forgotUsernameDialog: '[role="dialog"][aria-label="Forgot Username"]',
  forgotUsernameEmail: '#tbxEmail',
  forgotUsernameSubmit: '#btnForgotU',
  panelClose: '.offcanvas-panel__close.slide-panel-close',
  forgotPasswordDialog: '[role="dialog"][aria-label="Forgot Password"]',
  forgotPasswordUsername: '#tbxUsername',
  forgotPasswordNext: '#btnForgotPStep1',
  forgotPasswordDobMonth: '#ctl01_dob_month',
  forgotPasswordDobDay: '#ctl01_dob_day',
  forgotPasswordDobYear: '#ctl01_dob_year',
  forgotPasswordDobComposite: '#tbxDOB',
  forgotPasswordDobSubmit: '#btnForgotPDob',
  forgotPasswordLaterEmail: '#tbxEmail',
  forgotPasswordLaterSubmit: '#btnForgotP2Fa',
  requestMessaging: '#reqMessaging',
} as const

export const recoveryMessages = {
  invalidEmail: 'Please enter a valid email address',
  forgotUsernameSubmitted:
    'Username recovery request submitted. Please check your email. If you do not receive an email within 10 minutes, it may be because you have entered an unknown email address and you should try another.',
  forgotPasswordDobPrompt: 'Please confirm your date of birth.',
  forgotPasswordM01:
    'Sorry, something went wrong. We are unable to complete the password reset process at this time. Please try again or contact your portal administrator customerservice@medikeeper.com for assistance. (Error code: M01)',
} as const

export const recoveryTestData = {
  malformedEmail: 'not-an-email',
  syntheticEmailPrefix: 'qa-takehome-',
  syntheticEmailDomain: 'example.invalid',
  syntheticUsernamePrefix: 'qa_takehome_',
  syntheticDob: { month: 3, day: 14, year: 1985 },
} as const
