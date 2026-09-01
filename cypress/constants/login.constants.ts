export const loginRoute = '/accounts/v8/takehome/login/'

export const loginSelectors = {
  username: '#ctl00_MainContent_loginForm_tbxLoginUsername',
  password: '#ctl00_MainContent_loginForm_tbxLoginPassword',
  submit: '#ctl00_MainContent_loginForm_btnSubmitLogin',
  switchToRegistration: '#switchToRegisterButton',
  alertContent: '.alert__content',
  alertClose: '.alert__close',
} as const

export const loginMessages = {
  usernameRequired: 'You must enter a username',
  passwordRequired: 'You must enter a password',
  invalidCredentials: 'Sorry but the login information that you entered is incorrect',
} as const

export const invalidLoginData = {
  usernamePrefix: 'qa_takehome_invalid_',
  password: 'NotARealCredential1!',
} as const

export const authenticatedEnvironmentKeys = {
  username: 'AUTH_USERNAME',
  password: 'AUTH_PASSWORD',
  mfaCode: 'AUTH_MFA_CODE',
  mfaInputSelector: 'AUTH_MFA_INPUT_SELECTOR',
  mfaSubmitSelector: 'AUTH_MFA_SUBMIT_SELECTOR',
  authenticatedStateSelector: 'AUTHENTICATED_STATE_SELECTOR',
  lastLoginUpdateTimeoutMs: 'LAST_LOGIN_UPDATE_TIMEOUT_MS',
} as const
