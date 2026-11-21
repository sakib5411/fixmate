# FixMate — Client (Next.js)

FixMate is an on-demand device & home appliance repair service platform. Verified technicians
list the repair services they offer, customers send a repair request and track the job step by
step, and payment is collected online **only after the job is completed**.

This repository is the **client** (Next.js App Router). The REST API lives in the companion
`fixmate-server` repository (Express + MongoDB + BetterAuth + Stripe).

## Live links

| | URL |
|---|---|
| Live site | _add your Vercel deployment URL here_ |
| Server repository | _add your GitHub link here_ |
| Client repository | _add your GitHub link here_ |

## Test accounts

All seeded accounts use the password **`Fixmate1234`**.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.dev` | `Fixmate1234` |
| Technician | `rafiq@fixmate.dev` | `Fixmate1234` |
| Technician | `karim@fixmate.dev` | `Fixmate1234` |
| Customer | `customer@fixmate.dev` | `Fixmate1234` |
| Customer | `ayesha@fixmate.dev` | `Fixmate1234` |

## Purpose

People struggle to find a trustworthy repair technician, and after handing over a device they
have no idea what is happening with the job. FixMate gives every job a clear, trackable status
and makes payment happen only after the work is delivered.

**Three stakeholders**

- **Customer** — browses approved services, sends repair requests, cancels while still
  *requested*, tracks the job, and pays for completed jobs through Stripe.
- **Technician** — adds and manages services (with ImgBB image upload), accepts/rejects
  requests, moves jobs through the pipeline and sets the final amount.
- **Admin** — approves/rejects services, manages users and roles, monitors every booking and
  tracks Stripe revenue.

## Key features

### Public
- Sticky navbar with active-route highlighting, role-aware avatar dropdown and mobile menu.
- Landing page: hero with search, 6 latest approved services, 4-step "How FixMate works",
  7 popular category cards, trust points, testimonials and a CTA band.
- Browse services with **server-side** search / category & service-mode filters / price & newest
  sorting and pagination — all state lives in the URL, so filters survive a reload and
  `/services?category=AC` opens pre-filtered.
- Service details with technician summary (photo, area, bio) and a role-gated repair request form.
- Custom 404, error boundary and loading states; toast notifications for every action.

### Authentication
- BetterAuth email + password sign up / sign in (with Google optional).
- Role selection at sign up (Customer / Technician) — admin cannot be self-selected.
- Password rules enforced in the UI and by the auth server.
- JWT (BetterAuth `jwt` plugin) attached as `Authorization: Bearer …` to every private API call.
- Private dashboard routes redirect signed-out visitors to `/sign-in`, and a user opening
  another role's dashboard is redirected to their own. Sessions survive reloads.

### Customer dashboard
- Overview stats (total requests, active jobs, completed jobs, spend) + monthly chart + status
  breakdown.
- My bookings with status & payment badges, a visual job timeline, cancel confirmation (only
  while *requested*) and Pay Now (only when *completed* + *unpaid*).
- Payment history from the `payments` collection.

### Technician dashboard
- Overview stats (services, approved, pending requests, earnings) + earnings chart.
- Add service with ImgBB file upload → saved as `pending` for admin review.
- My services: full CRUD, availability toggle, approval badges.
- Manage requests: accept / reject / start work / mark completed (with final amount), status filter.

### Admin dashboard
- Overview: users, technicians, pending services, revenue, revenue & booking charts.
- Manage users with role changes (own role locked).
- Service approval queue (pending first) with filters.
- All bookings (read-only, filterable) and all transactions with total revenue.

### Payments
- Stripe Checkout in test mode, amount always read from the database.
- `/payment/success` verifies the Checkout Session server-side, then saves the payment and marks
  the booking paid; `/payment/cancel` changes nothing.
- A webhook on the server records the same payment safely (idempotent), so a payment is never
  stored twice.

## Tech stack & npm packages

| Area | Packages |
|---|---|
| Framework | `next` 16 (App Router), `react` 19, `typescript` |
| Styling | `tailwindcss` 4 (`@tailwindcss/turbopack`) |
| Auth | `better-auth` (browser client + JWT plugin) |
| UI / icons | `lucide-react`, `sonner` (toasts) |
| Data | native `fetch` + a small `useApi` hook |
| Charts | hand-built SVG/CSS charts (no chart dependency) |

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Point it at the deployed API in production. No secret keys are stored in the client.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

The API must be running (see the `fixmate-server` README) and seeded so the site looks complete:
2 technicians, 13 approved services across all categories, and bookings in every status.

## Project structure

```
src/
├── app/
│   ├── (public)/            # home, services, service details, about, auth
│   ├── dashboard/           # shared shell + customer / technician / admin / profile
│   ├── payment/             # success & cancel
│   ├── not-found.tsx · error.tsx · loading.tsx
├── components/              # site chrome, services, dashboard, ui, providers
└── lib/                     # api client, auth client, types, constants, helpers
```
