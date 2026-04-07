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
import { isOverdue, calcDayNumber } from "@/lib/utils";
import type { WorkstreamData } from "./types";

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
  return demoMilestones.map((m) => {
    const linked = demoTasks.filter((t) => t.milestoneId === m.id);
    return {
      ...m,
      linkedTaskCount: linked.length,
      completedTaskCount: linked.filter((t) => t.status === "done").length,
    };
  });
}

export function getWorkstreams(): WorkstreamData[] {
  return demoWorkstreams.map((ws) => {
    const wsTasks = demoTasks.filter((t) => t.workstream === ws.name);
    return {
      ...ws,
      taskCount: wsTasks.length,
      completed: wsTasks.filter((t) => t.status === "done").length,
    };
  });
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

export function getTasksForRisk(riskId: string) {
  const risk = demoRisks.find((r) => r.id === riskId);
  if (!risk) return [];
  return demoTasks.filter((t) => risk.linkedTaskCodes.includes(t.id));
}

export function getLinkedTasksMap() {
  const map: Record<string, typeof demoTasks> = {};
  for (const risk of demoRisks) {
    map[risk.id] = demoTasks.filter((t) => risk.linkedTaskCodes.includes(t.id));
  }
  return map;
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
  return calcDayNumber(goLiveDate ?? "2026-04-01", totalDays);
}

// Convert a date string ("Apr 7" or "2026-04-07") to a day number (1-100)
// relative to the configured project start date.
function dateToDayNumber(dateStr: string): number {
  const startIso = compassConfig.goLiveDate ?? "2026-04-01";
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const projectStart = new Date(sy, sm - 1, sd);

  // Handle ISO format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const target = new Date(y, m - 1, d);
    return Math.floor((target.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Handle short display format: "Apr 7"
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6,
    Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length !== 2 || months[parts[0]] === undefined) return 999;
  const day = parseInt(parts[1]);
  if (isNaN(day)) return 999;
  const target = new Date(projectStart.getFullYear(), months[parts[0]], day);
  return Math.floor((target.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
