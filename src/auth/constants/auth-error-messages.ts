// Authentication exception messages during login
export enum AuthenticationErrors {
  INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password',
  EMAIL_CONFIRMATION_REQUIRED = 'Email confirmation required',
  INCORRECT_EMAIL_FORMAT = 'Incorrect email format',
  MISSING_EMAIL_OR_PASSWORD = 'Missing email or password',
  ACCOUNT_LOCKED = 'Account locked',
  ACCOUNT_NOT_FOUND = 'Account not found',
  PASSWORD_TOO_SHORT = 'Password must be at least X characters long',
  PASSWORD_REQUIREMENTS_NOT_MET = 'Password must contain at least one letter and one number',
  PASSWORDS_DO_NOT_MATCH = 'Passwords do not match',
  ACCOUNT_ALREADY_ACTIVE = 'Account already active',
}
