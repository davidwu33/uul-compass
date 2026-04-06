# Compass Handoff

> Last updated: 2026-04-07 by Jerry

## Status: ON TRACK

## Current Sprint Focus
UI/UX 完善 + 数据准确性验证。Supabase 后端接入是下一阶段重点。

---

## Jerry's Last Session (2026-04-06–07)

### Done (Compass v3)
- **Dashboard 全面重做：** 5 section layout — Day counter, Phase Timeline (带 gate markers), Needs Attention (统一的 blocked/overdue/gates), Financial Pulse (cash/AR/working capital/value), 6 Strategic Pillar cards
- **Plan 页面重做：** 按优先级分组 (Critical → High → Medium → Low)，assignee + date 在左侧，clickable phase tabs，workstream filters
- **Growth 页面：** 替换了 cost-savings 焦点，改为 growth priorities — AIDC infrastructure, new key customers, cross-sell, pricing optimization, regional expansion
- **Risks 页面重做：** 每个 risk 下面显示 Linked Tasks，可以看到哪些任务在解决这个风险
- **品牌统一：** Top nav 改为 "Compass" (去掉了 tabs)，sidebar "Value Gains" → "Growth"，side nav "Compass OS / Intelligence Hub"
- **团队信息修正：** Alic Ge = Chairman/Ningbo, Billy Cheng = HK CEO, Season Yu = PE Advisor/Shanghai, US United Logistics, Sageline
- **简化状态：** 4 statuses only — To Do, In Progress, Blocked, Done (去掉了 In Review)
- **Day counter 可配置：** `src/lib/data/config.ts` 中 `goLiveDate: null` 保持 Day 1，上线时改为日期字符串

### For David

#### 最高优先
1. **Supabase 后端接入** — 当前所有数据都是 TypeScript 硬编码 demo data (`src/lib/data/demo/`)。需要：
   - 创建 Supabase 项目
   - 迁移 demo data 到数据库 (82 tasks, 8 risks, 25 milestones, 7 value initiatives, 6 workstreams)
   - 把 `src/lib/data/index.ts` 的 getter functions 改为 async Supabase queries
   - 实现 Auth (login page 已存在，`src/middleware.ts` Auth 已注释)

2. **任务状态可编辑** — 用户需要能登录后点击自己的任务改变状态 (To Do → In Progress → Blocked → Done)。目前没有任何交互功能。

#### 重要功能 (Supabase 之后)
3. **Risk ↔ Task 自动关联** — 当用户创建新 risk 时，系统根据 workstream + keyword 匹配自动建议相关 tasks。用户确认后建立关联。反向也要做：当 linked task 状态变化时，自动更新 risk 状态 (e.g., 所有 mitigation tasks done → risk 自动 resolved；关键 task blocked → risk 升级提醒)。当前关联是手动硬编码在 `src/lib/data/demo/risks.ts` 的 `linkedTaskIds` 字段。

4. **Day Counter 激活** — Jerry 会通知什么时候 go live。届时在 `src/lib/data/config.ts` 把 `goLiveDate` 设为上线日期。

#### 注意事项
- 项目用 npm 不是 pnpm
- `next.config.ts` 已配置 `output: "standalone"` 用于 Docker
- Navigation：sidebar (desktop) + bottom nav (mobile) 是唯一导航，top nav 只有 branding
- 4 task statuses: `todo | in_progress | blocked | done` (schema in `src/db/schema/enums.ts`)
- Risk type 现在包含 `linkedTaskIds: string[]` 字段

### Open Questions
- Vercel 的 team/account 用谁的？David 自己的还是 Jerry 提供一个？
- Supabase project 谁创建？需要 Jerry 的 credit card 还是用 free tier 先？

---

## David's Last Session

### Done
（等待 David 的第一次更新）

### In Progress
-

### For Jerry
-

### Open Questions
-

### test
