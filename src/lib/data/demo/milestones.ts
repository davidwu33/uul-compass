import type { MilestoneData } from "../types";

export const demoMilestones: MilestoneData[] = [
  // Phase 1
  { id: "f-m1", code: "F-M1", name: "Weekly flash report operational", workstream: "Finance", workstreamColor: "#ef4444", targetDate: "Apr 14", status: "not_started", phase: 1, linkedTaskCount: 3, completedTaskCount: 0 },
  { id: "f-m2", code: "F-M2", name: "Unified chart of accounts mapped", workstream: "Finance", workstreamColor: "#ef4444", targetDate: "Apr 30", status: "not_started", phase: 1, linkedTaskCount: 2, completedTaskCount: 0 },
  { id: "o-m1", code: "O-M1", name: "Full workflow map completed", workstream: "Operations", workstreamColor: "#f97316", targetDate: "Apr 15", status: "not_started", phase: 1, linkedTaskCount: 3, completedTaskCount: 0 },
  { id: "o-m2", code: "O-M2", name: "Top 20 customer outreach completed", workstream: "Operations", workstreamColor: "#f97316", targetDate: "Apr 30", status: "not_started", phase: 1, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "s-m1", code: "S-M1", name: "Pricing audit complete", workstream: "Sales", workstreamColor: "#3b82f6", targetDate: "Apr 30", status: "not_started", phase: 1, linkedTaskCount: 3, completedTaskCount: 0 },
  { id: "m-m1", code: "M-M1", name: "Corporate deck v1 delivered", workstream: "Brand & Marketing", workstreamColor: "#8b5cf6", targetDate: "Apr 10", status: "in_progress", phase: 1, linkedTaskCount: 2, completedTaskCount: 1 },
  { id: "t-m1", code: "T-M1", name: "Compass live with real data", workstream: "Technology & AI", workstreamColor: "#06b6d4", targetDate: "Apr 21", status: "not_started", phase: 1, linkedTaskCount: 3, completedTaskCount: 0 },
  { id: "t-m2", code: "T-M2", name: "Pallet pricing pilot complete", workstream: "Technology & AI", workstreamColor: "#06b6d4", targetDate: "Apr 14", status: "in_progress", phase: 1, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "h-m1", code: "H-M1", name: "Talent assessment complete", workstream: "Organization & HR", workstreamColor: "#22c55e", targetDate: "Apr 30", status: "not_started", phase: 1, linkedTaskCount: 2, completedTaskCount: 0 },
  // Phase 2
  { id: "f-m3", code: "F-M3", name: "Profit improvement bridge operational", workstream: "Finance", workstreamColor: "#ef4444", targetDate: "May 15", status: "not_started", phase: 2, linkedTaskCount: 2, completedTaskCount: 0 },
  { id: "f-m4", code: "F-M4", name: "Back-office AI pilot live", workstream: "Finance", workstreamColor: "#ef4444", targetDate: "May 30", status: "not_started", phase: 2, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "o-m3", code: "O-M3", name: "Unified SOPs deployed across all offices", workstream: "Operations", workstreamColor: "#f97316", targetDate: "May 15", status: "not_started", phase: 2, linkedTaskCount: 2, completedTaskCount: 0 },
  { id: "o-m4", code: "O-M4", name: "Cross-office standups running", workstream: "Operations", workstreamColor: "#f97316", targetDate: "May 7", status: "not_started", phase: 2, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "s-m2", code: "S-M2", name: "Pricing corrections executed", workstream: "Sales", workstreamColor: "#3b82f6", targetDate: "May 15", status: "not_started", phase: 2, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "t-m3", code: "T-M3", name: "Compass Phase 2 live", workstream: "Technology & AI", workstreamColor: "#06b6d4", targetDate: "May 15", status: "not_started", phase: 2, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "t-m4", code: "T-M4", name: "Pallet AI fully operational", workstream: "Technology & AI", workstreamColor: "#06b6d4", targetDate: "May 30", status: "not_started", phase: 2, linkedTaskCount: 1, completedTaskCount: 0 },
  { id: "h-m2", code: "H-M2", name: "Talent map finalized", workstream: "Organization & HR", workstreamColor: "#22c55e", targetDate: "May 15", status: "not_started", phase: 2, linkedTaskCount: 2, completedTaskCount: 0 },
  // Phase 3
  { id: "f-m5", code: "F-M5", name: "First quarterly board package delivered", workstream: "Finance", workstreamColor: "#ef4444", targetDate: "Jun 30", status: "not_started", phase: 3, linkedTaskCount: 2, completedTaskCount: 0 },
];
