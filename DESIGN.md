# UUL Compass — Design System

> Agent-friendly design specification. Used by Stitch, Claude Code, Copilot, and other AI tools to generate consistent UI.

## Product

**Name:** Compass
**Company:** UUL Global
**Type:** Post-merger integration command center + operational OS for a global logistics company
**Audience:** Board members, C-suite executives, operations managers — mobile-first (key user only uses his phone)
**Vibe:** Linear meets Flexport. Data-dense but clean. Professional but not corporate. Navy + teal nautical theme.

## Design References

| Product | What to reference |
|---------|------------------|
| **Linear** (linear.app) | Sidebar design, task cards, keyboard shortcuts, extreme information density done right |
| **Vercel Dashboard** | KPI cards, deployment status indicators, dark theme execution, data viz |
| **Notion** | Kanban views, inline editing, multi-view switching |
| **Flexport** | Shipment tracking timeline, logistics-specific UI patterns, status flows |
| **Raycast** | Search UX, command palette, minimal chrome |

## Color System

All colors use OKLCh color space for perceptual uniformity.

### Core Palette

| Token | OKLCh Value | Hex Approx | Usage |
|-------|-------------|------------|-------|
| `--background` | `oklch(0.985 0.002 250)` | #f8f9fb | Page background, light blue-gray |
| `--foreground` | `oklch(0.15 0.02 250)` | #1a1d2e | Primary text |
| `--card` | `oklch(1 0 0)` | #ffffff | Card backgrounds |
| `--primary` | `oklch(0.35 0.12 250)` | #1e3a5f | Navy — buttons, headings, sidebar |
| `--accent` | `oklch(0.75 0.15 195)` | #4ecdc4 | Teal — active states, links, highlights |
| `--muted` | `oklch(0.96 0.006 250)` | #f0f2f5 | Muted backgrounds |
| `--muted-foreground` | `oklch(0.50 0.02 250)` | #6b7280 | Secondary text |
| `--destructive` | `oklch(0.577 0.245 27)` | #dc2626 | Errors, overdue, critical |
| `--border` | `oklch(0.91 0.01 250)` | #e2e5ea | Borders, dividers |

### Sidebar (Dark Navy)

| Token | OKLCh Value | Usage |
|-------|-------------|-------|
| `--sidebar` | `oklch(0.18 0.04 250)` | Sidebar background — deep navy |
| `--sidebar-foreground` | `oklch(0.90 0.01 250)` | Sidebar text |
| `--sidebar-primary` | `oklch(0.70 0.15 195)` | Active nav item — teal |
| `--sidebar-accent` | `oklch(0.25 0.04 250)` | Hover/active background |
| `--sidebar-border` | `oklch(0.28 0.04 250)` | Sidebar dividers |

### Status Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Critical / Overdue | Red | #ef4444 | Tasks past deadline, critical priority |
| High / Warning | Orange | #f97316 | High priority, at-risk items |
| Medium / In Progress | Sky Blue | #3b82f6 | Active work, medium priority |
| Low / Default | Slate | #94a3b8 | Low priority, inactive |
| Success / Done | Emerald | #22c55e | Completed items, positive indicators |
| Blocked | Red | #ef4444 | Blocked tasks (same as critical) |

### Workstream Colors (6 fixed)

| Workstream | Color | Hex |
|-----------|-------|-----|
| Finance Integration | Red | #ef4444 |
| Operations Consolidation | Orange | #f97316 |
| Sales Engine | Blue | #3b82f6 |
| Brand & Marketing | Purple | #8b5cf6 |
| Technology & AI | Cyan | #06b6d4 |
| Organization & HR | Green | #22c55e |

## Typography

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| **Font Family** | Geist (sans) | — | — | — |
| **Mono** | Geist Mono | — | — | — |
| Page title | Geist | 700 (bold) | 20-24px | -0.025em (tight) |
| Section header | Geist | 600 (semibold) | 14px | normal |
| Card title | Geist | 600 | 13-14px | normal |
| Body text | Geist | 400 | 14px | normal |
| Small text | Geist | 500 | 12px | normal |
| Tiny label | Geist | 600 | 10px | 0.05-0.12em (wide), uppercase |
| Tabular numbers | Geist | 700 | varies | `tabular-nums` for alignment |

## Spacing & Layout

| Element | Value |
|---------|-------|
| Base radius | 0.75rem (12px) |
| Card radius | 0.75rem rounded-xl |
| Button radius | 0.5rem rounded-lg |
| Page padding (desktop) | 32px (p-8) |
| Page padding (mobile) | 16px (p-4) |
| Card padding | 20px (p-5) |
| Section gap | 24px (space-y-6) |
| Card gap in grid | 12-16px (gap-3 to gap-4) |
| Sidebar width | 256px (w-64) |
| Topbar height | 56px (h-14) |
| Mobile bottom nav height | 64px (h-16) |
| Max content width | 80rem (max-w-7xl) |

## Component Patterns

### Cards
- White background, subtle border (`border-border/60`), small shadow (`shadow-sm`)
- Hover: shadow increases (`hover:shadow-md`), slight lift (`hover:-translate-y-0.5`)
- Transition: `transition-all duration-200`
- Critical cards: red border tint (`border-red-200/60`), red shadow (`shadow-red-500/5`)

### Badges / Pills
- Outline variant with colored background tint
- 10px font, uppercase for workstream labels
- Status badges: colored bg + text + border (e.g., `bg-sky-50 text-sky-700 border-sky-200`)

### Avatars
- Size: 24-36px depending on context
- Role-colored backgrounds: Owner=purple, Board=blue, Executive=emerald, Team=slate
- 9-10px bold initials, white text

### KPI Cards
- Icon in 28px rounded-lg container with tinted background
- Label: 11px uppercase semibold
- Value: 30px bold tabular-nums
- Subtitle: 12px muted

### Hero Card (Dashboard)
- Full-width gradient: deep navy to darker navy
- Decorative: subtle radial gradients in corners (white/5 and teal/10)
- Stats in frosted glass pills (`bg-white/5 backdrop-blur-sm`)
- Large number: 48-60px bold

### Kanban
- 5 columns: To Do, In Progress, Blocked, Review, Done
- Column headers: tinted background, colored dot, count pill
- Cards: see Cards pattern above
- Empty state: dashed border, muted text

### Timeline (Activity Feed / Decisions)
- Vertical line: 1px border color
- Dots: 10px colored circles with `ring-2 ring-background` for cutout effect
- Content flows to the right of the timeline

### Navigation
- **Sidebar (desktop):** Dark navy, 3 sections (Main, Operations, System), phase badges for unreleased features
- **Bottom nav (mobile):** 4 tabs, frosted glass background, active = primary color + bg tint
- **Topbar:** Sticky, backdrop-blur, search bar with ⌘K hint, notification bell, user avatar

### Buttons
- Primary: navy bg, white text, h-11 for forms
- Ghost: transparent, muted text
- Icon buttons: 32px square, rounded-lg, muted color

### Inputs
- Height: 44px (h-11) for forms
- With icon: left-padded (pl-10) with absolute-positioned icon
- Border: standard border color, focus ring

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| Mobile (<1024px) | Bottom nav visible, sidebar hidden, single-column layouts, compact padding |
| Desktop (>=1024px) | Sidebar visible, bottom nav hidden, multi-column grids, wider padding |
| Small desktop (1024-1280px) | 2-3 column grids |
| Large desktop (>=1280px) | Full multi-column layouts, keyboard shortcut hints visible |

## Mobile-First Rules

1. **Mobile is the primary design target** — key stakeholder only uses his phone
2. Bottom nav: 4 tabs (Home, Plan, Decisions, Settings)
3. Cards stack vertically on mobile
4. Kanban scrolls horizontally on mobile
5. PWA installable — add to home screen, full-screen, no browser chrome
6. Safe area insets respected: `pb-[env(safe-area-inset-bottom)]`
7. Touch targets: minimum 44px

## Iconography

- **Library:** Lucide React
- **Style:** Outline (stroke), 2px default weight, 2.5px for active states
- **Sizes:** 14px (h-3.5) inline, 16px (h-4) standard, 18px (h-4.5) in headers, 20px (h-5) mobile nav

## Animation & Motion

| Effect | Implementation |
|--------|---------------|
| Card hover lift | `hover:-translate-y-0.5 transition-all duration-200` |
| Shadow on hover | `hover:shadow-md transition-shadow` |
| Fade in on hover | `opacity-0 group-hover:opacity-100 transition-opacity` |
| Active pulse | `animate-pulse` on status dots (online indicator, day counter) |
| Backdrop blur | `backdrop-blur-xl` on topbar and bottom nav |
| Progress bars | `transition-all duration-500` for smooth width changes |

## Utility Classes (Custom)

| Class | Effect |
|-------|--------|
| `.glass` | `background: oklch(1 0 0 / 70%); backdrop-filter: blur(12px)` |
| `.bg-noise` | Subtle SVG noise texture overlay at 2% opacity |

## Page Inventory

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Dashboard | `/` | Built | Hero progress, KPIs, workstream bars, milestones, activity |
| 100-Day Plan | `/plan` | Built | Kanban board, workstream filter pills, progress bar |
| Decisions | `/decisions` | Built | Timeline of board meeting decisions |
| Settings | `/settings` | Built | Team roster, entity cards |
| Login | `/login` | Built | Magic link auth, dark gradient background |
| Shipments | `/shipments` | Phase 3 | Shipment lifecycle tracking |
| Quotes | `/quotes` | Phase 2 | RFQ and quote management |
| Customers | `/customers` | Phase 2 | Customer CRM |
| Carriers | `/carriers` | Phase 2 | Carrier management + rate cards |
| Finance | `/finance` | Phase 3 | AR/AP, cash flow, KPI dashboards |
| Documents | `/documents` | Phase 4 | File management |

## Do / Don't

### Do
- Use the OKLCh color tokens — never hardcode hex
- Keep information density high — board members want to see everything at a glance
- Test every design on mobile first (375px width minimum)
- Use `tabular-nums` for any numbers that align vertically
- Maintain the navy + teal nautical identity
- Use subtle shadows and hover states for depth
- Keep text concise — this is a command center, not a blog

### Don't
- Don't use bright or saturated page backgrounds — keep it light and cool
- Don't use large empty spaces — data density matters
- Don't hide information behind tabs or accordions if it fits on screen
- Don't use dark mode for the main app (only the sidebar is dark)
- Don't use animations longer than 200ms for interactions
- Don't use more than 2 font weights on a single card
- Don't break the workstream color mapping — those 6 colors are fixed

## Tech Stack (for implementers)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (15 installed) |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Font | Geist + Geist Mono (Google Fonts) |
| Database | Supabase (Postgres + Auth) |
| ORM | Drizzle ORM |
