"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { TaskModal } from "@/components/task-modal";
import { TaskRow } from "./plan/plan-content";
import { OverdueCard, WeekCard, groupTasks } from "./my-tasks/my-tasks-content";
import type {
  PhaseData,
  DecisionGate,
  TaskData,
  FinancialPulseMetric,
  PillarMetric,
  WorkstreamData,
  UserOption,
} from "@/lib/data";
import type { CurrentUser } from "@/lib/supabase/get-current-user";
import type { TranslationKey } from "@/lib/i18n/translations";

// ─── Types ───────────────────────────────────────────────────────

interface DashboardContentProps {
  currentDay: number;
  stats: { total: number; done: number; active: number; blocked: number; overdue: number };
  phases: PhaseData[];
  gates: DecisionGate[];
  attentionItems: {
    id: string;
    type: "gate" | "task";
    title: string;
    subtitle: string;
    badge: string;
    badgeColor: string;
    borderColor: string;
    taskCode?: string;
    workstreamColor?: string;
  }[];
  financialPulse: FinancialPulseMetric[];
  pillars: PillarMetric[];
  myTasks: TaskData[];
  allTasks: TaskData[];
  workstreams: WorkstreamData[];
  currentUser: CurrentUser | null;
  userOptions: UserOption[];
}

// ─── Shared display constants ─────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  gray: "bg-slate-600",
};

const STATUS_TEXT: Record<string, string> = {
  green: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  gray: "text-slate-500",
};

const TREND_ICONS: Record<string, { icon: string; color: string }> = {
  up: { icon: "trending_up", color: "text-emerald-400" },
  down: { icon: "trending_down", color: "text-red-400" },
  flat: { icon: "trending_flat", color: "text-slate-500" },
};

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0, high: 1, medium: 2, low: 3,
};

const PRIORITY_CONFIG: Record<string, { key: TranslationKey; text: string; border: string; opacity: string }> = {
  critical: { key: "priority_critical", text: "text-red-400",    border: "border-red-400",    opacity: "" },
  high:     { key: "priority_high",     text: "text-amber-400",  border: "border-amber-400",  opacity: "" },
  medium:   { key: "priority_medium",   text: "text-slate-400",  border: "border-slate-600",  opacity: "" },
  low:      { key: "priority_low",      text: "text-slate-500",  border: "border-slate-700",  opacity: "opacity-70" },
};

const WORKSTREAM_KEYS: Record<string, TranslationKey> = {
  "Finance": "ws_Finance",
  "Operations": "ws_Operations",
  "Sales": "ws_Sales",
  "Brand & Marketing": "ws_BrandMarketing",
  "Technology & AI": "ws_TechnologyAI",
  "Organization & HR": "ws_OrgHR",
};

// ─── Main component ───────────────────────────────────────────────

export function DashboardContent({
  currentDay,
  stats,
  phases,
  gates,
  attentionItems,
  financialPulse,
  pillars,
  myTasks,
  allTasks,
  workstreams,
  currentUser,
  userOptions,
}: DashboardContentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const daysRemaining = Math.max(0, 100 - currentDay);

  // ── Project Tasks state ──────────────────────────────────────
  const [activePhaseNum, setActivePhaseNum] = useState<1 | 2 | 3>(1);
  const [activeWorkstream, setActiveWorkstream] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const canWrite = currentUser?.isAdmin || currentUser?.isContributor;

  function openEdit(task: TaskData) {
    router.push(`/tasks/${task.id}`);
  }

  // ── My Queue ─────────────────────────────────────────────────
  const { overdue: myOverdue, thisWeek: myThisWeek, later: myLater } = groupTasks(myTasks);
  const myActiveCount = myTasks.filter((t) => t.status !== "done").length;

  // ── Project Tasks ─────────────────────────────────────────────
  let filtered = allTasks.filter((t) => t.phase === activePhaseNum);
  if (activeWorkstream) {
    filtered = filtered.filter((t) => t.workstream === activeWorkstream);
  }
  const activeTasks = filtered.filter((t) => t.status !== "done");
  const doneTasks = filtered.filter((t) => t.status === "done");

  const priorityGroups = (["critical", "high", "medium", "low"] as const).map((priority) => {
    const groupTasks2 = activeTasks
      .filter((t) => t.priority === priority)
      .sort((a, b) => {
        const statusOrder: Record<string, number> = { blocked: 0, in_progress: 1, review: 2, todo: 3 };
        return (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
      });
    return { priority, tasks: groupTasks2 };
  }).filter((g) => g.tasks.length > 0);

  // Workstream health data
  const wsHealth = workstreams.map((ws) => {
    const wsTasks = allTasks.filter((t) => t.workstream === ws.name && t.phase === activePhaseNum);
    const done = wsTasks.filter((t) => t.status === "done").length;
    const blocked = wsTasks.filter((t) => t.status === "blocked").length;
    const total = wsTasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { ...ws, done, blocked, total, pct };
  }).filter((ws) => ws.total > 0);

  return (
    <div className="space-y-10">
      {/* ── Section 1: Hero ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="font-serif text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
              {t("dash_dayPrefix")} {currentDay}<span className="text-slate-500"> {t("dash_of100")}</span>
            </h1>
            <p className="mt-3 text-lg text-[#dfc299] font-serif italic">
              {daysRemaining} {t("dash_daysRemaining")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: "schedule", color: "text-amber-400", count: stats.overdue, labelKey: "dash_overdue" as const },
              { icon: "block", color: "text-red-400", count: stats.blocked, labelKey: "dash_blocked" as const },
              { icon: "play_circle", color: "text-[#b4c5ff]", count: stats.active, labelKey: "dash_inProgress" as const },
              { icon: "check_circle", color: "text-emerald-400", count: stats.done, labelKey: "dash_completed" as const },
            ].map((pill) => (
              <span key={pill.labelKey} className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
                <span className={`material-symbols-outlined ${pill.color} text-base`}>{pill.icon}</span>
                <span className="tabular-nums font-medium text-white">{pill.count}</span>
                <span className="text-slate-500">{t(pill.labelKey)}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-end text-right space-y-4">
          <p className="font-serif text-7xl lg:text-8xl font-light tabular-nums text-white tracking-tight">
            {completionPct}
            <span className="text-4xl text-slate-500">%</span>
          </p>
          <div className="w-full max-w-xs">
            <div className="h-2 rounded-full bg-[#171f32] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#b4c5ff] transition-all duration-700"
                style={{ width: `${Math.max(completionPct, 1)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500 tabular-nums">
              {stats.done} {t("dash_of")} {stats.total} {t("dash_tasksComplete")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: My Queue ──────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-[#b4c5ff] text-lg">assignment_turned_in</span>
          <h2 className="font-serif text-2xl text-white">{t("dash_myQueue")}</h2>
          {myActiveCount > 0 && (
            <span className="ml-2 rounded-full bg-[#b4c5ff]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#b4c5ff]">
              {myActiveCount}
            </span>
          )}
        </div>

        {myTasks.length === 0 ? (
          <div className="rounded-lg bg-[#131b2d] p-5 text-sm text-slate-500">
            {t("dash_noAssignedTasks")}
          </div>
        ) : (
          <div className="space-y-3">
            {myOverdue.map((task) => <OverdueCard key={task.id} task={task} />)}
            {myThisWeek.map((task) => <WeekCard key={task.id} task={task} />)}
            {myLater.length > 0 && (
              <p className="text-center text-[11px] text-slate-600 py-1">
                + {myLater.length} {t("dash_moreLater")}
              </p>
            )}
            {myOverdue.length === 0 && myThisWeek.length === 0 && myLater.length === 0 && (
              <div className="rounded-lg bg-[#131b2d] p-5 text-sm text-slate-500">
                {t("dash_noAssignedTasks")}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Section 3: Phase Timeline ──────────────────────── */}
      <section className="rounded-lg bg-[#131b2d] p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#dfc299] text-lg">timeline</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {t("dash_integrationTimeline")}
          </span>
        </div>

        <div className="relative">
          <div className="flex h-10 rounded-lg overflow-hidden">
            {phases.map((phase) => {
              const widthPct = ((phase.endDay - phase.startDay + 1) / 100) * 100;
              const isActive = currentDay >= phase.startDay && currentDay <= phase.endDay;
              return (
                <div
                  key={phase.id}
                  className={`relative flex items-center px-3 ${
                    isActive ? "bg-[#1a2744]" : "bg-[#171f32]"
                  } ${phase.phaseNumber < 3 ? "border-r border-slate-700/50" : ""}`}
                  style={{ width: `${widthPct}%` }}
                >
                  <span className={`text-[10px] uppercase tracking-wider truncate ${
                    isActive ? "text-[#b4c5ff] font-semibold" : "text-slate-600"
                  }`}>
                    {phase.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute top-0 h-10 w-0.5 bg-[#b4c5ff]" style={{ left: `${currentDay}%` }}>
            <div className="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-[#b4c5ff] border-2 border-[#131b2d]" />
          </div>

          {gates.map((gate) => (
            <div
              key={gate.id}
              className="absolute top-full mt-1"
              style={{ left: `${gate.dayNumber}%`, transform: "translateX(-50%)" }}
            >
              <div className="flex flex-col items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[#dfc299]" />
                <span className="text-[9px] text-slate-600 tabular-nums mt-0.5">{gate.dayNumber}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex mt-6 gap-4">
          {phases.map((phase) => {
            const isActive = currentDay >= phase.startDay && currentDay <= phase.endDay;
            return (
              <div key={phase.id} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[#b4c5ff]" : "bg-slate-700"}`} />
                <span className={`text-[11px] ${isActive ? "text-slate-300" : "text-slate-600"}`}>
                  {t("dash_phase")} {phase.phaseNumber}: {phase.startDate} – {phase.endDate}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 4: Needs Attention ─────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-amber-400 text-lg">priority_high</span>
          <h2 className="font-serif text-2xl text-white">{t("dash_needsAttention")}</h2>
          {attentionItems.length > 0 && (
            <span className="ml-auto text-[10px] uppercase tracking-widest text-slate-500">
              {attentionItems.length} {t("dash_items")}
            </span>
          )}
        </div>

        {attentionItems.length === 0 ? (
          <div className="rounded-lg bg-[#131b2d] p-5 text-sm text-slate-500">
            {t("dash_allClear")}
          </div>
        ) : (
          <div className="space-y-3">
            {attentionItems.slice(0, 8).map((item) => (
              <Link
                key={item.id}
                href={item.type === "task" ? `/tasks/${item.id}` : "/decisions"}
                className={`block rounded-lg bg-[#131b2d] border-l-2 ${item.borderColor} p-4 hover:bg-[#1a2540] active:scale-[0.98] active:opacity-75 transition-all`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === "gate" ? (
                        <span className="text-[10px] uppercase tracking-wider text-[#dfc299] font-semibold">{t("dash_gate")}</span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          {item.taskCode}
                        </span>
                      )}
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${item.badgeColor}`}>
                        {item.badge === "Critical" ? t("dash_critical") :
                         item.badge === "Blocked" ? t("status_blocked") :
                         item.badge === "Overdue" ? t("dash_overdue") :
                         item.badge.startsWith("Day ") ? `${t("plan_day")} ${item.badge.slice(4)}` :
                         item.badge}
                      </span>
                    </div>
                    <p className="text-sm text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{item.subtitle}</p>
                  </div>
                  {item.type === "task" && item.workstreamColor && (
                    <div className="h-2 w-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: item.workstreamColor }} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Section 5: Project Tasks ───────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">task_alt</span>
            <h2 className="font-serif text-2xl text-white">{t("dash_projectTasks")}</h2>
          </div>
          {canWrite && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#1a2744] hover:bg-[#1f3060] border border-[#b4c5ff]/20 text-[#b4c5ff] text-xs font-medium px-4 py-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {t("tasks_newTask")}
            </button>
          )}
        </div>

        {/* Workstream health grid */}
        {wsHealth.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {/* All pill */}
            <button
              onClick={() => setActiveWorkstream(null)}
              className={`rounded-lg p-3 border text-left transition-all ${
                activeWorkstream === null
                  ? "bg-[#1a2744] border-[#b4c5ff]/30"
                  : "bg-[#131b2d] border-slate-700/40 hover:bg-[#171f32]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${
                  activeWorkstream === null ? "text-[#b4c5ff]" : "text-slate-400"
                }`}>
                  {t("dash_allWorkstreams")}
                </span>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {allTasks.filter((t) => t.phase === activePhaseNum && t.status === "done").length}/
                  {allTasks.filter((t) => t.phase === activePhaseNum).length}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[#171f32] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#b4c5ff]"
                  style={{
                    width: `${allTasks.filter((t) => t.phase === activePhaseNum).length > 0
                      ? Math.round((allTasks.filter((t) => t.phase === activePhaseNum && t.status === "done").length / allTasks.filter((t) => t.phase === activePhaseNum).length) * 100)
                      : 0}%`,
                  }}
                />
              </div>
            </button>

            {wsHealth.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWorkstream(activeWorkstream === ws.name ? null : ws.name)}
                className={`rounded-lg p-3 border text-left transition-all ${
                  activeWorkstream === ws.name
                    ? "bg-[#1a2744] border-[#b4c5ff]/30"
                    : "bg-[#131b2d] border-slate-700/40 hover:bg-[#171f32]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: ws.color }} />
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 truncate">
                      {WORKSTREAM_KEYS[ws.name] ? t(WORKSTREAM_KEYS[ws.name]) : ws.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {ws.blocked > 0 && (
                      <span className="text-[9px] font-semibold text-red-400 bg-red-400/10 rounded px-1.5 py-0.5">
                        {ws.blocked} blocked
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 tabular-nums">{ws.done}/{ws.total}</span>
                  </div>
                </div>
                <div className="h-1 rounded-full bg-[#171f32] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#b4c5ff] transition-all"
                    style={{ width: `${Math.max(ws.pct, ws.total > 0 ? 1 : 0)}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Phase tabs */}
        <div className="rounded-lg bg-[#131b2d] border border-slate-700/40 overflow-hidden mb-5">
          <div className="flex">
            {phases.map((phase) => {
              const isSelected = phase.phaseNumber === activePhaseNum;
              const phaseTasks = allTasks.filter((t) => t.phase === phase.phaseNumber);
              const phaseDone = phaseTasks.filter((t) => t.status === "done").length;
              return (
                <button
                  key={phase.id}
                  onClick={() => { setActivePhaseNum(phase.phaseNumber as 1 | 2 | 3); setShowDone(false); }}
                  className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                    isSelected
                      ? "bg-[#1a2744] border-b-2 border-[#b4c5ff]"
                      : "hover:bg-[#171f32] border-b-2 border-transparent"
                  }`}
                >
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                    isSelected ? "text-[#b4c5ff]" : "text-slate-500"
                  }`}>
                    {t("plan_phase")} {phase.phaseNumber}
                  </span>
                  <span className={`text-xs mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-600"}`}>
                    {phase.name}
                  </span>
                  <span className="text-[10px] text-slate-600 mt-0.5 tabular-nums">
                    {phaseDone}/{phaseTasks.length} {t("plan_done")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Task list (priority-grouped) */}
        <div className="space-y-5">
          {priorityGroups.map((group) => {
            const cfg = PRIORITY_CONFIG[group.priority];
            return (
              <div key={group.priority}>
                <div className={`flex items-center gap-3 mb-3 border-l-2 ${cfg.border} pl-3`}>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold ${cfg.text}`}>
                    {t(cfg.key)}
                  </span>
                  <span className="text-[10px] text-slate-600 tabular-nums">{group.tasks.length}</span>
                </div>
                <div className={`space-y-1.5 ${cfg.opacity}`}>
                  {group.tasks.map((task) => (
                    <TaskRow key={task.id} task={task} onEdit={openEdit} />
                  ))}
                </div>
              </div>
            );
          })}

          {priorityGroups.length === 0 && doneTasks.length === 0 && (
            <div className="rounded-lg bg-[#131b2d] p-8 text-center text-sm text-slate-500">
              {t("plan_noTasks")}{activeWorkstream ? ` ${t("plan_noTasksFor")} ${activeWorkstream}` : ""}.
            </div>
          )}

          {doneTasks.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowDone(!showDone)}
                className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {showDone ? "expand_less" : "expand_more"}
                </span>
                {doneTasks.length} {t("plan_completedCount")}
              </button>
              {showDone && (
                <div className="space-y-1.5 mt-2 opacity-50">
                  {doneTasks.map((task) => (
                    <TaskRow key={task.id} task={task} onEdit={openEdit} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decision Gates for active phase */}
        {(() => {
          const phaseGates = gates.filter((g) => g.phaseId === `phase-${activePhaseNum}`);
          if (phaseGates.length === 0) return null;
          return (
            <div className="mt-8">
              <h3 className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold mb-3">
                {t("plan_decisionGates")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {phaseGates.map((gate) => {
                  const isPassed = gate.status === "passed";
                  return (
                    <div
                      key={gate.id}
                      className={`rounded-lg border p-4 ${
                        isPassed
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-[#dfc299]/20 bg-[#131b2d]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`material-symbols-outlined text-sm ${
                          isPassed ? "text-emerald-400" : "text-[#dfc299]"
                        }`}>
                          {isPassed ? "check_circle" : "door_front"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                          {t("plan_day")} {gate.dayNumber} · {gate.targetDate}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200">{gate.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{gate.owner}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── Section 6: Financial Pulse ─────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">{t("dash_financialPulse")}</h2>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">{t("dash_liveData")}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {financialPulse.map((metric) => (
            <div key={metric.id} className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-4 flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                {metric.label}
              </span>
              <div className="flex items-end gap-2">
                <p className={`text-2xl font-light tabular-nums ${STATUS_TEXT[metric.status]}`}>
                  {metric.value}
                </p>
                {metric.trend && (
                  <span className={`material-symbols-outlined text-base mb-1 ${TREND_ICONS[metric.trend].color}`}>
                    {TREND_ICONS[metric.trend].icon}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">{metric.subLabel}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 7: Strategic Pillars ───────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">{t("dash_strategicPillars")}</h2>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            {t("dash_100dayPriorities")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => (
            <div key={pillar.id} className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-slate-500 text-lg">{pillar.icon}</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                    {pillar.name}
                  </span>
                </div>
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[pillar.overallStatus]}`} />
              </div>

              <div>
                <p className={`text-3xl font-light tabular-nums ${STATUS_TEXT[pillar.overallStatus]}`}>
                  {pillar.headline}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{pillar.headlineLabel}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/50">
                {pillar.subItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[item.status]}`} />
                      <span className="text-[12px] text-slate-400 truncate">{item.label}</span>
                    </div>
                    <span className={`text-[11px] tabular-nums shrink-0 ${STATUS_TEXT[item.status]}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Task Modal ─────────────────────────────────────── */}
      {currentUser && (
        <TaskModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          task={null}
          workstreams={workstreams}
          userOptions={userOptions}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
