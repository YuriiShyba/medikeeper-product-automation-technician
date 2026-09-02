# Product Automation Technician Take-Home

This submission includes Cypress automation for the supplied login and onboarding portal, a Product Quality Gate and CI workflow, practical product-validation documentation, and a small Vue 3 Automated Test Case Manager CRUD application.

## Repository Structure

```text
cypress/
├── e2e/          # Login, registration, password, recovery, and separate gate specs
├── pages/        # Page Object Model actions
├── constants/    # Selectors, expected text, rules, and test values
├── support/      # Cypress setup and shared helpers
└── tasks/        # Node-side backend integration contract

docs/
├── product-validation-plan.md
├── assumptions-and-limitations.md
└── strategic-recommendations.md

test-case-manager/       # Vue 3 + TypeScript CRUD application
.github/workflows/       # Product Quality Gate CI workflow
```

## Cypress Automation

The normal executable suite provides focused, risk-based coverage:

- Login: 2 tests
- Registration: 5 tests
- Password: 7 tests
- Recovery: 4 tests
- Total normal Product Quality Gate: 18 tests

Install the root dependencies and run the normal gate:

```bash
npm install
npm run automation:gate
```

The normal gate was manually validated as **18/18 passing**.

Run the separately tracked known-defect suite with:

```bash
npm run automation:known-defects
```

This suite contains the invalid-DOB validation test. It asserts the intended product behavior and remains visible but intentionally non-blocking.

The environment-dependent authenticated gate is available as:

```bash
npm run automation:authenticated-gate
```

It demonstrates the intended architecture for successful authentication, controlled MFA, Last Login backend validation, and login-audit validation. It was **not executed** because the assessment environment did not provide automation credentials, controlled MFA, backend access, or an environment-specific database adapter. See [Assumptions and Limitations](docs/assumptions-and-limitations.md) for details.

## Product Quality Gate / CI

GitHub Actions is included. For normal pushes and pull requests:

- The normal automation gate is blocking.
- The known-defect suite runs afterward and remains visible but non-blocking.
- The authenticated gate is separate and environment-dependent.

The npm commands are intentionally CI-provider independent.

## Documentation

- [Product Validation Plan](docs/product-validation-plan.md) — validation strategy, UI-to-backend integrity approach, synthetic data, and quality gates.
- [Assumptions and Limitations](docs/assumptions-and-limitations.md) — executed versus environment-dependent coverage and assessment constraints.
- [Strategic Recommendations](docs/strategic-recommendations.md) — automatable Acceptance Criteria, stable selectors, and structured Elastic business-event telemetry.

## Automated Test Case Manager

[`test-case-manager/`](test-case-manager/) contains a small Vue 3 + TypeScript CRUD application demonstrating the requested Automated Test Case Manager.

Implemented fields:

- Test Name
- Script Path
- Priority
- Created By, included as a small additional demo field

Implemented behavior includes Create, Read, Priority updates, Delete, duplicate Script Path prevention, localStorage persistence, and a custom accessible delete-confirmation dialog.

localStorage was intentionally selected to keep the demo self-contained and statically deployable without backend infrastructure. Records are local to the current browser and are not shared persistence.

### Run the CRUD App

```bash
cd test-case-manager
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Known Finding

Automation identified an invalid calendar DOB case where the validation alert can become visible without meaningful readable content. The concise defect context is documented in the [Product Validation Plan](docs/product-validation-plan.md#8-known-defect-that-was-discovered-by-automation).

## Notes

- Synthetic test data was used throughout the executable assessment coverage.
- No real customer/member credentials or data are included.
- Environment-dependent authenticated and backend validation is clearly separated from executed tests.
