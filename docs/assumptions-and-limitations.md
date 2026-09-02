# Assumptions and Limitations

## 1. Purpose

This document records the assumptions made during the assessment and the limitations of the supplied environment. Its purpose is to distinguish validation that was implemented and executed from integration coverage that requires additional provisioned access.

## 2. Environment Assumptions

- The supplied take-home portal was treated as the source of truth for observable application behavior.
- The minimum registration age is treated as 18 based on observed portal behavior and boundary testing.
- No separate product requirements document or detailed business-rules specification was supplied.
- Observed behavior is documented as evidence from this environment; undocumented behavior is not presented as an official product requirement.
- Where backend details were unavailable, the implementation used generic backend concepts rather than guessing internal MediKeeper schema or infrastructure.
- GitHub Actions was selected for the submission CI implementation.
- The npm automation commands are CI-provider independent and could also be run by another CI system, such as Azure Pipelines.

## 3. Access Limitations

The assessment environment did not provide the capabilities required for full authenticated and backend integration validation:

- Provisioned valid automation login credentials.
- A controlled MFA mechanism suitable for automation.
- Backend or database credentials.
- Confirmed database technology, schema, or table mappings.
- An implemented environment-specific database adapter.
- A provisioned positive-registration identity or Member ID that could complete registration.
- A controlled mailbox or mail sink for actual recovery-email validation.

Because those capabilities were unavailable, this take-home does not claim execution of:

- Successful login through MFA.
- Successful account creation.
- UI-to-database registration persistence validation.
- Backend Last Login validation.
- Login audit-event validation.
- Actual recovery-email delivery.

These are environment constraints on the assessment coverage, not findings about product quality.

## 4. Test-Data Constraints

The implementation intentionally avoided:

- Real customer or member data.
- Real user credentials.
- Production-like personal information.
- Guessing or directly manipulating internal database records.

Public negative and recovery scenarios used clearly synthetic values. Where email delivery was not being tested, reserved `.invalid` addresses provided valid-format inputs without targeting a real mailbox.

Positive persistent workflows in a fully provisioned environment should use controlled, disposable test identities created through supported test-data mechanisms. Those identities should be traceable, isolated from real customer/member records, and subject to an agreed cleanup policy.

## 5. Authenticated Quality-Gate Limitation

The repository contains an environment-dependent authenticated quality-gate design. It demonstrates the intended Cypress UI flow and Node-side backend validation architecture, but it was intentionally not executed in the supplied environment.

Enabling the gate requires:

- A dedicated automation account.
- A controlled MFA mechanism.
- Read-only backend credentials.
- An environment-specific database adapter and confirmed schema mapping.
- A stable authenticated-state selector/configuration.

Once provisioned, the gate is intended to validate:

```text
Successful authentication
→ Last Login becomes observable within the configured threshold
→ corresponding audit event exists
```

The implemented design uses 2 seconds as the example observation threshold. This value is configuration for the proposed quality gate, not evidence that backend validation ran successfully or that 2 seconds is an independently confirmed product requirement.

## 6. Known Product Defect

An impossible DOB such as `13 / 40 / 2020` can produce a visible validation alert without meaningful readable validation text.

The behavior is covered by a separate known-defect test. The test asserts the intended correct validation message, remains visible but non-blocking in CI, and does not redefine the broken behavior as the expected result. No specific accessibility-standard violation is claimed without a formal accessibility audit.

## 7. Out of Scope

This take-home does not claim exhaustive validation of:

- Every registration input combination.
- Every MFA method.
- Account-lock recovery after repeated failed logins.
- Actual email deliverability.
- Security penetration testing.
- Formal accessibility compliance.
- Performance or load testing.
- Full cross-browser or mobile compatibility.
- Production database behavior.

The 18-test normal gate is focused, risk-based automation coverage of representative public login, onboarding, password, and recovery behavior. It is not a complete regression suite.

## 8. Fully Provisioned Environment

With a controlled test identity, controlled MFA, read-only backend adapter/access, and controlled mail sink, the existing strategy could be extended to support:

- Execution of the authenticated Product Quality Gate.
- UI-to-backend persistence validation.
- Actual recovery-email verification.
- Positive end-to-end registration coverage.

These extensions would build on the existing separation between browser-based product actions and Node-side integration checks while preserving synthetic-data isolation.