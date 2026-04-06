import type { TaskData } from "../types";

// 82 tasks from the 100-Day Post-Merger Plan
// Phase 1: Days 1-30 (Apr 1 - Apr 30)
// Phase 2: Days 31-60 (May 1 - May 30)
// Phase 3: Days 61-100 (Jun 1 - Jul 10)

export const demoTasks: TaskData[] = [
  // ═══════════════════════════════════════════════════════════════
  // FINANCE — Phase 1
  // ═══════════════════════════════════════════════════════════════
  { id: "f1", taskCode: "F1", title: "Demand Silfab 30% AR prepayment before port arrival", status: "in_progress", priority: "critical", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 7", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f2", taskCode: "F2", title: "AR factoring RFPs to OTR, eCapital, Riviera", status: "in_progress", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 5", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f3", taskCode: "F3", title: "VP Finance hire — post job description", status: "todo", priority: "critical", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 4", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f4", taskCode: "F4", title: "Evaluate bridge financing need ($300-500K)", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f5", taskCode: "F5", title: "Prepare legal recovery procedures for Plan C", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f6", taskCode: "F6", title: "Install weekly flash reporting (revenue, GP, cash, volume)", status: "todo", priority: "critical", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Apr 14", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f7", taskCode: "F7", title: "Map chart of accounts across all 4 entities — unified COA", status: "todo", priority: "high", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Apr 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f8", taskCode: "F8", title: "13-week rolling cash forecast — first version", status: "todo", priority: "high", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Apr 21", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f9", taskCode: "F9", title: "Collection speed / payment terms baseline across all entities", status: "todo", priority: "medium", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Apr 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  { id: "f10", taskCode: "F10", title: "Tighten payment terms for top 20 customers", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 1 },
  // FINANCE — Phase 2
  { id: "f11", taskCode: "F11", title: "Monthly management package v1 (full P&L, segment reporting)", status: "todo", priority: "critical", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "May 15", workstream: "Finance", workstreamColor: "#ef4444", phase: 2 },
  { id: "f12", taskCode: "F12", title: "Profit improvement bridge — baseline + initiative impacts", status: "todo", priority: "high", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "May 15", workstream: "Finance", workstreamColor: "#ef4444", phase: 2 },
  { id: "f13", taskCode: "F13", title: "Collection speed optimization: target <45 days", status: "todo", priority: "high", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "May 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 2 },
  { id: "f14", taskCode: "F14", title: "Back-office automation pilot: AI invoice matching", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 2 },
  { id: "f15", taskCode: "F15", title: "Vendor rationalization: consolidate top 20 categories", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "May 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 2 },
  // FINANCE — Phase 3
  { id: "f16", taskCode: "F16", title: "Quarterly board package v1 (full suite)", status: "todo", priority: "critical", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Jun 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 3 },
  { id: "f17", taskCode: "F17", title: "Profit improvement bridge: first quarterly true-up", status: "todo", priority: "high", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Jun 30", workstream: "Finance", workstreamColor: "#ef4444", phase: 3 },
  { id: "f18", taskCode: "F18", title: "Full financial + operational dashboard in Compass", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jul 10", workstream: "Finance", workstreamColor: "#ef4444", phase: 3 },
  { id: "f19", taskCode: "F19", title: "Measure collection speed improvement (target: ≥5 days)", status: "todo", priority: "medium", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Jul 10", workstream: "Finance", workstreamColor: "#ef4444", phase: 3 },

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS — Phase 1
  // ═══════════════════════════════════════════════════════════════
  { id: "o1", taskCode: "O1", title: "Consolidate all carrier contracts + pricing into clearinghouse", status: "todo", priority: "critical", assignee: { name: "Marco", initials: "MC" }, dueDate: "Apr 15", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o2", taskCode: "O2", title: "Marco CC Jerry & Alic on all carrier communications", status: "in_progress", priority: "high", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o3", taskCode: "O3", title: "Finalize Meihang / Star Navigation / UUL incentive alignment", status: "in_progress", priority: "high", assignee: { name: "Alic Ge", initials: "AG", office: "CN" }, dueDate: "Apr 15", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o4", taskCode: "O4", title: "Negotiate MSC, CMA, Golden Standard contracts", status: "todo", priority: "medium", assignee: { name: "Marco", initials: "MC" }, dueDate: "Apr 30", workstream: "Operations", workstreamColor: "#f97316", phase: 1 },
  { id: "o5", taskCode: "O5", title: "Shenzhen warehouse expansion proposal", status: "blocked", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 15", workstream: "Operations", workstreamColor: "#f97316", phase: 1 },
  { id: "o6", taskCode: "O6", title: "Map ALL inter-office workflows end-to-end (quoting → invoicing)", status: "todo", priority: "critical", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 15", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o7", taskCode: "O7", title: "Identify top 5 highest-volume workflows for SOP standardization", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 20", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o8", taskCode: "O8", title: "Document every handoff point where info gets lost between offices", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 20", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o9", taskCode: "O9", title: "Meet top 20 customers personally — revenue protection", status: "todo", priority: "critical", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 30", workstream: "Operations", workstreamColor: "#f97316", phase: 1 },
  { id: "o10", taskCode: "O10", title: "Carrier relationship stability comms — no disruption", status: "todo", priority: "high", assignee: { name: "Marco", initials: "MC" }, dueDate: "Apr 14", workstream: "Operations", workstreamColor: "#f97316", phase: 1, isCrossOffice: true },
  { id: "o11", taskCode: "O11", title: "Audit gross profit per shipment by trade lane, mode, customer", status: "todo", priority: "high", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Apr 30", workstream: "Operations", workstreamColor: "#f97316", phase: 1 },
  // OPERATIONS — Phase 2
  { id: "o12", taskCode: "O12", title: "Deploy unified SOPs for top 5 workflows across all offices", status: "todo", priority: "critical", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 15", workstream: "Operations", workstreamColor: "#f97316", phase: 2, isCrossOffice: true },
  { id: "o13", taskCode: "O13", title: "Unified communication protocols: channel rules, response SLAs", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 15", workstream: "Operations", workstreamColor: "#f97316", phase: 2, isCrossOffice: true },
  { id: "o14", taskCode: "O14", title: "Weekly cross-office standup cadence launched", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "May 7", workstream: "Operations", workstreamColor: "#f97316", phase: 2, isCrossOffice: true },
  { id: "o15", taskCode: "O15", title: "Carrier rate renegotiation using consolidated volume (all entities)", status: "todo", priority: "high", assignee: { name: "Marco", initials: "MC" }, dueDate: "May 30", workstream: "Operations", workstreamColor: "#f97316", phase: 2, isCrossOffice: true },
  { id: "o16", taskCode: "O16", title: "Customs documentation standardization: company-wide arrangements", status: "todo", priority: "high", assignee: { name: "Alic Ge", initials: "AG", office: "CN" }, dueDate: "May 30", workstream: "Operations", workstreamColor: "#f97316", phase: 2, isCrossOffice: true },
  { id: "o17", taskCode: "O17", title: "Knowledge extraction sessions with Alic (葛总) — document into Compass", status: "todo", priority: "critical", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 30", workstream: "Operations", workstreamColor: "#f97316", phase: 2, isCrossOffice: true },
  // OPERATIONS — Phase 3
  { id: "o18", taskCode: "O18", title: "SOP compliance measurement — adoption dashboard across offices", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jun 15", workstream: "Operations", workstreamColor: "#f97316", phase: 3, isCrossOffice: true },
  { id: "o19", taskCode: "O19", title: "Cross-office workflow friction audit — identify remaining gaps", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Jun 30", workstream: "Operations", workstreamColor: "#f97316", phase: 3, isCrossOffice: true },
  { id: "o20", taskCode: "O20", title: "Carrier performance scoring: monthly top-20 carrier scorecards", status: "todo", priority: "medium", assignee: { name: "Marco", initials: "MC" }, dueDate: "Jun 30", workstream: "Operations", workstreamColor: "#f97316", phase: 3 },
  { id: "o21", taskCode: "O21", title: "Identify 3-5 bolt-on acquisition targets for expansion", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jul 10", workstream: "Operations", workstreamColor: "#f97316", phase: 3 },

  // ═══════════════════════════════════════════════════════════════
  // SALES — Phase 1
  // ═══════════════════════════════════════════════════════════════
  { id: "s1", taskCode: "S1", title: "Collect Target Account list from Mike & Gabe", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 5", workstream: "Sales", workstreamColor: "#3b82f6", phase: 1 },
  { id: "s2", taskCode: "S2", title: "Build DataMine API for customer freight history", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 1 },
  { id: "s3", taskCode: "S3", title: "Foxconn meeting prep (Steve Zhi IPP advisory)", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 13", workstream: "Sales", workstreamColor: "#3b82f6", phase: 1 },
  { id: "s4", taskCode: "S4", title: "Audit legacy customer pricing — find below-cost accounts", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 1 },
  { id: "s5", taskCode: "S5", title: "Implement surcharge / accessorial fee structures", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 1 },
  { id: "s6", taskCode: "S6", title: "Cross-sell mapping: which customers use 1 service vs full suite?", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 1 },
  // SALES — Phase 2
  { id: "s7", taskCode: "S7", title: "Execute pricing corrections on below-cost accounts", status: "todo", priority: "critical", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "May 15", workstream: "Sales", workstreamColor: "#3b82f6", phase: 2 },
  { id: "s8", taskCode: "S8", title: "Launch cross-sell campaign: single-service → full suite", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "May 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 2 },
  { id: "s9", taskCode: "S9", title: "Sales pipeline in Compass: prospect → qualified → won/lost", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 2 },
  // SALES — Phase 3
  { id: "s10", taskCode: "S10", title: "Measure pricing impact: GP per shipment vs Phase 1 baseline", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Jun 30", workstream: "Sales", workstreamColor: "#3b82f6", phase: 3 },
  { id: "s11", taskCode: "S11", title: "Sales organization assessment: restructure for pipeline", status: "todo", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Jul 10", workstream: "Sales", workstreamColor: "#3b82f6", phase: 3 },
  { id: "s12", taskCode: "S12", title: "RFP win rate tracking in Compass", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jul 10", workstream: "Sales", workstreamColor: "#3b82f6", phase: 3 },
  { id: "s13", taskCode: "S13", title: "Customer retention measurement: baseline vs Day 100", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Jul 10", workstream: "Sales", workstreamColor: "#3b82f6", phase: 3 },

  // ═══════════════════════════════════════════════════════════════
  // BRAND & MARKETING — Phase 1
  // ═══════════════════════════════════════════════════════════════
  { id: "m1", taskCode: "M1", title: "Brand Narrative Memo v1 (Master Marketing Memo)", status: "done", priority: "critical", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 3", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m2", taskCode: "M2", title: "Ben Fogarty DocuSign + kickoff", status: "done", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m3", taskCode: "M3", title: "Mid-week deck review with Ben", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 7", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m4", taskCode: "M4", title: "Final deck delivery from Ben", status: "todo", priority: "high", assignee: { name: "Ben Fogarty", initials: "BF" }, dueDate: "Apr 10", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m5", taskCode: "M5", title: "Team bios — Jason, Jerry, Alic (American audience framing)", status: "todo", priority: "high", dueDate: "Apr 14", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m6", taskCode: "M6", title: "Case study confirmation — AIP Corp Monarch referencability", status: "todo", priority: "medium", dueDate: "Apr 14", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m7", taskCode: "M7", title: "UUL Compass screenshots / demo video for marketing", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Apr 21", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  { id: "m8", taskCode: "M8", title: "Lock key stats for all marketing (Jason input on service arch)", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 14", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 1 },
  // MARKETING — Phase 2
  { id: "m9", taskCode: "M9", title: "Corporate deck v2 — incorporate board feedback", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 15", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 2 },
  { id: "m10", taskCode: "M10", title: "Website refresh — align with new brand narrative", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 30", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 2 },
  { id: "m11", taskCode: "M11", title: "Customer-facing case studies finalized (2-3 accounts)", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "May 30", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 2 },
  // MARKETING — Phase 3
  { id: "m12", taskCode: "M12", title: "Corporate deck v3 — final with real Compass screenshots", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jun 30", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 3 },
  { id: "m13", taskCode: "M13", title: "Marketing ROI: leads generated, meetings booked", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Jul 10", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", phase: 3 },

  // ═══════════════════════════════════════════════════════════════
  // TECHNOLOGY & AI — Phase 1
  // ═══════════════════════════════════════════════════════════════
  { id: "t1", taskCode: "T1", title: "Deploy Compass OS v1 (Vercel, demo data)", status: "in_progress", priority: "critical", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Apr 7", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1 },
  { id: "t2", taskCode: "T2", title: "Pallet pricing pilot — finalize (95% complete)", status: "in_progress", priority: "high", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "Apr 14", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1 },
  { id: "t3", taskCode: "T3", title: "Define full-chain data architecture for AIOS", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 21", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1 },
  { id: "t4", taskCode: "T4", title: "Data readiness audit: what data exists, where, how stale", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Apr 21", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1 },
  { id: "t5", taskCode: "T5", title: "API-first integration plan: connect TMS/WMS via middleware", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1, isCrossOffice: true },
  { id: "t6", taskCode: "T6", title: "Compass: connect Supabase, migrate from demo to live data", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Apr 21", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1 },
  { id: "t7", taskCode: "T7", title: "Compass: mobile PWA — installable on Alic's phone", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Apr 14", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1 },
  { id: "t8", taskCode: "T8", title: "Data dictionary + taxonomy mapping across all 4 entities", status: "todo", priority: "medium", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Apr 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 1, isCrossOffice: true },
  // TECHNOLOGY — Phase 2
  { id: "t9", taskCode: "T9", title: "Compass Phase 2: Carriers + Quotes + Customers live", status: "todo", priority: "critical", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 15", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 2 },
  { id: "t10", taskCode: "T10", title: "Pallet AI integration with Compass data", status: "todo", priority: "critical", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 2 },
  { id: "t11", taskCode: "T11", title: "AI customs documentation pilot: HS code + doc generation", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 2 },
  { id: "t12", taskCode: "T12", title: "Middleware/API bridge: connect regional TMS/WMS to unified layer", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 2, isCrossOffice: true },
  { id: "t13", taskCode: "T13", title: "AI customer communication pilot: auto-updates, multilingual", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 2, isCrossOffice: true },
  { id: "t14", taskCode: "T14", title: "Supply chain control tower prototype: real-time monitoring", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "May 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 2 },
  // TECHNOLOGY — Phase 3
  { id: "t15", taskCode: "T15", title: "Compass Phase 3: Shipments + Finance modules live", status: "todo", priority: "critical", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jun 15", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 3 },
  { id: "t16", taskCode: "T16", title: "AI route optimization pilot for last-mile delivery", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jul 10", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 3 },
  { id: "t17", taskCode: "T17", title: "AI shipment tracking + exception management", status: "todo", priority: "high", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jun 30", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 3 },
  { id: "t18", taskCode: "T18", title: "Compass Phase 4 spec: full OS + integrations", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jul 10", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 3 },
  { id: "t19", taskCode: "T19", title: "Digital twin feasibility for warehouse optimization", status: "todo", priority: "medium", assignee: { name: "David Wu", initials: "DW" }, dueDate: "Jul 10", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 3 },
  { id: "t20", taskCode: "T20", title: "AIOS roadmap v1: 12-month AI transformation plan", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jul 10", workstream: "Technology & AI", workstreamColor: "#06b6d4", phase: 3 },

  // ═══════════════════════════════════════════════════════════════
  // ORGANIZATION & HR — Phase 1
  // ═══════════════════════════════════════════════════════════════
  { id: "h1", taskCode: "H1", title: "Board seat assignments confirmed", status: "done", priority: "high", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1 },
  { id: "h2", taskCode: "H2", title: "Jason CEO + Josh COO appointments announced", status: "done", priority: "high", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1 },
  { id: "h3", taskCode: "H3", title: "Evaluate Marco retention / loyalty risk", status: "todo", priority: "high", assignee: { name: "Alic Ge", initials: "AG", office: "CN" }, dueDate: "Apr 14", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1 },
  { id: "h4", taskCode: "H4", title: "1:1 meetings with all direct reports + one level below", status: "todo", priority: "critical", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 30", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1, isCrossOffice: true },
  { id: "h5", taskCode: "H5", title: "A/B/C talent assessment for top 2 leadership levels", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 30", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1, isCrossOffice: true },
  { id: "h6", taskCode: "H6", title: "Identify roles where AI can absorb workload", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 21", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1 },
  { id: "h7", taskCode: "H7", title: "Retention packages for critical relationship holders", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 14", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1 },
  { id: "h8", taskCode: "H8", title: "Communication plan: AI elevates roles (not cuts)", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Apr 21", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 1 },
  // ORG — Phase 2
  { id: "h9", taskCode: "H9", title: "Formal talent reviews: succession planning for critical roles", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 15", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 2, isCrossOffice: true },
  { id: "h10", taskCode: "H10", title: "Compensation realignment: tie incentives to value creation", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 30", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 2 },
  { id: "h11", taskCode: "H11", title: "Identify first AI-absorbed roles: natural attrition plan", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "May 15", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 2 },
  { id: "h12", taskCode: "H12", title: "Reskilling plan for employees moving to judgment-heavy roles", status: "todo", priority: "medium", assignee: { name: "Jason Likens", initials: "JL", office: "US" }, dueDate: "May 30", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 2 },
  // ORG — Phase 3
  { id: "h13", taskCode: "H13", title: "Execute planned headcount adjustments (attrition-based)", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jun 30", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 3 },
  { id: "h14", taskCode: "H14", title: "Measure revenue per employee improvement vs baseline", status: "todo", priority: "medium", assignee: { name: "Serena Lin", initials: "SL" }, dueDate: "Jul 10", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 3 },
  { id: "h15", taskCode: "H15", title: "Document AI reallocation results: roles absorbed, savings", status: "todo", priority: "medium", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jul 10", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 3 },
  { id: "h16", taskCode: "H16", title: "Legal compliance review of any reductions", status: "todo", priority: "high", assignee: { name: "Jerry Shi", initials: "JS" }, dueDate: "Jun 15", workstream: "Organization & HR", workstreamColor: "#22c55e", phase: 3 },
];
