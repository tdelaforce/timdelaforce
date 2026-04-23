# the metal finishing company AI Chatbot — Design & Scaffold

---

## 1. Assumptions

**Business**
- the metal finishing company is the company. Internal quote reviewer is Tim (tdelaforce@hmplating.com).
- One internal reviewer role for v1. Multi-reviewer routing is a later problem.
- Pricing logic exists as a prototype artifact. That logic will be migrated to TypeScript server-side. No real pricing numbers will be hardcoded here.
- "Verbal PO" means the customer says they want to proceed but gives no formal PO document. We generate an internal reference ID.
- A quote being "sent" means delivered to the customer by email or SMS after internal approval. The bot never sends quotes autonomously.
- Drawings come in via email (tdelaforce@hmplating.com) for v1. File upload in the chat widget is a later phase.

**Technical**
- Next.js App Router (not Pages Router).
- PostgreSQL via Supabase for v1. Prisma as ORM.
- Auth: Clerk for v1. Handles customer and admin sessions cleanly. Simple to set up on Vercel.
- SMS OTP: Twilio Verify.
- Email OTP + transactional email: Resend.
- AI: Anthropic Claude (claude-sonnet-4-20250514) via server-side API route only. API key never exposed to client.
- File storage: Supabase Storage for v1 (later phase — not needed until file upload lands).
- The embedded chat widget lives inside timdelaforce.com (Next.js) as the Plating section. It can also be iframe-embedded on yourcompany.com later.
- Admin dashboard is a protected route within the same Next.js app: /admin/*.
- Customer portal is a protected route: /portal/*.
- Rate limiting: Upstash Redis + @upstash/ratelimit on API routes.

**Scope**
- v1 ships: chat widget + quote intake + OTP + admin review queue + basic customer portal.
- Customer portal auth (Clerk) and full PO tracking are v1 but can be simplified.
- Pricing engine is a stub/placeholder in v1. Real logic migrates in v2.
- No file upload in v1. Drawings via email only.

---

## 2. PRD

### Problem
the metal finishing company handles quote requests and general metal finishing questions over phone and email. It's slow, inconsistent, and loses leads. A smart chatbot on the website can capture leads 24/7, qualify intent, collect quote details, and route them to internal review.

### Users

| User | Goal |
|------|------|
| Anonymous visitor | Get a quick answer, maybe request a quote |
| Verified customer | Track quotes, submit POs, review history |
| Internal admin (Tim) | Review quote requests, approve/send quotes, manage customers |

### Core Features — v1

**Chat Widget**
- Answers general plating questions using Claude with a metal finishing system prompt
- Tracks anonymous message count; prompts lead capture after configurable threshold (default: 3 messages)
- Collects name, company, phone, email, preferred contact method
- Sends OTP via SMS or email; verifies before continuing
- Detects quote intent and switches to structured intake flow
- If no dimensions: tells user to email drawings, logs request as `awaiting_drawings`
- If dimensions present: calls pricing service, creates draft quote, flags for internal review
- Conversation history persisted per verified user

**Admin Dashboard** (`/admin`)
- Clerk-protected, admin role only
- Quote review queue (status: `pending_review`)
- Per-quote view: customer info, intake details, AI estimate, ability to edit price/notes/terms
- Approve → triggers quote delivery to customer
- Reject → logs reason, notifies customer
- Customer profile view: contact info, all quotes, all POs, conversation history
- Audit trail on every state change

**Customer Portal** (`/portal`)
- Clerk-protected, customer role
- Account overview
- Quote list + status
- PO submission against approved quote
- Conversation history

### Out of Scope — v1
- Multi-reviewer routing
- File upload in chat
- Real production pricing logic
- Multi-language (Spanish toggle deferred)
- Mobile app

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App (Vercel)                  │
│                                                          │
│  /app                                                    │
│  ├── (public)/plating         ← chat widget UI           │
│  ├── (customer)/portal        ← customer portal          │
│  ├── (admin)/admin            ← admin dashboard          │
│  └── api/                                                │
│      ├── chat/route.ts        ← Claude AI endpoint       │
│      ├── quotes/              ← quote CRUD               │
│      ├── pricing/estimate     ← pricing service          │
│      ├── otp/send             ← OTP dispatch             │
│      ├── otp/verify           ← OTP verification         │
│      ├── leads/               ← lead capture             │
│      └── admin/               ← admin actions            │
│                                                          │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    Supabase      Twilio       Resend
    (Postgres +   (SMS OTP)    (Email OTP +
     Storage)                   Transactional)
         │
       Clerk
    (Auth / Sessions)
         │
    Upstash Redis
    (Rate limiting)
         │
    Anthropic API
    (Claude — server-side only)
```

### Key Architectural Decisions

**One shared pricing service.**
`POST /api/pricing/estimate` is the single pricing source of truth. The chat widget calls it. The admin dashboard calls it. The future internal calculator calls it. The prototype artifact logic migrates here as TypeScript in v2.

**Claude is server-side only.**
The API key never touches the client. All AI requests go through `/api/chat`. The system prompt, conversation history, and pricing calls are assembled server-side.

**Stateful conversation via DB.**
Each message is stored. The server reconstructs conversation context from DB on each request. No client-side state management for chat history.

**OTP via Twilio Verify (SMS) or Resend (email).**
User picks their preference. OTP codes expire in 10 minutes. Max 3 attempts before lockout.

**Clerk for auth.**
Handles customer and admin sessions. Admin role set via Clerk metadata. Avoids building auth from scratch.

**Rate limiting on all public API routes.**
Upstash Redis + @upstash/ratelimit. Sliding window. Chat endpoint: 20 req/min per IP for anonymous, 60/min for verified.

---

## 4. Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USER & COMPANY ───────────────────────────────────────

model User {
  id                String        @id @default(cuid())
  clerkId           String?       @unique   // set after Clerk account created
  email             String?       @unique
  phone             String?
  fullName          String?
  preferredContact  ContactMethod @default(EMAIL)
  isVerified        Boolean       @default(false)
  role              UserRole      @default(CUSTOMER)
  companyId         String?
  company           Company?      @relation(fields: [companyId], references: [id])
  conversations     Conversation[]
  quoteRequests     QuoteRequest[]
  purchaseOrders    PurchaseOrder[]
  otpCodes          OtpCode[]
  auditLogs         AuditLog[]
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

model Company {
  id        String   @id @default(cuid())
  name      String
  users     User[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  CUSTOMER
  ADMIN
}

enum ContactMethod {
  EMAIL
  SMS
}

// ─── OTP ──────────────────────────────────────────────────

model OtpCode {
  id        String        @id @default(cuid())
  userId    String
  user      User          @relation(fields: [userId], references: [id])
  code      String
  method    ContactMethod
  expiresAt DateTime
  attempts  Int           @default(0)
  verified  Boolean       @default(false)
  createdAt DateTime      @default(now())
}

// ─── CONVERSATION & MESSAGES ──────────────────────────────

model Conversation {
  id           String    @id @default(cuid())
  userId       String?
  user         User?     @relation(fields: [userId], references: [id])
  sessionId    String    @unique  // anonymous session ID until verified
  anonMsgCount Int       @default(0)
  messages     Message[]
  quoteRequest QuoteRequest?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  role           MessageRole
  content        String       @db.Text
  metadata       Json?        // e.g. { type: "quote_intake_step", step: "dimensions" }
  createdAt      DateTime     @default(now())
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// ─── QUOTE REQUEST ────────────────────────────────────────

model QuoteRequest {
  id               String           @id @default(cuid())
  conversationId   String           @unique
  conversation     Conversation     @relation(fields: [conversationId], references: [id])
  userId           String?
  user             User?            @relation(fields: [userId], references: [id])
  status           QuoteStatus      @default(QUOTE_INTAKE_IN_PROGRESS)

  // Intake fields
  fullName         String?
  companyName      String?
  phone            String?
  email            String?
  preferredContact ContactMethod?
  partDescription  String?          @db.Text
  dimensions       String?          @db.Text
  quantity         Int?
  material         String?
  platingType      String?
  turnaround       String?
  notes            String?          @db.Text
  hasDrawings      Boolean?

  estimate         QuoteEstimate?
  quote            Quote?
  drawingRefs      DrawingReference[]
  auditLogs        AuditLog[]
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
}

enum QuoteStatus {
  NEW_LEAD
  AWAITING_VERIFICATION
  QUOTE_INTAKE_IN_PROGRESS
  AWAITING_DRAWINGS
  PENDING_REVIEW
  APPROVED
  SENT
  WON
  LOST
  PO_RECEIVED
  IN_PROGRESS
  COMPLETED
}

// ─── QUOTE ESTIMATE (AI / Pricing Service Output) ─────────

model QuoteEstimate {
  id             String       @id @default(cuid())
  quoteRequestId String       @unique
  quoteRequest   QuoteRequest @relation(fields: [quoteRequestId], references: [id])
  estimatedPrice Float?
  currency       String       @default("USD")
  breakdown      Json?        // line items from pricing service
  pricingVersion String?      // version of pricing engine used
  createdAt      DateTime     @default(now())
}

// ─── QUOTE (Admin-Approved, Customer-Facing) ──────────────

model Quote {
  id             String        @id @default(cuid())
  quoteRequestId String        @unique
  quoteRequest   QuoteRequest  @relation(fields: [quoteRequestId], references: [id])
  finalPrice     Float
  currency       String        @default("USD")
  terms          String?       @db.Text
  notes          String?       @db.Text
  turnaround     String?
  approvedById   String?       // Clerk user ID of admin who approved
  approvedAt     DateTime?
  sentAt         DateTime?
  expiresAt      DateTime?
  purchaseOrders PurchaseOrder[]
  auditLogs      AuditLog[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

// ─── PURCHASE ORDER ───────────────────────────────────────

model PurchaseOrder {
  id              String    @id @default(cuid())
  quoteId         String
  quote           Quote     @relation(fields: [quoteId], references: [id])
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  customerPoNumber String?  // provided by customer
  internalRef     String    @unique  // generated if no customer PO number
  source          PoSource  @default(PORTAL)
  status          PoStatus  @default(RECEIVED)
  notes           String?   @db.Text
  auditLogs       AuditLog[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum PoSource {
  EMAIL
  SMS
  PORTAL
}

enum PoStatus {
  RECEIVED
  ACKNOWLEDGED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// ─── DRAWING REFERENCES ───────────────────────────────────

model DrawingReference {
  id             String       @id @default(cuid())
  quoteRequestId String
  quoteRequest   QuoteRequest @relation(fields: [quoteRequestId], references: [id])
  fileUrl        String?      // Supabase Storage URL — v2
  emailReceived  Boolean      @default(false)
  notes          String?
  createdAt      DateTime     @default(now())
}

// ─── AUDIT LOG ────────────────────────────────────────────

model AuditLog {
  id             String        @id @default(cuid())
  userId         String?
  user           User?         @relation(fields: [userId], references: [id])
  quoteRequestId String?
  quoteRequest   QuoteRequest? @relation(fields: [quoteRequestId], references: [id])
  quoteId        String?
  quote          Quote?        @relation(fields: [quoteId], references: [id])
  purchaseOrderId String?
  purchaseOrder  PurchaseOrder? @relation(fields: [purchaseOrderId], references: [id])
  action         String        // e.g. "quote.approved", "otp.verified", "quote.sent"
  metadata       Json?
  performedById  String?       // Clerk user ID of who did the action
  createdAt      DateTime      @default(now())
}

// ─── NOTIFICATION LOG ────────────────────────────────────

model NotificationLog {
  id        String           @id @default(cuid())
  userId    String?
  method    ContactMethod
  type      String           // e.g. "otp", "quote_sent", "quote_approved"
  status    NotificationStatus @default(PENDING)
  provider  String?          // "twilio" | "resend"
  metadata  Json?
  createdAt DateTime         @default(now())
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
}
```

### Schema Notes

- `QuoteRequest` is the raw intake record. `Quote` is the clean, admin-approved record the customer sees. Keeping them separate gives you a clean audit boundary.
- `QuoteEstimate` stores what the pricing service returned. `Quote` stores what the admin approved. Those two numbers may differ — that's intentional.
- `Conversation.sessionId` tracks anonymous users. When they verify, `userId` gets linked.
- `AuditLog` is a flat append-only table. Every meaningful state change writes a row. You'll thank yourself for this in 6 months.
- No `NotificationLog` foreign keys to keep it simple — it's a log, not a relational entity.

---

## 5. User Flows

### 5a. General Question (Anonymous → Verified)

```
User opens chat widget
  → Sends message
  → API checks: session anonymous? msg count < threshold?
    → YES: Claude answers. Increment anonMsgCount.
    → NO (threshold hit): Bot says "To keep going, I need a little info from you."
        → Collect: name, company, phone/email, preferred contact
        → Send OTP via preferred method
        → User enters code
          → Verified: link Conversation to User, continue chat
          → Failed (3x): lock session, prompt to try again later
```

### 5b. Quote Request

```
User expresses quote intent (detected by Claude or explicit)
  → Bot switches to intake mode
  → Collects fields step by step (not all at once):
      1. Name, company, contact info (if not already verified)
      2. What part? Rough description.
      3. Dimensions? (yes/no)
         → NO:
            "Send your drawings to tdelaforce@hmplating.com — include your name and company.
             I'll log this request and someone will follow up."
            → Create QuoteRequest (status: AWAITING_DRAWINGS)
            → Capture/verify contact if not done
            → Done
         → YES:
            4. Quantity
            5. Material
            6. Plating type
            7. Turnaround
            8. Special notes
  → Call POST /api/pricing/estimate with intake data
  → Create QuoteEstimate
  → Create QuoteRequest (status: PENDING_REVIEW)
  → Notify admin (email via Resend)
  → If user not yet verified: run OTP flow
  → Bot: "Got it. Your request is in review. I'll reach out once a quote is ready."
```

### 5c. OTP Flow

```
User provides phone or email
  → POST /api/otp/send
      → Twilio Verify (SMS) or Resend (email)
      → Create OtpCode record (expires 10 min)
  → User enters code
  → POST /api/otp/verify
      → Check code, expiry, attempt count
      → On success: mark User.isVerified = true, link to Conversation
      → On failure (3x): lock OtpCode, return error
```

---

## 6. Admin Flows

### 6a. Quote Review

```
Admin logs in → /admin
  → Sees queue: QuoteRequests with status PENDING_REVIEW
  → Clicks a request:
      → Sees customer info, conversation, intake data, AI estimate
      → Can edit: finalPrice, terms, notes, turnaround
      → Actions:
          → Approve: creates Quote, sends to customer via preferred method
                     status → APPROVED → SENT
                     AuditLog row written
          → Reject: logs reason, notifies customer
                     status → LOST
                     AuditLog row written
```

### 6b. Customer Lookup

```
Admin searches by name, company, email, or phone
  → Customer profile shows:
      → Contact info + verification status
      → All conversations
      → All quote requests + quotes
      → All POs
      → Audit trail
```

### 6c. PO Tracking

```
Customer submits PO via portal (or admin logs it manually)
  → PO linked to Quote
  → If no customer PO number: generate customer_verbal_generated_<cuid>
  → Status: RECEIVED → ACKNOWLEDGED → IN_PROGRESS → COMPLETED
  → AuditLog on each transition
```

---

## 7. API Routes (Next.js App Router)

```
app/api/
├── chat/
│   └── route.ts              POST — main chat endpoint (Claude + conversation mgmt)
│
├── otp/
│   ├── send/route.ts         POST — send OTP via SMS or email
│   └── verify/route.ts       POST — verify OTP code
│
├── leads/
│   └── route.ts              POST — capture lead info, create/update User + Company
│
├── pricing/
│   └── estimate/route.ts     POST — call pricing engine, return estimate
│
├── quotes/
│   ├── route.ts              GET (list for portal) | POST (create request)
│   └── [id]/
│       ├── route.ts          GET (detail)
│       └── po/route.ts       POST — submit PO against quote
│
└── admin/
    ├── quotes/
    │   ├── route.ts          GET — queue (pending_review)
    │   └── [id]/
    │       ├── route.ts      GET (detail) | PATCH (edit)
    │       ├── approve/route.ts   POST — approve + send
    │       └── reject/route.ts    POST — reject
    ├── customers/
    │   ├── route.ts          GET — search
    │   └── [id]/route.ts     GET — full profile
    └── pos/
        └── route.ts          GET — PO list/search
```

**All `/admin/*` routes**: middleware checks Clerk session + admin role. Return 403 if not admin.
**All `/api/chat` and public routes**: rate-limited via Upstash.

---

## 8. UI Structure

### 8a. Embedded Chat Widget (`/app/(public)/plating/`)

**Components:**
```
ChatWidget/
├── ChatWidget.tsx            — outer shell, handles open/close state
├── ChatMessages.tsx          — scrollable message list
├── ChatMessage.tsx           — single message bubble (user | assistant)
├── ChatInput.tsx             — text input + send button
├── LeadCaptureForm.tsx       — name/company/phone/email/contact pref form
├── OtpVerificationForm.tsx   — OTP entry + resend
├── QuoteIntakeFlow.tsx       — step-by-step quote intake (state machine)
└── StatusBanner.tsx          — "Your quote is in review" etc.
```

**States the widget handles:**
- `idle` → `chatting` → `lead_capture` → `otp_pending` → `verified_chatting`
- `quote_intake` sub-states: `collecting_dimensions` | `awaiting_drawings` | `estimate_pending` | `submitted`

### 8b. Admin Dashboard (`/app/(admin)/admin/`)

```
admin/
├── page.tsx                  — dashboard home / quote queue
├── quotes/
│   ├── page.tsx              — full queue with filters/sort
│   └── [id]/page.tsx         — quote detail: intake, estimate, edit, approve/reject
├── customers/
│   ├── page.tsx              — search
│   └── [id]/page.tsx         — customer profile + all history
└── pos/
    └── page.tsx              — PO list + status filters
```

**Quote detail page sections:**
1. Customer info + verification badge
2. Intake summary (all collected fields)
3. AI estimate (read-only, from pricing service)
4. Admin edit panel (final price, terms, notes, turnaround)
5. Action bar: Approve / Reject
6. Audit trail (append-only list of events)
7. Conversation inspector

### 8c. Customer Portal (`/app/(customer)/portal/`)

```
portal/
├── page.tsx                  — overview: name, company, verification status
├── quotes/
│   ├── page.tsx              — quote list + statuses
│   └── [id]/page.tsx         — quote detail + PO submission form
└── history/
    └── page.tsx              — conversation history
```

---

## 9. Third-Party Services

| Need | Service | Why |
|------|---------|-----|
| Auth | **Clerk** | Fast setup, handles customer + admin roles, Vercel-native |
| SMS OTP | **Twilio Verify** | Purpose-built OTP, handles delivery + verification API |
| Email OTP + transactional | **Resend** | Simple API, React Email templates, generous free tier |
| Database | **Supabase (PostgreSQL)** | Managed Postgres, Vercel integration, easy to start |
| Rate limiting | **Upstash Redis** | Serverless-native, pairs with @upstash/ratelimit |
| File storage (v2) | **Supabase Storage** | Already in stack, no new vendor |
| AI | **Anthropic (claude-sonnet)** | You're already using it |

---

## 10. Phased Implementation Plan

### Phase 1 — Foundation (Week 1–2)
- [ ] Supabase project + Prisma schema + migrations
- [ ] Clerk setup: customer + admin roles
- [ ] Basic chat API route (Claude, system prompt, conversation persistence)
- [ ] Anonymous session tracking + threshold logic
- [ ] Lead capture form in widget
- [ ] OTP send + verify (Twilio SMS + Resend email)
- [ ] User creation + verification on OTP success

### Phase 2 — Quote Intake (Week 3–4)
- [ ] Quote intent detection in Claude system prompt
- [ ] QuoteIntakeFlow component (step-by-step)
- [ ] No-drawings path (log + notify)
- [ ] Pricing service stub (`/api/pricing/estimate`)
- [ ] QuoteRequest + QuoteEstimate creation
- [ ] Admin notification via Resend on new `pending_review` quote
- [ ] Upstash rate limiting on public routes

### Phase 3 — Admin Dashboard (Week 5–6)
- [ ] Admin middleware (Clerk role check)
- [ ] Quote review queue
- [ ] Quote detail + edit + approve/reject
- [ ] Quote delivery (email or SMS on approval)
- [ ] Customer profile view
- [ ] Audit logging on all state changes

### Phase 4 — Customer Portal + PO (Week 7–8)
- [ ] Portal pages (overview, quotes, history)
- [ ] PO submission form
- [ ] PO creation + internal ref generation
- [ ] PO status tracking
- [ ] Polish: status banners, empty states, error handling

### Phase 5 — Pricing Engine Migration (Post-v1)
- [ ] Migrate prototype artifact logic to TypeScript
- [ ] Wire real pricing rules to `/api/pricing/estimate`
- [ ] Admin override still available
- [ ] Version pricing calls in QuoteEstimate.pricingVersion

---

## 11. Code Scaffolding

### `/app/api/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { ratelimit } from "@/lib/ratelimit";
import { getAnonymousThreshold } from "@/lib/config";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a knowledgeable metal finishing salesman for Metal Finishing Co.
You answer questions about metal finishing, plating, coatings, and related topics.
Be direct, helpful, and plainspoken. Not corporate. Not robotic.
Sound like someone who has actually been in the plating business.

When a user wants a quote or mentions pricing, dimensions, quantities, or "how much" — switch to quote intake mode.
In quote intake mode, collect information one step at a time. Do not dump a list of questions.

If the user does not have drawings or dimensions, tell them to email drawings to tdelaforce@hmplating.com.

Never tell the customer a final price. You gather information. Pricing gets reviewed internally before anything goes to the customer.`;

export async function POST(req: NextRequest) {
  const { sessionId, message, conversationId } = await req.json();

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  // Get or create conversation
  let conversation = conversationId
    ? await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    : await prisma.conversation.create({
        data: { sessionId, messages: { create: [] } },
        include: { messages: true },
      });

  if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

  // Check anonymous threshold
  const threshold = getAnonymousThreshold(); // default 3
  if (!conversation.userId && conversation.anonMsgCount >= threshold) {
    return NextResponse.json({ requiresLeadCapture: true, conversationId: conversation.id });
  }

  // Store user message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "USER", content: message },
  });

  // Build message history for Claude
  const history = conversation.messages.map((m) => ({
    role: m.role === "USER" ? "user" : "assistant" as "user" | "assistant",
    content: m.content,
  }));
  history.push({ role: "user", content: message });

  // Call Claude
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: history,
  });

  const assistantContent = response.content[0].type === "text" ? response.content[0].text : "";

  // Store assistant message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: "ASSISTANT", content: assistantContent },
  });

  // Increment anon message count
  if (!conversation.userId) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { anonMsgCount: { increment: 1 } },
    });
  }

  return NextResponse.json({ reply: assistantContent, conversationId: conversation.id });
}
```

### `/app/api/otp/send/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSmsOtp, sendEmailOtp } from "@/lib/notifications";
import { addMinutes } from "date-fns";
import { randomInt } from "crypto";

export async function POST(req: NextRequest) {
  const { userId, method } = await req.json(); // method: "EMAIL" | "SMS"

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const code = randomInt(100000, 999999).toString();
  const expiresAt = addMinutes(new Date(), 10);

  await prisma.otpCode.create({
    data: { userId, code, method, expiresAt },
  });

  if (method === "SMS" && user.phone) {
    await sendSmsOtp(user.phone, code);
  } else if (method === "EMAIL" && user.email) {
    await sendEmailOtp(user.email, code);
  } else {
    return NextResponse.json({ error: "No contact info for selected method" }, { status: 400 });
  }

  return NextResponse.json({ sent: true });
}
```

### `/app/api/otp/verify/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, code } = await req.json();

  const otp = await prisma.otpCode.findFirst({
    where: { userId, verified: false, code },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  if (new Date() > otp.expiresAt) return NextResponse.json({ error: "Code expired" }, { status: 400 });
  if (otp.attempts >= 3) return NextResponse.json({ error: "Too many attempts" }, { status: 400 });

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { verified: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  return NextResponse.json({ verified: true });
}
```

### `/app/api/pricing/estimate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

// STUB: Replace with real pricing logic in v2
// This is the single source of truth for pricing.
// The chat widget, admin dashboard, and any future tools all call this endpoint.

export interface PricingInput {
  platingType: string;
  dimensions?: string;
  quantity?: number;
  material?: string;
  turnaround?: string;
  specialHandling?: string;
}

export interface PricingOutput {
  estimatedPrice: number | null;
  currency: string;
  breakdown: Record<string, number | string>;
  pricingVersion: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  const input: PricingInput = await req.json();

  // TODO: Replace this stub with real logic migrated from the prototype artifact
  const estimate: PricingOutput = {
    estimatedPrice: null,
    currency: "USD",
    breakdown: {
      base: "TBD",
      quantity_adjustment: "TBD",
      turnaround_adjustment: "TBD",
    },
    pricingVersion: "0.0.1-stub",
    note: "Pricing engine is in development. Admin will set final price.",
  };

  return NextResponse.json(estimate);
}
```

### `/lib/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### `/lib/ratelimit.ts`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  analytics: true,
});
```

### `/lib/notifications.ts`

```typescript
import twilio from "twilio";
import { Resend } from "resend";

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSmsOtp(phone: string, code: string) {
  await twilioClient.messages.create({
    body: `Your Metal Finishing Co verification code is: ${code}. Expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

export async function sendEmailOtp(email: string, code: string) {
  await resend.emails.send({
    from: "Metal Finishing Co <noreply@yourcompany.com>",
    to: email,
    subject: "Your verification code",
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>Expires in 10 minutes.</p>`,
  });
}

export async function notifyAdminNewQuote(quoteRequestId: string) {
  await resend.emails.send({
    from: "Metal Finishing Co Bot <noreply@yourcompany.com>",
    to: "tdelaforce@hmplating.com",
    subject: "New quote request ready for review",
    html: `<p>A new quote request is ready for review.</p>
           <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/quotes/${quoteRequestId}">Review it here</a></p>`,
  });
}
```

### `/lib/config.ts`

```typescript
export function getAnonymousThreshold(): number {
  return parseInt(process.env.ANON_MESSAGE_THRESHOLD ?? "3", 10);
}
```

### `.env.example`

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
NEXT_PUBLIC_APP_URL=http://localhost:3000
ANON_MESSAGE_THRESHOLD=3
```

### Middleware (`/middleware.ts`)

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPortalRoute = createRouteMatcher(["/portal(.*)"]);
const isAdminApi = createRouteMatcher(["/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) || isAdminApi(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId || sessionClaims?.metadata?.role !== "admin") {
      return new Response("Forbidden", { status: 403 });
    }
  }
  if (isPortalRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/(.*)"],
};
```

---

## What's Not in This Doc (Next Steps)

1. **ChatWidget TSX component** — the full UI component with state machine. Ready to build once architecture is locked.
2. **Admin dashboard pages** — quote queue, detail view, approve/reject UI.
3. **Customer portal pages** — account, quote list, PO submission.
4. **Pricing engine migration** — requires review of the prototype artifact logic first.
5. **Spanish language toggle** — deferred per original scope.
6. **File upload in chat** — deferred to v2. Email flow is sufficient for v1.