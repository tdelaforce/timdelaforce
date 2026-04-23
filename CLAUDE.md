# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured.

## Stack

- **Next.js 16.2.4** — App Router, no Pages Router usage
- **React 19.2.4**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss`, not `tailwind.config.js`
- **Framer Motion 12** — used for page/section transitions
- **Prisma** — ORM for PostgreSQL (Supabase)
- **Clerk** — auth for customer and admin sessions
- **Upstash Redis** — rate limiting via `@upstash/ratelimit`
- **Twilio** — SMS OTP
- **Resend** — email OTP + transactional email
- **Anthropic SDK** — claude-sonnet-4-20250514, server-side only
- No external state management; context only

## Architecture

This is a personal portfolio site. The entire site is a single client component (`app/page.tsx`) that renders one of two layouts depending on whether a section is active:

1. **Hero view** — centered name + nav buttons
2. **Layout view** — left sidebar with nav + right content pane

Section content is rendered inline inside `page.tsx` except for "The Word" and "Plating", which delegate to their own components.

**i18n pattern:** There is no i18n library. All copy is stored as a typed `Record<Lang, {...}>` constant (`t`) at the top of each component file. `Lang = 'en' | 'es'`. The active language comes from `LanguageContext` (`app/context/LanguageContext.tsx`) via the `useLang()` hook. `LanguageToggle` is rendered globally in `layout.tsx` above `{children}`.

When adding new sections or copy, follow the same `t` object pattern: define both `en` and `es` keys, consume via `useLang()`.

**"The Word" section** (`app/components/TheWord.tsx`) renders a list of biblical diagram cards. Selecting a card renders the matching component in a pane to the right. Currently only one diagram exists: `SalvationDiagram` (`app/components/SalvationDiagram.tsx`). New diagrams follow the same pattern: add an entry to the `diagrams` record (both languages), add a new component, and render it conditionally on `selectedDiagram.id`.

**`SalvationDiagram`** is a fully self-contained interactive component. All verse text, explainer copy, and stage definitions live as static data at the top of the file. Clicking a scripture reference opens a modal with KJV text and an explainer paragraph.

**"Plating" section** (`app/components/Plating/`) is an embeddable AI chatbot for metal finishing companies. It handles general questions, quote intake, OTP verification, and lead capture. See full design doc: `docs/plating-chatbot-design.md`.

## Plating Chatbot — Key Rules

- The Anthropic API key is **never** in client code. All AI calls go through `/app/api/chat/route.ts` only.
- `/api/pricing/estimate` is the **single source of truth** for pricing. Chat, admin, and any future tools all call this endpoint. Do not inline pricing logic elsewhere.
- Admin routes (`/admin/*`, `/api/admin/*`) require a Clerk session with `metadata.role === "admin"`. Middleware enforces this.
- Every quote state change must write an `AuditLog` row. No exceptions.
- The bot **never** delivers a customer-facing quote autonomously. Quotes require internal approval before being sent.

## Plating Chatbot — Route Structure

```
app/
├── (public)/plating/         — embedded chat widget
├── (admin)/admin/            — internal quote review dashboard
├── (customer)/portal/        — customer account portal
└── api/
    ├── chat/route.ts         — Claude AI endpoint (server-side only)
    ├── otp/send/route.ts     — dispatch OTP via SMS or email
    ├── otp/verify/route.ts   — verify OTP code
    ├── leads/route.ts        — lead capture / user creation
    ├── pricing/estimate/     — pricing service (stub in v1)
    ├── quotes/               — quote CRUD + PO intake
    └── admin/                — admin actions (approve, reject, send)
```

## Plating Chatbot — Current Phase

**Phase 1 — Foundation**
- [ ] Prisma schema + Supabase migration
- [ ] Clerk setup (customer + admin roles)
- [ ] `/api/chat` route with system prompt + conversation persistence
- [ ] Anonymous session tracking + 3-message threshold
- [ ] Lead capture flow
- [ ] OTP send + verify (Twilio SMS + Resend email)
- [ ] User creation + verification on OTP success

## Plating Chatbot — Environment Variables

```
DATABASE_URL=
ANTHROPIC_API_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_APP_URL=
QUOTES_EMAIL=                 # configurable per deployment
ANON_MESSAGE_THRESHOLD=3      # messages before lead capture prompt
```

## Styling conventions

Inline `style` objects (typed as `React.CSSProperties`) are used throughout — not Tailwind utility classes. Global CSS (`app/globals.css`) only does a CSS reset and sets `background-color: #0F1923` on `body`. Tailwind is available but currently unused in components.

Color palette (defined by convention, not a shared token file):
- Background dark: `#0F1923`
- Sidebar: `#1C2B3A`
- Body text: `#8A99A8`
- Headings / primary text: `#F0EDE8`
- Accent (links, active states): `#C9883A`