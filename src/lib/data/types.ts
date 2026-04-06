// ─── Shared Types for Compass Data Layer ───────────────────────
// These types are used by demo data and will match Supabase queries later.

export interface WorkstreamData {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  completed: number;
  targetCompletion: number; // expected % complete by current day
}

export interface FinancialPulseMetric {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  trend?: "up" | "down" | "flat";
  status: "green" | "amber" | "red" | "gray";
}

export interface TaskData {
  id: string;
  taskCode: string; // e.g., "F1", "O12", "T9" — matches plan doc
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "blocked" | "review" | "done";
  priority: "critical" | "high" | "medium" | "low";
  assignee?: { name: string; initials: string; office?: string };
  dueDate?: string;
  workstream: string;
  workstreamColor?: string;
  phase: 1 | 2 | 3;
  milestoneId?: string;
  isCrossOffice?: boolean;
}

export interface MilestoneData {
  id: string;
  code: string; // e.g., "F-M1", "O-M2"
  name: string;
  workstream: string;
  workstreamColor: string;
  targetDate: string;
  status: "not_started" | "in_progress" | "at_risk" | "completed";
  phase: 1 | 2 | 3;
  linkedTaskCount: number;
  completedTaskCount: number;
}

export interface PhaseData {
  id: string;
  name: string;
  phaseNumber: 1 | 2 | 3;
  subtitle: string;
  startDay: number;
  endDay: number;
  startDate: string;
  endDate: string;
  status: "not_started" | "active" | "completed";
}

export interface DecisionGate {
  id: string;
  name: string;
  dayNumber: number;
  targetDate: string;
  phaseId: string;
  status: "upcoming" | "ready" | "passed" | "failed" | "deferred";
  criteria: string[];
  owner: string;
  outcome?: string;
}

export interface RiskData {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  status: "open" | "mitigating" | "resolved";
  mitigationPlan: string;
  owner: { name: string; initials: string };
  targetDate?: string;
  workstream?: string;
  linkedTaskIds: string[];
}

export interface ValueInitiative {
  id: string;
  name: string;
  category: "cost_savings" | "revenue_growth" | "cash_flow";
  description: string;
  targetDescription: string; // e.g., "+3-5% revenue"
  plannedImpact: number; // USD
  capturedImpact: number; // USD
  status: "planned" | "in_progress" | "capturing" | "captured";
  owner: { name: string; initials: string };
  workstream?: string;
}

export interface ValueSnapshot {
  month: string; // e.g., "Apr 2026"
  planned: number;
  captured: number;
}

export interface MetricData {
  id: string;
  name: string;
  value: string;
  target: string;
  unit?: string;
  status: "green" | "amber" | "red" | "gray";
  trend?: "up" | "down" | "flat";
  category: "financial" | "operations" | "technology" | "people";
}

export interface PillarSubItem {
  label: string;
  value: string;
  status: "green" | "amber" | "red" | "gray";
}

export interface PillarMetric {
  id: string;
  pillar: string;
  name: string;
  icon: string;
  overallStatus: "green" | "amber" | "red" | "gray";
  headline: string;
  headlineLabel: string;
  subItems: PillarSubItem[];
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timeAgo: string;
  type: "created" | "completed" | "commented" | "updated";
}
