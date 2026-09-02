# Product Validation Plan

## 1. Purpose and Scope

This plan validates the end-to-end login and onboarding business flow for the take-home assessment. Its scope includes Login, Registration, relevant account-recovery paths, UI validation, business-rule validation, a backend data-integrity strategy, synthetic test data, and Product Quality Gates.

The Cypress project provides an automation coverage. It focuses on important user paths, boundaries, and failure modes rather than attempting to automate every possible regression scenario.

The current take-home execution covered public, unauthenticated behavior. Successful login, controlled MFA, successful account creation, recovery-email delivery, and backend verification require provisioned test data.

## 2. Product Logic / Flow Map

```text
Login
├─ required-field validation
├─ invalid credentials
└─ valid credentials
   └─ MFA
      └─ authenticated session
         └─ backend login-state validation
```

```text
Registration
├─ required fields
├─ email validation
├─ DOB validation
├─ minimum age = 18
├─ password policy
├─ member-information verification
└─ successful account creation
```

```text
Forgot Username
→ validate email
→ generic recovery response

Forgot Password
→ username
→ DOB verification
→ recovery flow
```

These maps show the intended product paths. The take-home did not execute successful authentication/MFA, successful registration, or actual email delivery.

## 3. Validation Strategy

### UI Validation

Representative UI checks cover:

- Required-field feedback and associated validation state.
- Invalid email handling.
- ZIP maximum-length enforcement.
- DOB entry, normalization, and invalid-date feedback.
- Password visibility toggling.
- Forgot Username and Forgot Password panel behavior.

### Business Logic Validation

Business-rule coverage includes:

- Minimum-age eligibility at the exact boundary.
- Password length, letter, number, common/reused, and sequential/repetitive rules.
- Registration/member-information verification behavior.
- Generic invalid-login handling.
- Recovery progression from username to DOB verification.

The primary executable business-rule Product Quality Gate is the minimum-age boundary:

- One day younger than 18 → rejected.
- Exactly 18 → passes the age gate.

### Persistence / Data Integrity Validation

A successful UI message is not enough to prove a successful business transaction. Important operations should also be verified against the resulting backend state in a fully provisioned test environment.

Backend verification must be read-only from the test's perspective and performed through Node-side Cypress tasks. Browser-side Cypress code should not connect directly to a database.

## 4. Data Integrity: UI → Backend

A fully provisioned registration validation would follow this flow:

```text
Generate synthetic member
→ submit registration through UI
→ obtain/correlate stable test identity
→ query backend through a read-only Node-side test adapter
→ compare submitted values with persisted values
```

| UI Field | Generic Backend Representation | Validation |
|---|---|---|
| First Name | `<USER_TABLE>.<FIRST_NAME_COLUMN>` | Exact persisted value |
| Last Name | `<USER_TABLE>.<LAST_NAME_COLUMN>` | Exact persisted value |
| DOB | `<USER_TABLE>.<DOB_COLUMN>` | Same calendar date |
| ZIP | `<USER_TABLE>.<ZIP_COLUMN>` | Expected stored representation |
| Email | `<USER_TABLE>.<EMAIL_COLUMN>` | Expected normalized value |
| Account State | `<USER_TABLE>.<STATUS_COLUMN>` | Expected registration state |

The adapter contract must be mapped only after the test environment's supported database technology and schema are provided.

### Password data

Automation should not query or compare stored password values. It should never retrieve plaintext passwords or password hashes for comparison.

Password persistence and security should instead be validated through:

- Observed password-policy behavior.
- Successful authentication with a controlled automation account.
- Appropriate security expectations for storage, transport, and logging.

### Login integrity

The environment-dependent login integrity gate is designed as:

```text
Read previous <USER_TABLE>.<LAST_LOGIN_COLUMN>
→ perform UI login
→ complete controlled MFA
→ confirm authenticated state
→ poll backend
→ observe Last Login updated within the configured maximum threshold
→ verify a corresponding <LOGIN_AUDIT_TABLE> event was created
```

The example maximum observation threshold is 2 seconds. The measurement is the elapsed time after authentication until the updated backend state becomes observable; this is an assumption of requirements, not the actual requirement of the application.

This gate was not executed for the take-home because the required credentials, MFA setup, backend configuration and implemented adapter were not supplied.

### Negative-path integrity

Rejected workflows should preserve the correct backend state:

- Under-18 registration → rejected → no completed or active account created.
- Failed member-information verification → no completed account created.
- Invalid login → no successful-login state update or success audit event.
- Failed recovery verification → no completed password reset.

These are proposed backend assertions for a fully provisioned environment; the unauthenticated UI results alone do not prove the persistence outcome.

### Correlation

Stable synthetic identifiers should correlate the UI transaction, persisted record, and telemetry event. A unique test email, username or supported external test ID is preferable to searching by first or last name.

### Cleanup

Test data should follow a controlled lifecycle:

```text
Create synthetic test data
→ validate it
→ clean it through a supported test-data mechanism
```

Cleanup should not be performed through browser-side database access. If deterministic cleanup is unavailable, tests should use unique disposable identities backed by an agreed environment cleanup and retention policy.

## 5. Synthetic Data Strategy

### Negative registration/login

Use clearly synthetic values that cannot be mistaken for customer/member data and should not create valid records. Examples include unique invalid usernames, reserved email domains, and obviously synthetic member identifiers.

### Positive registration

Positive registration requires a disposable test identity/member that satisfies the backend prerequisites, including a valid supported registration identifier. Provisioning should use an approved API or test-data mechanism in a fully provisioned environment, not direct database manipulation.

### Recovery / email

When email delivery is not the requirement, use reserved synthetic addresses such as:

```text
qa-auto-<unique-id>@example.invalid
```

When delivery itself must be validated, use a controlled test mailbox or mail sink and verify:

```text
Request
→ generated email
→ expected recipient
→ expected recovery link/event
```

The current take-home automation validated recovery UI responses, not inbox delivery.

### Authenticated gate

Use a dedicated automation account with controlled credentials, a controlled MFA mechanism, and read-only backend validation access. Credentials and connection configuration belong in protected CI secrets/environment variables and never in source control.

### Dynamic boundary data

DOB boundary data must be calculated relative to the execution date:

- One day younger than 18 → rejected.
- Exactly 18 → passes the age gate.

The test must not hard-code a birth year.

### Password data

Use representative synthetic passwords for each business rule. These values are test data, not real credentials, and should be hidden from Cypress command logs where appropriate.

### Cleanup principle

Synthetic data should be realistic enough to exercise production business rules, but isolated enough that it cannot be confused with real customer/member data.

## 6. Product Quality Gates

### Runnable Product Quality Gate

The normal Cypress gate validates representative public Login, Registration, password-policy, and Recovery behavior. Its primary business-rule boundary is:

- 17 years, 364 days → rejected.
- Exactly 18 → passes the age gate.

Current implementation:

- Command: `npm run automation:gate`
- Tests: 18
- Validated result: 18/18 passing

### Environment-Dependent Authenticated Gate

The authenticated gate represents this requirement:

```text
Successful authentication
→ controlled MFA
→ backend Last Login update observable within the configured timeout
→ corresponding audit record exists
```

Command: `npm run automation:authenticated-gate`

It remains separate because the assessment did not supply valid automation credentials, controlled MFA, backend credentials, or implemented database adapter/schema details. It is architectural coverage and was intentionally not executed.

## 7. Representative Automated Coverage

| Area | Normal Gate Tests |
|---|---:|
| Login | 2 |
| Registration | 5 |
| Password | 7 |
| Recovery | 4 |
| **Total** | **18** |

Separate from the blocking normal gate:

- 1 known-defect test for invalid DOB validation.
- 1 environment-dependent authenticated quality-gate spec.

## 8. Known Defect That Was Discovered By Automation

Impossible DOB input:

```text
13 / 40 / 2020
```

Expected readable validation:

> Please enter a valid value in each field to complete this date format: MM DD YYYY.

Observed through automation:

- The DOB validation alert becomes visible.
- It has `role="alert"`.
- It has `aria-live="polite"`.
- Meaningful readable validation content can be absent or replaced by non-meaningful zero-width content.

The automated test asserts the intended correct behavior and fails when the defect occurs. It remains outside the blocking Product Quality Gate so the test does not redefine broken behavior as correct, while one tracked defect does not make the normal gate permanently unusable.

This finding is limited to the observed product behavior; no specific WCAG violation is claimed without a formal accessibility audit.

## 9. CI/CD Validation Strategy

The submission uses GitHub Actions.

For normal push and pull-request validation:

```text
npm run automation:gate
→ blocking
→ npm run automation:known-defects
→ visible and non-blocking
```

For a manually requested, fully provisioned environment:

```text
npm run automation:authenticated-gate
```

Workflow concurrency prevents overlapping runs for the same branch/ref where possible, reducing unnecessary load against staging. Secrets are supplied through protected CI configuration rather than committed files. The npm commands are CI-provider independent and could be orchestrated by Azure Pipelines without changing the Cypress implementation.

## 10. Exit / Acceptance Criteria

The normal Product Quality Gate is successful when:

- All 18 blocking automation tests pass.
- Required business-rule boundaries pass, including the age-18 boundary.
- No new blocking regression is detected.

Known defects remain separately visible and tracked. Their assertions should continue to represent correct expected behavior rather than being changed to accept a defect.

The environment-dependent authenticated/backend validation should become part of the blocking integration gate once controlled credentials, MFA, read-only backend access, and the supported adapter implementation are provisioned.
