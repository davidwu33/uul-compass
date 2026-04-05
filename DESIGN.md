# UUL Compass — Design System

> Agent-friendly design specification for AI code generation tools. This is the authoritative visual reference — all UI decisions follow this file.

## 1. Visual Theme & Atmosphere

**Product:** Compass — post-merger integration command center for UUL Global
**Type:** Executive operations tool, not a reporting dashboard
**Audience:** Board members (phone-only), C-suite, operations managers

**Design Philosophy:** This is a control room. It surfaces problems before you go looking for them. Every element on screen earns its space by answering one question: "Do I need to act on this?"

**North Star References:**

| Product | What to take |
|---------|-------------|
| Bloomberg Terminal | Information density, dark canvas, tabular numbers, keyboard-first navigation |
| Linear | Sidebar structure, task cards, extreme density done right, command palette |
| Flexport | Logistics-specific patterns, shipment timelines, geographic context |
| Apple Watch complications | Glanceable data in constrained space — perfect for mobile KPIs |
| Air traffic control UI | Status hierarchy, alert escalation, calm-until-critical color philosophy |

**Mood:** Dark, decisive, calm. Navy and teal. Quiet until something demands attention — then unmissable. Not corporate, not startup. Operational.

**Core Principles:**
1. **Selective visibility** — show what requires action, hide what doesn't. <5 KPIs per mobile view.
2. **Event-driven** — when something goes red, the UI reorganizes to surface it. Alert cards float above the grid.
3. **Status + narrative** — every red/yellow/green gets a one-line explanation. A red dot without context is useless.
4. **Role-based density** — Board view: 3-4 large cards, high legibility. Ops view: 6-8 compact cards, faster scanning.
5. **Mobile-first, desktop-enhanced** — the primary user only uses his phone. Design for 375px first, then expand.

---

## 2. Color Palette & Roles

All colors use **OKLCh** for perceptual uniformity. Hex approximations provided for reference.

### Base (Dark Canvas)

| Token | OKLCh | Hex | Role |
|-------|-------|-----|------|
| `--background` | `oklch(0.13 0.02 250)` | #0f1729 | Page background — deep navy-black |
| `--foreground` | `oklch(0.93 0.005 250)` | #e8eaf0 | Primary text on dark |
| `--card` | `oklch(0.17 0.025 250)` | #1a2235 | Card surfaces — slightly lighter than bg |
| `--card-foreground` | `oklch(0.93 0.005 250)` | #e8eaf0 | Text on cards |
| `--muted` | `oklch(0.22 0.02 250)` | #252f42 | Muted backgrounds, input fields |
| `--muted-foreground` | `oklch(0.60 0.015 250)` | #8b95a8 | Secondary text, labels, timestamps |
| `--border` | `oklch(0.25 0.02 250)` | #2d3748 | Borders, dividers — subtle on dark |
| `--ring` | `oklch(0.70 0.15 195)` | #4ecdc4 | Focus rings — teal |

### Brand

| Token | OKLCh | Hex | Role |
|-------|-------|-----|------|
| `--primary` | `oklch(0.35 0.10 250)` | #1e3a5f | Navy — sidebar active, headings, primary buttons |
| `--primary-foreground` | `oklch(0.98 0 0)` | #f8f9fa | Text on primary backgrounds |
| `--accent` | `oklch(0.75 0.15 195)` | #4ecdc4 | Teal — active states, links, progress bars, positive indicators |
| `--accent-foreground` | `oklch(0.15 0.02 250)` | #0f1729 | Text on accent backgrounds |

### Sidebar (Deep Navy)

| Token | OKLCh | Hex | Role |
|-------|-------|-----|------|
| `--sidebar` | `oklch(0.10 0.03 250)` | #0a1020 | Sidebar background — darkest surface |
| `--sidebar-foreground` | `oklch(0.75 0.01 250)` | #b0b8c8 | Sidebar text — muted white |
| `--sidebar-active` | `oklch(0.70 0.15 195)` | #4ecdc4 | Active nav item — teal |
| `--sidebar-active-bg` | `oklch(0.18 0.04 250)` | #162038 | Active nav item background |
| `--sidebar-hover` | `oklch(0.15 0.03 250)` | #121e30 | Hover state |
| `--sidebar-border` | `oklch(0.20 0.03 250)` | #1e2a3e | Sidebar dividers |

### Semantic Status (Calm Until Critical)

Colors are intentionally desaturated at rest. Only critical/overdue states use full saturation.

| Status | Token | OKLCh | Hex | When to use |
|--------|-------|-------|-----|-------------|
| Critical / Overdue | `--status-critical` | `oklch(0.63 0.24 25)` | #ef4444 | Past deadline, blocked, needs immediate action |
| At Risk / Warning | `--status-warning` | `oklch(0.75 0.18 70)` | #f59e0b | Trending behind, approaching deadline |
| In Progress | `--status-active` | `oklch(0.65 0.15 250)` | #3b82f6 | Active work, on track |
| On Track / Done | `--status-success` | `oklch(0.70 0.17 155)` | #22c55e | Completed, ahead of schedule |
| Inactive / Default | `--status-muted` | `oklch(0.55 0.02 250)` | #6b7280 | Not started, low priority, informational |

**Alert escalation:** When a workstream or milestone goes critical, its card gets:
- `border-l-2 border-status-critical` left accent
- Brief narrative: "Systems integration delayed 4 weeks — legacy data migration"
- Elevated position (floats above non-critical cards in the grid)

### Workstream Colors (6 Fixed)

| Workstream | Hex | OKLCh |
|-----------|-----|-------|
| Finance Integration | #ef4444 | `oklch(0.63 0.24 25)` |
| Operations Consolidation | #f97316 | `oklch(0.75 0.18 55)` |
| Sales Engine | #3b82f6 | `oklch(0.65 0.15 250)` |
| Brand & Marketing | #8b5cf6 | `oklch(0.55 0.20 290)` |
| Technology & AI | #06b6d4 | `oklch(0.72 0.13 210)` |
| Organization & HR | #22c55e | `oklch(0.70 0.17 155)` |

These are fixed — never change the mapping. Used for dots, progress bars, chart segments, and left-border accents.

---

## 3. Typography Rules

| Element | Font | Weight | Size | Tracking | Notes |
|---------|------|--------|------|----------|-------|
| **Font Family** | Geist | — | — | — | Sans-serif, clean, modern |
| **Mono** | Geist Mono | — | — | — | Data tables, code, timestamps |
| Page title | Geist | 700 | 22px | -0.025em | One per page, tight tracking |
| Section header | Geist | 600 | 14px | 0 | Card group labels |
| Card title | Geist | 600 | 14px | 0 | Primary card text |
| Body text | Geist | 400 | 14px | 0 | Descriptions, narratives |
| Secondary text | Geist | 400 | 13px | 0 | Muted-foreground color |
| Small label | Geist | 500 | 12px | 0 | Metadata, timestamps |
| Micro label | Geist | 600 | 10px | 0.08em | Uppercase badges, workstream tags |
| Numbers (all) | Geist | 600–700 | varies | 0 | **Always `tabular-nums`** for alignment |
| Large metric | Geist | 700 | 32px | -0.02em | Hero KPI values, `tabular-nums` |

**Rules:**
- Maximum 2 font weights per card (typically 400 + 600)
- All numbers use `font-variant-numeric: tabular-nums` — no exceptions
- Large metrics use `font-feature-settings: "tnum"` for financial-grade alignment
- Never use font sizes below 10px
- Uppercase is reserved for micro labels (workstream tags, status badges)

---

## 4. Component Patterns

### Cards (Primary Surface)

```
Default Card:
- bg-card, border border-border/60, rounded-xl (12px)
- p-5 (20px padding)
- No shadow on dark (shadows don't read on dark backgrounds)
- Hover: border-border transition-colors duration-150

Alert Card (Critical):
- Same as default + border-l-2 border-status-critical
- Narrative line: 13px, status-critical color, below title
- Floats above non-critical cards in layout order

KPI Card:
- Icon: 28px container, rounded-lg, workstream-colored bg at 10% opacity
- Label: 10px uppercase, muted-foreground
- Value: 32px bold, tabular-nums, foreground
- Trend: 12px, accent (positive) or status-critical (negative), with arrow icon
- Subtitle: 12px, muted-foreground
```

### Badges & Pills

```
Status Badge:
- 10px uppercase, font-weight 600
- Colored bg at 15% opacity + colored text + colored border at 30% opacity
- Example: bg-blue-500/15 text-blue-400 border-blue-500/30
- Round: rounded-full, px-2 py-0.5

Workstream Tag:
- Colored dot (6px, rounded-full) + 10px uppercase label
- Dot uses workstream hex color
- Text uses muted-foreground (not the workstream color — too noisy on dark)

Count Pill:
- bg-muted, text-muted-foreground, rounded-full
- 10px font, px-1.5 py-0.5
- Used in column headers, nav items
```

### Navigation

```
Sidebar (Desktop ≥1024px):
- Fixed left, w-64 (256px), bg-sidebar
- 3 sections: Main, Operations, System
- Nav items: h-9, px-3, rounded-lg
- Active: bg-sidebar-active-bg, text-sidebar-active (teal), font-weight 500
- Hover: bg-sidebar-hover
- Phase badges: "P2" / "P3" micro labels for unreleased features
- Collapse: hidden below 1024px

Bottom Nav (Mobile <1024px):
- Fixed bottom, h-16 (64px)
- bg-card/80 backdrop-blur-xl border-t border-border
- 4 tabs: Home, Plan, Decisions, Settings
- Active: accent color icon + bg-accent/10 pill
- Touch target: 44px minimum
- Safe area: pb-[env(safe-area-inset-bottom)]

Topbar (Both):
- Sticky top, h-14 (56px)
- bg-background/80 backdrop-blur-xl border-b border-border
- Left: page title or breadcrumb
- Right: day counter pill (accent bg), notification badge, user avatar
- Search: ⌘K hint text, muted
```

### Data Tables

```
- bg-card rounded-xl border border-border/60
- Header row: bg-muted/50, text-muted-foreground, 10px uppercase, font-weight 600
- Body rows: border-b border-border/30
- Hover: bg-muted/30
- Numbers: tabular-nums, right-aligned
- Actions: icon buttons, opacity-0 group-hover:opacity-100
- Empty state: centered, muted text, dashed border
```

### Timeline / Activity Feed

```
- Vertical line: 1px border-border/50
- Dots: 8px, colored by action type, ring-2 ring-background (cutout effect)
- Content: actor (font-weight 500) + action (muted) + target (font-weight 500)
- Timestamp: 12px, muted-foreground, right-aligned or below
- Colors: blue (created), emerald (completed), amber (updated), red (escalated)
```

### Kanban Board

```
- 5 columns: To Do | In Progress | Blocked | Review | Done
- Column header: colored dot + label + count pill
- Column bg: transparent (cards provide the surface on dark)
- Task cards: see Cards pattern
- Horizontal scroll on mobile (min-w-[1100px] overflow-x-auto)
- Empty column: dashed border, muted "No tasks" text
```

### Hero / Summary Card

```
- Full-width, bg-card, rounded-xl
- NO decorative gradients or blurred circles — keep it clean
- Large metric: 32-40px bold, tabular-nums
- Subtitle: 14px muted-foreground
- Progress bar: h-2, rounded-full, accent color fill
- Stats row: 3-4 inline metrics separated by border-r border-border
- Each stat: label (10px muted) + value (16px bold)
```

### Empty States

```
- Centered in parent container
- Icon: 48px, muted-foreground, stroke-1.5
- Title: 14px, font-weight 500
- Description: 13px, muted-foreground
- CTA button (if applicable): ghost variant
- No illustrations — keep it text + icon only
```

### Loading States

```
- Skeleton: bg-muted/50 rounded-lg animate-pulse
- Match the shape and size of the content being loaded
- Cards: skeleton card with 3 skeleton lines
- KPIs: skeleton value (wider) + skeleton label (narrower)
- Never show a full-page spinner — use inline skeletons
```

### Data Freshness Indicator

```
- Always visible in topbar or section header
- Format: "Updated 5m ago" or "Synced 2h ago"
- Color: muted-foreground when fresh (<1h), status-warning when stale (1-24h), status-critical when very stale (>24h)
- Icon: RefreshCw (Lucide), 14px
```

---

## 5. Layout Principles

| Element | Value |
|---------|-------|
| Base radius | 0.75rem (12px) — `rounded-xl` |
| Card radius | 0.75rem — `rounded-xl` |
| Button radius | 0.5rem — `rounded-lg` |
| Badge radius | 9999px — `rounded-full` |
| Page padding (desktop) | 32px — `p-8` |
| Page padding (mobile) | 16px — `p-4` |
| Card padding | 20px — `p-5` |
| Section gap | 24px — `space-y-6` |
| Card grid gap | 12-16px — `gap-3` to `gap-4` |
| Sidebar width | 256px — `w-64` |
| Topbar height | 56px — `h-14` |
| Bottom nav height | 64px — `h-16` |
| Max content width | 80rem — `max-w-7xl` |

### Grid Strategy

```
Mobile (<1024px):
- Single column, full width
- Cards stack vertically
- KPIs: 2-column grid (grid-cols-2)
- Kanban: horizontal scroll

Desktop (≥1024px):
- Sidebar + main content
- KPIs: 4-column grid (grid-cols-4)
- Dashboard: 5-column grid (lg:grid-cols-5) for main + sidebar
- Kanban: 5 columns visible
```

### Spacing Scale (8px Base)

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Inline icon+text |
| `gap-2` | 8px | Badge groups, tight lists |
| `gap-3` | 12px | Card grid gaps |
| `gap-4` | 16px | Section content gaps |
| `gap-6` | 24px | Section separators |
| `gap-8` | 32px | Page-level sections |

---

## 6. Depth & Elevation

On dark backgrounds, shadows are nearly invisible. Use **borders and background luminance** to create hierarchy instead.

| Level | Surface | Method |
|-------|---------|--------|
| 0 (Base) | Page background | `bg-background` — darkest |
| 1 (Card) | Content cards | `bg-card` — slightly lighter + `border border-border/60` |
| 2 (Elevated) | Dropdowns, sheets, dialogs | `bg-muted` + `border border-border` |
| 3 (Overlay) | Command palette, modals | `bg-card` + `ring-1 ring-border` + `shadow-2xl shadow-black/50` |
| 4 (Alert) | Critical cards, toasts | `border-l-2 border-status-critical` + slight glow `shadow-status-critical/10` |

**Rules:**
- No box-shadow on regular cards — use border luminance difference only
- Reserve shadow for overlays (modals, command palette, dropdowns)
- Alert glow is the only colored shadow in the system
- Backdrop blur (`backdrop-blur-xl`) on sticky elements (topbar, bottom nav)

---

## 7. Do's and Don'ts

### Do
- Use OKLCh tokens — never hardcode hex values in components
- Keep information density high — board members want everything at a glance
- Test every layout on mobile first (375px minimum width)
- Use `tabular-nums` on every number that could appear in a column
- Pair every status color with a one-line narrative explanation
- Use border-based hierarchy on dark backgrounds (not shadows)
- Keep animations under 150ms for interactions (200ms max for progress bars)
- Show data freshness — "Updated Xm ago" on every data section
- Design empty states for every list and grid view
- Use Lucide icons consistently — outline style, 2px stroke

### Don't
- Don't use decorative elements (gradient circles, blurred orbs, pattern overlays)
- Don't use more than 2 font weights on a single card
- Don't rely on color alone for status — always pair with icon + text
- Don't use horizontal scroll for card layouts on mobile (only kanban gets horizontal scroll)
- Don't show more than 5 KPI cards on mobile — prioritize ruthlessly
- Don't use full-page loading spinners — use inline skeletons
- Don't use light/bright page backgrounds — this is a dark-first app
- Don't break the workstream color mapping — those 6 colors are permanently fixed
- Don't use animations longer than 150ms for user interactions
- Don't design login/auth pages differently from the app — same dark canvas, same typography

---

## 8. Responsive Behavior

| Breakpoint | Width | Layout Changes |
|-----------|-------|----------------|
| Mobile | <768px | Single column, bottom nav, compact padding (p-4), 2-col KPI grid |
| Tablet | 768-1023px | 2-3 column grids, bottom nav, medium padding (p-6) |
| Desktop | ≥1024px | Sidebar visible, bottom nav hidden, full multi-column layouts, p-8 |
| Wide | ≥1280px | Full dashboard grids, keyboard shortcut hints visible |

**Mobile-First Rules:**
1. The primary user only uses his phone — mobile is not an afterthought
2. Bottom nav: 4 tabs (Home, Plan, Decisions, Settings), frosted glass, 44px touch targets
3. Cards stack vertically — never side-by-side below 768px (except 2-col KPI grid)
4. Kanban scrolls horizontally on mobile (the only exception to no-horizontal-scroll)
5. PWA installable — full-screen, no browser chrome
6. Safe area insets: `pb-[env(safe-area-inset-bottom)]` on bottom nav
7. Sticky context header shows current page + data freshness on scroll
8. Vertical scroll only — no horizontal card carousels

---

## 9. Agent Prompt Guide

When building UI for Compass, paste this to your AI agent:

```
You are building UI for Compass, a post-merger integration command center.

CRITICAL RULES:
- Dark background (#0f1729), light text (#e8eaf0), card surfaces (#1a2235)
- Navy (#1e3a5f) + teal (#4ecdc4) brand identity
- Mobile-first: design for 375px, then scale up
- Maximum 5 KPI cards visible on mobile
- Every status indicator needs color + icon + narrative text
- All numbers use tabular-nums for column alignment
- No decorative elements — every pixel serves a purpose
- No shadows on cards — use border luminance hierarchy
- Geist font, max 2 weights per card (400 + 600)
- shadcn/ui components, Lucide icons (2px stroke), Tailwind CSS

COMPONENT PATTERNS:
- Cards: bg-[#1a2235] border border-[#2d3748]/60 rounded-xl p-5
- Alert cards: add border-l-2 border-red-500 + narrative line
- Badges: colored bg at 15% opacity + colored text + rounded-full
- KPI: icon (28px container) + label (10px uppercase) + value (32px bold tnum) + trend
- Navigation: dark sidebar desktop, frosted bottom nav mobile
- Empty states: icon + title + description, centered, no illustrations

STATUS COLORS:
- Critical: #ef4444 (red) — overdue, blocked
- Warning: #f59e0b (amber) — at risk
- Active: #3b82f6 (blue) — in progress
- Success: #22c55e (green) — done, on track
- Muted: #6b7280 (gray) — inactive

WORKSTREAM COLORS (fixed, never change):
- Finance: #ef4444, Operations: #f97316, Sales: #3b82f6
- Marketing: #8b5cf6, Technology: #06b6d4, HR: #22c55e
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 (OKLCh tokens) |
| Components | shadcn/ui |
| Charts | Recharts 3 |
| Icons | Lucide React (2px stroke, outline) |
| Fonts | Geist + Geist Mono (Google Fonts) |
| Database | Supabase (Postgres + Auth) |
| ORM | Drizzle ORM |

## Page Inventory

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Dashboard | `/` | Phase 1 | Hero progress, KPIs, workstream bars, milestones, activity |
| 100-Day Plan | `/plan` | Phase 1 | Kanban board, workstream filters, progress header |
| Decisions | `/decisions` | Phase 1 | Timeline of board meeting decisions |
| Settings | `/settings` | Phase 1 | Team roster (grouped by role), entity cards |
| Login | `/login` | Phase 1 | Magic link auth — same dark canvas as app |
| Quotes | `/quotes` | Phase 2 | RFQ and quote management |
| Customers | `/customers` | Phase 2 | Customer CRM |
| Carriers | `/carriers` | Phase 2 | Carrier management + rate cards |
| Shipments | `/shipments` | Phase 3 | Shipment lifecycle tracking |
| Finance | `/finance` | Phase 3 | AR/AP, cash flow, KPI dashboards |
| Documents | `/documents` | Phase 4 | File management |
