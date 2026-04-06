// ─── Compass Data Layer ────────────────────────────────────────
// Demo data now, Supabase queries later.
// When Supabase connects, these functions become async and hit the DB.

export type {
  TaskData,
  MilestoneData,
  WorkstreamData,
  PhaseData,
  DecisionGate,
  RiskData,
  ValueInitiative,
  ValueSnapshot,
  MetricData,
  PillarMetric,
  PillarSubItem,
  FinancialPulseMetric,
  ActivityItem,
} from "./types";

import { demoTasks } from "./demo/tasks";
import { demoMilestones } from "./demo/milestones";
import { demoWorkstreams } from "./demo/workstreams";
import { demoPhases, demoGates } from "./demo/phases";
import { demoRisks } from "./demo/risks";
import { demoValueInitiatives, demoValueSnapshots } from "./demo/value-gains";
import { demoScorecard, demoPillarScorecard, demoAllMetrics, demoFinancialPulse } from "./demo/metrics";
import { compassConfig } from "./config";

// ─── Getters ───────────────────────────────────────────────────

export function getTasks() {
  return demoTasks;
}

export function getTasksByAssignee(name: string) {
  return demoTasks.filter((t) => t.assignee?.name === name);
}

export function getTasksByPhase(phase: 1 | 2 | 3) {
  return demoTasks.filter((t) => t.phase === phase);
}

export function getTasksByWorkstream(workstream: string) {
  return demoTasks.filter((t) => t.workstream === workstream);
}

export function getMilestones() {
  return demoMilestones;
}

export function getWorkstreams() {
  return demoWorkstreams;
}

export function getPhases() {
  return demoPhases;
}

export function getGates() {
  return demoGates;
}

export function getNextGate() {
  return demoGates.find((g) => g.status === "upcoming" || g.status === "ready");
}

export function getRisks() {
  return demoRisks;
}

export function getValueInitiatives() {
  return demoValueInitiatives;
}

export function getValueSnapshots() {
  return demoValueSnapshots;
}

export function getScorecard() {
  return demoScorecard;
}

export function getPillarScorecard() {
  return demoPillarScorecard;
}

export function getAllMetrics() {
  return demoAllMetrics;
}

export function getFinancialPulse() {
  return demoFinancialPulse;
}

// Tasks due within the next 7 days from current day position
export function getTasksDueThisWeek() {
  const currentDay = getCurrentDay();
  return demoTasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;
    const dayNum = dateToDayNumber(t.dueDate);
    return dayNum >= currentDay && dayNum <= currentDay + 7;
  });
}

// Upcoming decisions: gates within 14 days + critical tasks needing board input
export function getUpcomingDecisions() {
  const currentDay = getCurrentDay();
  const upcomingGates = demoGates.filter(
    (g) => g.status === "upcoming" && g.dayNumber >= currentDay && g.dayNumber <= currentDay + 14
  );
  const criticalTasks = demoTasks.filter((t) => {
    if (t.priority !== "critical" || t.status === "done" || !t.dueDate) return false;
    const dayNum = dateToDayNumber(t.dueDate);
    return dayNum >= currentDay && dayNum <= currentDay + 14;
  });
  return { gates: upcomingGates, criticalTasks };
}

// ─── Computed helpers ──────────────────────────────────────────

export function getTaskStats() {
  const all = demoTasks;
  const done = all.filter((t) => t.status === "done").length;
  const active = all.filter((t) => t.status === "in_progress").length;
  const blocked = all.filter((t) => t.status === "blocked").length;
  const overdue = all.filter(
    (t) => t.dueDate && t.status !== "done" && isOverdue(t.dueDate)
  ).length;
  return { total: all.length, done, active, blocked, overdue, open: all.length - done };
}

export function getNeedsAttention() {
  return demoTasks.filter(
    (t) =>
      t.status === "blocked" ||
      (t.dueDate && t.status !== "done" && isOverdue(t.dueDate))
  );
}

export function getUpcomingMilestones(limit = 5) {
  return demoMilestones
    .filter((m) => m.status !== "completed")
    .slice(0, limit);
}

export function getCurrentDay(): number {
  const { goLiveDate, totalDays } = compassConfig;
  if (!goLiveDate) return 1;
  const start = new Date(goLiveDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(totalDays, diff + 1));
}

// Convert "Apr 7" style date to day number (1-100) relative to Apr 1 start
function dateToDayNumber(dateStr: string): number {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6,
    Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length !== 2) return 999;
  const month = months[parts[0]];
  const day = parseInt(parts[1]);
  if (month === undefined || isNaN(day)) return 999;
  const target = new Date(2026, month, day);
  const start = new Date(2026, 3, 1); // Apr 1
  return Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

// Simple overdue check against "Apr 7" style dates
function isOverdue(dateStr: string): boolean {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6,
    Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length !== 2) return false;
  const month = months[parts[0]];
  const day = parseInt(parts[1]);
  if (month === undefined || isNaN(day)) return false;
  const dueDate = new Date(2026, month, day);
  return new Date() > dueDate;
}
