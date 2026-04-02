# UUL Compass — CEO Briefing

**Prepared for:** Jason Likens, CEO  
**Date:** April 2, 2026  
**Status:** Phase 1 Demo Complete, Deployment In Progress

---

## What Is Compass?

Compass is UUL Global's **post-merger integration command center and operational OS**. It serves two purposes:

### 1. 100-Day Integration Tracker

From Day 1 (April 1) through Day 100 (July 10), every integration workstream, task, milestone, and deadline lives in one system. Board members, C-suite, and department leads can all see progress in real time.

We've already extracted **22 key tasks** from recent board syncs, organized across 6 workstreams:

| Workstream | Focus Areas |
|-----------|-------------|
| **Finance Integration** | VP Finance hiring, AR collection, receivables factoring |
| **Operations Consolidation** | Carrier contract consolidation, entity alignment, Shenzhen warehouse expansion |
| **Sales Engine** | Target Account List, DataMine API, new customer development |
| **Brand & Marketing** | Corporate brochure refresh, marketing partner onboarding |
| **Technology & AI** | Compass platform, Pallet AI quoting integration |
| **Organization & HR** | CEO/COO announcements, team structure |

Each task has a priority level (Critical / High / Medium / Low), owner, deadline, and status. The Kanban board gives instant visibility into what's on track, what's blocked, and what's overdue.

### 2. Operational Data Hub

Long-term, Compass becomes UUL's unified operations platform:

- **Customer profiles & sales pipeline** — CRM for all entities
- **Carrier management** — contracts, lanes, rate cards across UUL, Meihang, and Star Navigation
- **Quoting system** — origin, ocean freight, and destination cost breakdown
- **Shipment lifecycle tracking** — booking through delivery and POD
- **Financial dashboards** — AR/AP aging, cash flow, KPI trends
- **Meeting decisions & action items** — board resolution tracking

All data is entity-isolated (UUL, Meihang, Star Navigation, Sage Line) with role-based access controls.

---

## What's Built Today

The Phase 1 demo includes 5 pages:

**Dashboard** — Hero progress card showing 100-day completion percentage, KPI cards (active workstreams, overdue items, this week's milestones, blocked items), and a recent activity feed.

**100-Day Plan (Kanban)** — Five-column board: To Do, In Progress, Blocked, Review, Done. All 22 tasks visible with workstream color coding, priority indicators, deadlines, and assignee avatars.

**Decisions** — Full record of board meeting decisions from March 23 through March 31, including new sales rules, business pillar confirmation, hiring approvals, marketing budget, and strategic initiatives.

**Settings** — Team directory (8 initial users) and entity list.

**Login** — Magic link email authentication (invitation-only, no self-registration).

The app is **mobile-first** — designed to work perfectly on phones with a bottom tab navigation. Desktop users get a full sidebar. It can be installed to your phone's home screen as a PWA for a native app-like experience.

---

## The Pallet AI Vision

We're already at **95% completion** on our pilot with Pallet (pallet.com) for AI-powered freight quoting. Compass is the foundation that makes the full AI vision possible.

**The roadmap:**

```
Phase 1: Compass goes live (100-day tracker + team alignment)
    ↓
Phase 2: Carrier rate cards + quoting system in Compass
    ↓
Phase 3: Pallet AI connects to Compass structured data
    ↓
Phase 4: Full AI-powered operations (quoting → tracking → invoicing)
```

The key insight: Pallet needs **structured data** to work — carrier rates, customer SOPs, lane history, pricing rules. Right now, much of that knowledge lives in people's heads and email threads. Compass systematically captures and structures it so AI can use it.

**End state:** 90% of routine operations handled by AI. People focus on relationships, decisions, and exceptions.

---

## Phased Delivery

| Phase | Timeline | What Ships |
|-------|----------|-----------|
| **Phase 1** | This week | 100-day Kanban + dashboard live for all users |
| **Phase 2** | Weeks 3-4 | Carrier management + rate cards + quoting system (Pallet integration) |
| **Phase 3** | Weeks 5-7 | Shipment tracking + financial dashboards (AR/AP, cash flow, KPIs) |
| **Phase 4** | Weeks 8-12 | Full platform: notifications, document center, calendar sync, PDF exports |

---

## Initial Users

| Name | Role | Access |
|------|------|--------|
| Jerry Shi | Owner & Board Chair | Full admin |
| Alic Ge | Board Director | Full |
| Billy | Board Director | Full |
| Season | Board Director, Finance | Full |
| Jason Likens | CEO, US Operations | Full |
| Josh Foster | COO, US Operations | Full |
| Serena Lin | CFO | Full (especially finance modules) |
| David Wu | Engineer | Full admin |

---

## What We Need From You

Once the live URL is shared (expected this week):

1. **Try it on your phone** — add it to your home screen. The mobile experience is the priority.
2. **Review the 100-day tasks** — are the US-side tasks accurate? Are we missing anything from your perspective?
3. **Update task status** — as work progresses, update in Compass rather than over email/chat. This keeps everyone aligned across time zones.
4. **Feed back on the quoting workflow** — Phase 2 builds the carrier rate card and quoting system. Your input on how the US team handles quotes today will shape the design.

The system is built to serve the whole team. The more we use it, the more accurate the data becomes, and the more AI can automate.

---

## Tech Overview (High Level)

- **Web app** (works on any device, no app store needed)
- **Mobile-first design** with PWA install support
- **Role-based access** — financial data restricted to authorized roles
- **Real-time sync** — changes by one user appear instantly for others
- **Hosted on Vercel** (fast, reliable, global CDN)
- **Database on Supabase** (PostgreSQL with row-level security)

No software to install. Just open the URL, log in with your email, and you're in.

---

*Prepared by Jerry Shi — April 2, 2026*
