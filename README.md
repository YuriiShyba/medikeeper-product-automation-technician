# Product Automation Take-Home

This project contains the approved Cypress/TypeScript quality gates for the unauthenticated MediKeeper take-home experience.

## Commands

- `npm run automation:gate` — the 18 normal runnable tests.
- `npm run automation:known-defects` — the intentionally separate invalid-DOB requirement test.
- `npm run automation:authenticated-gate` — the provisioned-account/backend contract; it fails clearly until the required environment and adapter are supplied.
- `npm run typecheck` — TypeScript validation.

The normal gate uses synthetic data only. The authenticated gate is intentionally excluded from normal CI and must not be run without controlled credentials, MFA, and a deliberately implemented backend adapter.
