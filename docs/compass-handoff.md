# UUL Compass — Technical Handoff Document

**Prepared for:** David Wu (Engineer)
**Prepared by:** Jerry Shi
**Date:** April 1, 2026
**Repo:** https://github.com/jerryshimax/uul-compass
**Status:** Phase 1 complete — ready for design improvement + Vercel deployment

---

## 1. What Is Compass?

**UUL Compass** is the post-merger command center and operational OS for UUL Global. It serves two purposes:

1. **100-Day PMI Tracker** — Board members, C-suite, and department heads track the post-merger integration plan. Tasks, milestones, decisions, and action items are all visible and assignable.

2. **Operational Data Platform** — The unified database for all UUL Global logistics operations. Connects data across offices (US, China, Hong Kong), feeds the Pallet AI quoting engine, and eventually becomes the backbone of an AI-first logistics company (AIOS vision).

### Key Users (First 8)

| Name | Role | Access Level | Notes |
|------|------|-------------|-------|
| Jerry Shi | Owner & Board Chair | Full admin | Primary stakeholder |
| Alic Ge (葛总) | Board Director | Full | **Mobile-only user** — critical constraint |
| Billy | Board Director | Full | |
| Season | Board Director, Finance | Full | |
| Jason Likens | CEO, US Operations | Full | |
| Josh Foster | COO, US Operations | Full | |
| Serena Lin (林静) | CFO | Full (especially Finance) | |
| David Wu | Engineer | Full admin | You — responsible for deployment + design |

### Key Constraints

- **Mobile-first** — Alic (葛总) only uses his phone. Every screen must work perfectly on mobile.
- **PWA** — Must be installable on phone home screen (iOS + Android).
- **English UI** — Navigation, buttons, labels in English. Content fields accept Chinese + English.
- **Docker-ready** — Vercel for dev/staging now. Production deployment later on a China-accessible cloud node (HK or mainland).
- **Multi-entity** — 4 sister companies in one database: UUL Global, Meihang (美航), Star Navigation (星航), Sage Line.

---

## 2. What's Been Built (Phase 1)

### Tech Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| Language | TypeScript (strict) | 5.x |
| UI | React + Tailwind + shadcn/ui | React 19, Tailwind 4 |
| Charts | Recharts | 3.x |
| Database | Supabase (Postgres + Auth + Realtime) | Not yet connected |
| ORM | Drizzle ORM | 0.45.x |
| Auth | Supabase Auth (magic link + Google SSO) | Middleware ready, bypassed for dev |
| Hosting | Vercel (planned) | Not yet deployed |
| PWA | Web App Manifest | Basic manifest in place |
| Email Notifications | Resend (planned) | Phase 4 |

### Pages Built

| Page | Route | Description | Status |
|------|-------|-------------|--------|
| Dashboard | `/` | Hero progress card, 4 KPI cards, milestones, activity feed | Demo data |
| 100-Day Plan | `/plan` | Kanban board with 5 columns, 22 real tasks from board meetings | Demo data |
| Decisions | `/decisions` | 4 board meetings with all decisions listed | Demo data |
| Settings | `/settings` | Team directory (8 members), entity list | Demo data |
| Login | `/login` | Magic link auth page | UI only, not connected |

**All pages currently use hardcoded demo data.** Supabase connection is the next step to make it live.

### Design System

- **Sidebar:** Dark navy (`#0F172A` range), grouped navigation (Main / Operations / System)
- **Topbar:** Sticky with backdrop blur, "System Online" indicator, Day counter pill, notification bell, user avatar
- **Cards:** Subtle shadows, hover lift effect, gradient hero card
- **Colors:** Navy primary, teal accent, emerald/amber/red for status indicators
- **Mobile:** Bottom tab navigation (Home, Plan, Decisions, Settings), responsive card layouts

### Database Schema (Drizzle ORM)

Phase 1 schema files are in `src/db/schema/`:

| File | Tables | Purpose |
|------|--------|---------|
| `enums.ts` | 20+ enums | All status/type enumerations |
| `org.ts` | entities, offices, departments, users, contacts, user_entity_access | Organization structure |
| `pmi.ts` | pmi_workstreams, pmi_milestones, pmi_tasks | 100-Day Plan tracker |
| `communication.ts` | activities, comments, meeting_notes, action_items | Activity feed + decisions |
| `integration.ts` | integration_logs, audit_log | External system sync + audit trail |

**Total Phase 1 tables:** ~15
**Total planned tables (all phases):** 47 across 12 domains

The full schema design covers: Organization, Customers/CRM, Carriers, Quotation/Pricing, Shipments, Customs/Compliance, Finance, 3PL Warehousing, Documents, PMI, Communication, Integration.

### File Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx          — Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                 — Dashboard shell (sidebar + topbar + bottom nav)
│   │   ├── page.tsx                   — Dashboard home
│   │   ├── plan/page.tsx              — 100-Day Plan Kanban
│   │   ├── decisions/page.tsx         — Decision log
│   │   └── settings/page.tsx          — Team + entity management
│   ├── layout.tsx                     — Root layout (fonts, metadata)
│   ├── page.tsx                       — Root redirect to dashboard
│   └── globals.css                    — Theme variables (navy palette)
├── components/
│   ├── plan/
│   │   ├── kanban-board.tsx           — Kanban board with 5 status columns
│   │   └── task-card.tsx              — Individual task card component
│   ├── shared/
│   │   ├── sidebar.tsx                — Dark navy desktop sidebar
│   │   ├── topbar.tsx                 — Sticky topbar with blur
│   │   ├── bottom-nav.tsx             — Mobile bottom navigation
│   │   └── nav-items.ts              — Navigation item definitions
│   └── ui/                            — shadcn/ui components (15 components)
├── db/
│   ├── schema/                        — Drizzle ORM schema files
│   │   ├── enums.ts
│   │   ├── org.ts
│   │   ├── pmi.ts
│   │   ├── communication.ts
│   │   ├── integration.ts
│   │   └── index.ts
│   └── index.ts                       — Database client
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  — Browser Supabase client
│   │   ├── server.ts                  — Server Supabase client
│   │   └── middleware.ts              — Auth session middleware
│   └── utils.ts                       — Utility functions (cn)
└── middleware.ts                       — Next.js middleware (auth bypassed for dev)

Other files:
├── Dockerfile                         — Multi-stage Docker build
├── docker-compose.yml                 — Docker Compose for deployment
├── drizzle.config.ts                  — Drizzle ORM configuration
├── public/manifest.json               — PWA manifest
└── .env.local.example                 — Environment variable template
```

---

## 3. What Needs to Be Done — Immediate (David's Tasks)

### Task A: Deploy to Vercel (Priority: HIGH)

**Goal:** Get a public URL so Jerry can share the demo with board members.

Steps:
1. Go to [vercel.com](https://vercel.com), import the GitHub repo `jerryshimax/uul-compass`
2. Deploy — it should work out of the box (no env vars needed for the demo since data is hardcoded)
3. Set up custom domain: `compass.uulglobal.com` (or a temporary Vercel subdomain is fine for now)
4. Verify the deployment works on mobile (test on phone)

**No Supabase needed for this step.** The demo works with hardcoded data.

### Task B: Improve UI Design (Priority: HIGH)

**Goal:** Make the dashboard look professional and premium. Current design is functional but needs polish.

Design requirements:
- **Keep the dark navy sidebar** — this is the brand direction
- **Mobile-first** — every change must look great on iPhone (390px width)
- **Professional, clean, modern** — think Linear, Vercel Dashboard, Notion level of polish
- **Maritime/logistics feel** — navy + teal color palette already set, build on it
- **Data density** — board members want to see a lot of information at a glance without clutter

Specific areas to improve:
1. **Dashboard page (`/`)** — The hero progress card, KPI cards, milestones list, and activity feed. Consider better chart visualizations (Recharts is installed).
2. **Kanban board (`/plan`)** — Task cards need better visual hierarchy. Consider drag-and-drop (future). Add task detail modal on click.
3. **Typography** — Ensure consistent heading hierarchy, font weights, spacing rhythm.
4. **Micro-interactions** — Smooth transitions, hover states, loading skeletons.
5. **Empty states** — Design proper empty states for when there's no data.
6. **Color consistency** — Status colors (overdue = red, in progress = blue, done = green) should be consistent everywhere.

Tools available:
- Tailwind 4 (all utility classes)
- shadcn/ui (15 components installed, can add more via `npx shadcn@latest add [component]`)
- Recharts (for charts/visualizations)
- Lucide React (icon library, already installed)

### Task C: Set Up Supabase (Priority: MEDIUM — after A & B)

**Goal:** Connect real database so the app is interactive (create/edit/delete tasks, real auth).

Steps:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the project URL + anon key + database URL
3. Create `.env.local` from `.env.local.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
   ```
4. Run `npx drizzle-kit push` to create all tables in Supabase
5. Enable auth middleware in `src/middleware.ts` (uncomment the `updateSession` call)
6. Run the seed script to populate initial data (entities, users, departments, workstreams, tasks)
7. Replace hardcoded demo data in pages with Supabase queries via Server Actions

### Task D: PWA Enhancement (Priority: MEDIUM)

**Goal:** Make the app installable on phone with proper icons and offline support.

Steps:
1. Create app icons: `icon-192.png` and `icon-512.png` (Compass logo, navy background)
2. Install `@serwist/next` for service worker support
3. Configure offline caching for already-loaded pages
4. Test "Add to Home Screen" on iOS Safari and Android Chrome

---

## 4. Full Project Vision — The Big Picture

### The 4 Phases

| Phase | Timeline | What Ships | Key Deliverable |
|-------|----------|-----------|----------------|
| **Phase 1** | Week 1-2 (NOW) | Foundation + PMI Tracker | Board can see and interact with the 100-day plan |
| **Phase 2** | Week 3-4 | Carriers + Quotes + Customers | Rate card tool for Marco, Pallet AI integration surface |
| **Phase 3** | Week 5-7 | Shipments + Finance | Full shipment lifecycle, AR/AP tracking, cash flow dashboard |
| **Phase 4** | Week 8-12 | Full OS + Integrations | GDrive sync, email/TG notifications, calendar, PDF export |

### Database Architecture (47 Tables, 12 Domains)

```
Domain 1:  Organization & People     — entities, offices, departments, users, contacts
Domain 2:  Customer & CRM            — customers, sales_pipeline, customer_sops
Domain 3:  Carrier Management        — carriers, contracts, lanes, rates, performance
Domain 4:  Quotation & Pricing       — quote_requests, quotes, quote_line_items
Domain 5:  Shipment Lifecycle        — shipments, containers, milestones, charges, exceptions, D&D
Domain 6:  Customs & Compliance      — customs_entries, tariff_classifications, compliance_docs
Domain 7:  Finance                   — vendors, invoices, payments, vendor_bills, GL, KPIs
Domain 8:  3PL / Warehouse Vendors   — warehouse_vendors, warehouse_bookings
Domain 9:  Documents                 — universal document registry (GDrive links)
Domain 10: PMI / 100-Day Plan        — workstreams, milestones, tasks
Domain 11: Communication             — activities, comments, meeting_notes, action_items
Domain 12: Integration & Audit       — integration_logs, audit_log, user_entity_access
```

### Entity Relationship Overview

```
entities (UUL, 美航, 星航, Sage Line)
    │
    ├── customers → quote_requests → quotes → shipments
    │                                   ↑         │
    ├── carriers → carrier_rates ───────┘         ├── containers, milestones
    │            → contracts, lanes               ├── charges (buy/sell)
    │                                             ├── customs_entries
    │                                             ├── invoices → payments
    │                                             └── vendor_bills
    ├── pmi_workstreams → milestones → tasks
    └── activities, comments (polymorphic)
```

### Pallet AI Integration

UUL is piloting with [Pallet](https://www.pallet.com/) — an AI logistics workforce platform. The pricing module is 95% complete. Compass provides the structured data that Pallet needs:

- `carrier_rates` — buy rates by carrier × lane × mode × container type
- `customer_sops` — customer-specific pricing rules and procedures
- `quotes` + `quote_line_items` — structured quote data with origin/freight/destination breakdown
- `shipment` data — for track & trace, document processing, billing automation

**Ultimate vision:** Compass = structured data foundation → Pallet AI operates on it → 90% AI-driven logistics company.

### The 100-Day Plan Purpose

The 100-day plan is not just project management. It's a **knowledge extraction system**:

1. **Structure the company's architecture** — department capabilities, collaboration mechanisms, supply workflows
2. **Quantify SOPs + extract tribal knowledge** — especially from Alic (葛总) and Marco, who hold critical operational knowledge in their heads
3. **Build the database** — every piece of operational data becomes structured, queryable, and AI-readable

### Notification System (Phase 4)

Dual-channel notifications:
- **Email (primary):** Task assignments, due dates, overdue alerts, new decisions → sent to user's email with deep links back to Compass
- **Telegram Group (sync):** Same notifications pushed to UUL work group chat via Cloud bot

---

## 5. Auth & Permissions

### Role Hierarchy

| Role | Dashboard | PMI | Shipments | Quotes | Finance | People |
|------|-----------|-----|-----------|--------|---------|--------|
| Owner (Jerry) | Full | Full | Full | Full | Full | Full |
| Board (Alic, Billy, Season) | Full | Full | Full | Full | Full | Full |
| Executive (Jason, Josh, Serena) | Full | Full | Full | Full | Full* | Full |
| Dept Head | Dept view | Dept R/W | Dept | Dept | — | Dept |
| Member | Dept view | Own tasks | Assigned | Assigned | — | Dept |

*Serena (CFO) gets full Finance access.

### Auth Flow

- **Primary:** Magic link (email link, no password)
- **Secondary:** Google SSO (for US team on Google Workspace)
- **Invitation-only:** No self-registration. Jerry invites users via admin panel.
- **Session:** 7-day refresh tokens (board members shouldn't re-auth daily)

### Row Level Security (RLS)

Every table has `entity_id` for data isolation:
- Users only see rows from entities they have access to (via `user_entity_access` table)
- Finance tables have additional restriction: only owner/board/executive/finance roles
- Admin role bypasses entity isolation for cross-entity reporting

---

## 6. Environment Setup

### Prerequisites

- Node.js 22+
- npm (not pnpm — pnpm is not installed on this machine)

### Local Development

```bash
git clone https://github.com/jerryshimax/uul-compass.git
cd uul-compass
npm install
npm run dev
# Open http://localhost:3000
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Docker Deployment

```bash
docker compose up --build
# App runs on port 3000
```

The Dockerfile uses multi-stage builds with Next.js standalone output for minimal image size.

---

## 7. Design Reference

### Current Color Palette

| Element | Value | Usage |
|---------|-------|-------|
| Primary (Navy) | `oklch(0.35 0.12 250)` | Sidebar bg, buttons, headings |
| Accent (Teal) | `oklch(0.75 0.15 195)` | Active states, links, accent highlights |
| Background | `oklch(0.985 0.002 250)` | Page background (very light blue-gray) |
| Card | `#ffffff` | Card backgrounds |
| Sidebar | `oklch(0.18 0.04 250)` | Dark navy sidebar |
| Destructive | Red | Overdue, critical, errors |
| Success | Emerald green | Completed, on-time, healthy |
| Warning | Amber | At risk, delayed |

### Status Color System

| Status | Dot | Badge BG | Badge Text |
|--------|-----|----------|------------|
| Critical | `bg-red-500` | `bg-red-50` | `text-red-700` |
| High | `bg-orange-500` | `bg-orange-50` | `text-orange-700` |
| Medium | `bg-sky-500` | `bg-sky-50` | `text-sky-700` |
| Low | `bg-slate-400` | `bg-slate-50` | `text-slate-600` |
| In Progress | `bg-sky-500` | `bg-sky-50` | `text-sky-700` |
| At Risk | `bg-amber-500` | `bg-amber-50` | `text-amber-700` |
| Completed | `bg-emerald-500` | `bg-emerald-50` | `text-emerald-700` |
| Blocked | `bg-red-500` | `bg-red-50` | `text-red-700` |

### Workstream Colors

| Workstream | Color |
|-----------|-------|
| Finance Integration | `#ef4444` (Red) |
| Operations Consolidation | `#f97316` (Orange) |
| Sales Engine | `#3b82f6` (Blue) |
| Brand & Marketing | `#8b5cf6` (Purple) |
| Technology & AI | `#06b6d4` (Cyan) |
| Organization & HR | `#22c55e` (Green) |

---

## 8. Contacts

| Person | Role | Reach |
|--------|------|-------|
| Jerry Shi | Owner, project lead | Telegram, email |
| David Wu | Engineer (you) | — |
| Alic Ge (葛总) | Board, key stakeholder | Telegram (mobile only) |
| Jason Likens | CEO US, using the system | Email |

---

*This document was generated on April 1, 2026. For the latest architecture details, see the plan file at `~/.claude/plans/splendid-tumbling-leaf.md` in the repo owner's machine, or review the Drizzle schema files in `src/db/schema/`.*
