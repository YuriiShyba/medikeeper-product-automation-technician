export const registrationSelectors = {
  container: '#registrationFormContainer',
  firstName: '#ctl00_MainContent_ctl07_rptRegistrationFields_ctl00_ctl00_element_23',
  lastName: '#ctl00_MainContent_ctl07_rptRegistrationFields_ctl01_ctl00_element_24',
  dobMonth: '#dob_month',
  dobDay: '#dob_day',
  dobYear: '#dob_year',
  dobComposite: '#dob_37_38_39',
  dobValidator: '#ctl00_MainContent_ctl07_rptRegistrationFields_ctl02_ctl00_valDOBRequired',
  memberId: '#ctl00_MainContent_ctl07_rptRegistrationFields_ctl03_ctl00_externalId',
  zip: '#ctl00_MainContent_ctl07_rptRegistrationFields_ctl04_ctl00_element_43',
  email: '#ctl00_MainContent_ctl07_element_35',
  emailRequired: '#ctl00_MainContent_ctl07_valUsername',
  emailFormat: '#ctl00_MainContent_ctl07_valRegExUsername',
  password: '#ctl00_MainContent_ctl07_tbxPassword',
  passwordRequired: '#ctl00_MainContent_ctl07_passwordRequired',
  passwordStrength: '#ctl00_MainContent_ctl07_passwordStrength',
  passwordToggle: '#btnToggleVisibility',
  submit: '#ctl00_MainContent_ctl07_btnSubmitRegister',
  backToLogin: '#switchToLoginButton',
  associatedValidation: '.form__validation__group__message',
  alertContent: '.alert__content',
} as const

export const registrationMessages = {
  firstNameRequired: 'First Name is required field',
  lastNameRequired: 'Last Name is required field',
  memberIdRequired: 'Member ID is required field',
  passwordRequired: 'Password is required',
  invalidDob: 'Please enter a valid value in each field to complete this date format: MM DD YYYY.',
  under18: 'Sorry, you do not meet the age requirements for this system.',
  informationNotVerified:
    'We apologize, at this point your information cannot be verified. If you are still experiencing registration issues, please contact your agent.',
} as const

export const registrationTestData = {
  firstName: 'Automation',
  lastNamePrefix: 'User',
  memberIdPrefix: 'QA',
  zip: '6060100',
  emailLocalPrefix: 'qa-takehome-',
  emailDomain: 'example.test',
  compliantPassword: 'P@s$w0rDd153',
  malformedEmail: 'not-an-email',
} as const
