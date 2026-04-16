# Compass — Build Progress

Last updated: 2026-04-16

---

## What Compass Is

Internal operations OS for UUL Global — 100-day post-acquisition integration tracker. Covers task management, financial pulse, strategic pillar health, sales pipeline, risks, decisions, and an AI assistant powered by Claude.

**Stack:** Next.js 15 (App Router), Supabase (Postgres + Drizzle ORM), Tailwind, Claude API (Anthropic).

---

## Page Inventory

| Route | Status | Purpose |
|---|---|---|
| `/` | ✅ Live | Command center — hero, timeline, my queue, needs attention, task health, financial pulse, pillars |
| `/chat` | ✅ Live | Full-page Compass AI workspace |
| `/pipeline` | ✅ Live | Sales pipeline — demand signals, fulfillment, carrier contracts |
| `/decisions` | ✅ Live | Decision log — meetings, gates, outcomes |
| `/risks` | ✅ Live | Risk registry linked to tasks and workstreams |
| `/people` | ✅ Live | Board, executive team, team directory, operating entities |
| `/tasks/[id]` | ✅ Live | Task detail — meetings, activities, comments, action items |
| `/plan` | ✅ Live | Phase/kanban task manager (linked from homepage) |
| `/my-tasks` | ✅ Live | Personal task queue (linked from homepage) |
| `/admin` | ✅ Live | Admin — feedback triage + AI usage dashboard (tabbed) |
| `/value-gains` | ✅ Live (nav hidden) | Value initiatives — pending Finance page to replace |
| `/finance` | ❌ Not built | Needs Jerry spec |
| `/knowledge` | ❌ Not built | RAG over UUL Brain vault — needs indexer + spec |

**Current nav:** `Home | Compass AI | Decisions | Value Gains | Pipeline | Risks | People`

**Jerry's target nav (Sprint 2):** `Home | Pipeline | Finance | Risks | Decisions | Knowledge | People | Admin`

---

## AI / Compass AI

Accessible via floating button (every page) and `/chat`. Both surfaces share the same `ChatBody` component.

**Capabilities:**
- Answer questions about tasks, risks, initiatives, decisions
- Create/update tasks, risks, initiatives via staged draft/confirm cards
- Analyze meeting transcripts — extract and stage action items
- Conversation history persisted to DB (30-message window)

**Mode system:** On open, user picks a focused mode (New Task / Log Risk / Analyze Meeting / Status Check / General). Mode is locked for the conversation — controls which context data is fetched and which tools are sent to Claude, reducing token cost by 40–80% vs general mode.

**Token optimizations shipped:**
- Compact JSON in system prompt (was pretty-printed — ~25% savings)
- Prompt caching (`cache_control: ephemeral`) on system message (~60% cost reduction on cache hits)
- Mode-gated context fetching (only fetch what the mode needs)
- Mode-filtered tool list (3–7 tools sent vs 17 in general)
- `ai_usage` table logs tokens + estimated cost per query, visible in Admin → AI Usage

**Key files:**
- `src/lib/ai/system-prompt.ts` — context builder
- `src/lib/ai/tools.ts` — tool definitions + `getToolsForMode()`
- `src/app/api/ai/chat/route.ts` — agentic loop, streaming, token logging
- `src/components/ai/chat-body.tsx` — shared mode picker, messages, input
- `src/components/ai/chat-panel.tsx` — slide-in panel chrome
- `src/app/(dashboard)/chat/page.tsx` — full-page chrome

---

## Data Layer

Server-side async getters in `src/lib/data/index.ts` → Supabase via Drizzle ORM. Pages are RSCs that pass data down to `"use client"` components.

**Hardcoded/demo (not yet wired):**
- Financial Pulse metrics, Strategic Pillar scorecard (`src/lib/data/demo/metrics.ts`)
- Sales pipeline (`src/lib/data/demo/sales.ts`)

---

## Backlog

### Near-term (unblocked)

- [ ] **Nav overhaul** — atomic swap to Jerry's target nav once Finance + Knowledge + Admin pages exist
- [ ] **Financial Pulse: wire Value Captured** — `valueInitiatives.capturedImpactCents` is live in DB, just needs getter wired

### Medium-term (needs spec)

- [ ] **Finance page** (`/finance`) — absorbs Value Gains; needs Jerry layout spec; Cash/AR/Capital Fronted metrics need manual-entry `dashboard_kpis` table or accounting integration
- [ ] **Knowledge page** (`/knowledge`) — RAG over UUL Brain vault; depends on pgvector indexer being deployed
- [ ] **Homepage Strategic Pillars** — partial DB wiring possible (Vendor from `carrier_contracts`, Regional from `offices`); rest needs `pillar_overrides` table
- [ ] **Sales pipeline: real data** — schemas exist, need getter functions wired

### Long-term

- [ ] Xero/QuickBooks integration for live Financial Pulse
- [ ] Pallet.AI pricing integration
- [ ] CRM (Copper) integration
- [ ] PWA install prompt
- [ ] Supabase Realtime for live updates
- [ ] Mobile-optimized layout

---

## Design Tokens

```
Background cards:   bg-[#131b2d]
Card hover:         bg-[#171f32]
Active/selected:    bg-[#1a2744]
Blue accent:        text-[#b4c5ff]
Gold accent:        text-[#dfc299]
Border standard:    border-slate-700/40
Border subtle:      border-slate-800/50
Progress bar fill:  bg-[#b4c5ff]
Progress bar track: bg-[#171f32]
```

---

## Infrastructure

- **Compass** (this repo): David owns — Vercel + Supabase (separate from Orbit)
- **Orbit** (Jerry's): separate repo + Vercel + Supabase under `jerryshimax/` GitHub org
- DB env vars: `DATABASE_URL` (pooled) + `DIRECT_URL` (direct, for migrations)
