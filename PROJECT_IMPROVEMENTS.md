# Project Improvements & Suggested Features

This file lists recommended improvements, features, and development tasks you can add to the Title-Forge project (frontend and backend). Items are grouped by area, prioritized, and include short rationale and a suggested effort level.

---

## How to use this list

- High priority = implement soon (critical for correctness, security, or UX).
- Medium = important but not blocking.
- Low = nice-to-have or future improvements.
- Effort: S (small), M (medium), L (large)

---

## Frontend

1. Environment / Build

   - Ensure all public client env vars use `VITE_` prefix (Vite requirement). (High, S)
   - Add a `.env.example` with required keys for local setup (VITE_RAZORPAY_KEY_ID, VITE_BACKEND_DOMAIN, etc.). (High, S)

2. Payment UX & Safety

   - Add a client-side confirmation modal before opening payment checkout. (High, S)
   - Add better error handling & UI messages for payment failures (display backend message). (High, S)
   - Validate amounts & plan IDs on the client to avoid accidental wrong payments. (High, S)

3. Authentication & State

   - Persist minimal user state and show plan/credit balance on the pricing page. (Medium, S)
   - Improve loading/fallback UI when `userData` is not available (graceful anonymous flow). (Medium, S)

4. Testing

   - Add unit tests for `Pricing.jsx` using Jest + React Testing Library; mock the `useUser` hook and Razorpay interaction. (High, M)
   - Add simple E2E tests with Playwright or Cypress to test sign-in and a full payment flow (mock external calls in CI). (Medium, L)

5. Accessibility & Internationalization

   - Run an a11y audit and fix issues (aria labels, focus states). (Medium, M)
   - Prepare strings for i18n (use react-intl or i18next) if you plan to support other locales. (Low, M)

6. Performance & UX

   - Lazy-load non-critical components and reduce bundle size. (Medium, M)
   - Add a small analytics event when users click "Get started" (track conversions). (Medium, S)

7. Developer Experience
   - Add ESLint + Prettier config and a pre-commit hook (husky) to auto-format. (High, S)
   - Consider converting to TypeScript for safer props and state (Long term). (Low, L)

---

## Backend

1. Payments

   - Add idempotency checks for payment creation endpoints to avoid duplicate orders. (High, M)
   - Store and validate webhook events from Razorpay (webhook secret verification). (High, M)
   - Ensure `RAZORPAY_KEY_ID` exposed to frontend is the public key; `RAZORPAY_KEY_SECRET` stays on server. (High, S)
   - Add retries/robust error handling when creating Razorpay orders (handle network/timeouts). (Medium, S)

2. Security

   - Move secrets to a secure store in production (AWS Secrets Manager / HashiCorp / environment on deployment platform). (High, M)
   - Add rate limiting and stricter validation on payment endpoints (already partially present—review config). (High, S)
   - Ensure CORS is properly configured to only allow the frontend domain. (High, S)

3. Webhooks & Verification

   - Add a dedicated `/webhook/razorpay` endpoint to accept asynchronous payment events and reconcile state (use signature verification). (High, M)
   - Use webhooks to update payment status rather than relying only on client-side verification. (High, M)

4. Testing & CI

   - Add unit tests for the payment controller functions (mock Razorpay SDK). (High, M)
   - Add integration tests for the full payment flow with mocks and test keys. (Medium, L)
   - Add GitHub Actions workflow for lint/test/build. (High, S)

5. Observability

   - Add structured logging (winston/pino) and log request IDs for tracing. (Medium, S)
   - Add Sentry (or similar) for error tracking and performance monitoring. (Medium, S)

6. Data & DB

   - Add retention & backup strategy for MongoDB. (Medium, M)
   - Add indexes on frequent query fields (userId, merchantOrderId). (High, S)

7. Production Readiness
   - Add health-check endpoints and readiness probes. (High, S)
   - Add Dockerfile and a minimal `docker-compose` to run app + mongo + redis locally. (Medium, M)

---

## Shared / Cross-cutting

1. Documentation

   - Add `README` sections describing the payment flow (client & server), env variables, and how to test payments locally (test keys + webhook replay). (High, S)
   - Add `CONTRIBUTING.md` with setup steps and code style. (Medium, S)

2. CI / Deployment

   - Add GitHub Actions to run tests and lint on PRs and build artifacts. (High, S)
   - Add a simple Vercel/Heroku deploy guide and environment variable checklist. (High, S)

3. Monitoring & Analytics

   - Add basic analytics (GA4 or Plausible) and track key events: sign up, login, plan purchase, payment success/failure. (Medium, S)

4. Privacy & Compliance
   - Add a privacy policy stub and ensure no sensitive data (card details) is logged. (High, S)

---

## Small Improvements / Nice-to-have

- Implement subscription management (cancellations, upgrades/downgrades, prorations). (Low, L)
- Add referral or coupon codes for promotions. (Low, M)
- Implement an admin dashboard to view payments and user subscriptions. (Medium, M)

---

## Quick verification checklist (after changes)

- [ ] Restart backend dev server after editing `.env` or package.json and reinstall dependencies.
- [ ] Restart Vite dev server after adding/updating `VITE_` env variables.
- [ ] Test a sandbox Razorpay payment (use test keys) and verify `verifyRazorpayPayment` flow.
- [ ] Confirm `fetch-payments` returns user's payment history.
- [ ] Run lint and unit tests (if added).

---

## Prioritized immediate next steps (top 5)

1. Add `.env.example` and document required env variables. (High, S)
2. Add webhook endpoint + verify signature + reconcile payment state. (High, M)
3. Add unit tests for payment controller and pricing component (mocks). (High, M)
4. Add `RAZORPAY_KEY_ID` usage verification and ensure `VITE_RAZORPAY_KEY_ID` exists in frontend `.env`. (High, S)
5. Add GitHub Actions to run lint/tests on PRs. (High, S)

---

If you want, I can implement any of the above items now — for example:

- Create `.env.example` files for frontend and backend
- Add a Razorpay webhook endpoint and controller
- Add a GitHub Actions workflow for tests
- Add unit tests for `Pricing.jsx` and the payment controller

Tell me which item to start with and I'll add a short todo and implement it.
