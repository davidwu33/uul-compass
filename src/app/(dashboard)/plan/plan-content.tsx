"use client";

import { useState } from "react";
import type {
  TaskData,
  WorkstreamData,
  PhaseData,
  DecisionGate,
  MilestoneData,
} from "@/lib/data";

// ─── Status column config ────────────────────────────────────────
const STATUS_COLUMNS = [
  { key: "todo" as const, label: "Pending Initiation", color: "#64748b", borderColor: "border-slate-500" },
  { key: "in_progress" as const, label: "Active Deployment", color: "#3b82f6", borderColor: "border-blue-500" },
  { key: "blocked" as const, label: "Impediments", color: "#ef4444", borderColor: "border-red-500" },
  { key: "review" as const, label: "Quality Assurance", color: "#dfc299", borderColor: "border-[#dfc299]" },
  { key: "done" as const, label: "Executed", color: "#22c55e", borderColor: "border-green-500" },
];

// ─── Props ───────────────────────────────────────────────────────
interface PlanContentProps {
  tasks: TaskData[];
  workstreams: WorkstreamData[];
  phases: PhaseData[];
  gates: DecisionGate[];
  milestones: MilestoneData[];
  currentDay: number;
  totalTasks: number;
  doneTasks: number;
  directivesPct: number;
}

export function PlanContent({
  tasks,
  workstreams,
  phases,
  gates,
  currentDay,
  totalTasks,
  doneTasks,
  directivesPct,
}: PlanContentProps) {
  const [activeWorkstream, setActiveWorkstream] = useState<string | null>(null);
  const [expandedProtocol, setExpandedProtocol] = useState(false);

  // ─── Filtering ──────────────────────────────────────────────────
  const filteredTasks = activeWorkstream
    ? tasks.filter((t) => t.workstream === activeWorkstream)
    : tasks;

  // ─── Active phase ───────────────────────────────────────────────
  const activePhase = phases.find((p) => p.status === "active") ?? phases[0];

  return (
    <div className="space-y-6">
      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight text-slate-100">
          UUL Compass:{" "}
          <span className="text-[#dfc299]">100-Day Operational Mandate</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
          Precision alignment and stabilization of cross-entity operations.
          Synchronized execution across Finance, Operations, Sales, Brand,
          Technology, and Organization workstreams.
        </p>
      </div>

      {/* ═══ Phase Timeline ═══════════════════════════════════════ */}
      <div className="rounded-lg bg-[#131b2d] border border-slate-700/40 border-t-2 border-t-[#dfc299]/40 overflow-hidden">
        {/* Phase segments */}
        <div className="flex h-12">
          {phases.map((phase) => {
            const isActive = phase.status === "active";
            return (
              <div
                key={phase.id}
                className={`flex-1 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-default ${
                  isActive
                    ? "bg-[#00389a] text-blue-200 border-b-2 border-blue-400"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className="material-symbols-outlined text-[14px] opacity-60">
                  {phase.phaseNumber === 1
                    ? "shield"
                    : phase.phaseNumber === 2
                    ? "tune"
                    : "rocket_launch"}
                </span>
                <span className="font-semibold">
                  Phase {phase.phaseNumber}: {phase.name}
                </span>
                <span className="hidden sm:inline opacity-60">
                  Days {phase.startDay}–{phase.endDay}
                </span>
              </div>
            );
          })}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-700/30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-slate-500">
                schedule
              </span>
              <span className="text-[11px] text-slate-400">
                Elapsed Time:{" "}
                <span className="text-slate-200 font-semibold tabular-nums">
                  {currentDay} Days
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-slate-500">
                check_circle
              </span>
              <span className="text-[11px] text-slate-400">
                Directives Met:{" "}
                <span className="text-slate-200 font-semibold tabular-nums">
                  {directivesPct}%
                </span>
              </span>
            </div>
          </div>
          <button
            onClick={() => setExpandedProtocol(!expandedProtocol)}
            className="text-[10px] tracking-[0.15em] uppercase text-[#dfc299]/80 hover:text-[#dfc299] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">
              {expandedProtocol ? "expand_less" : "expand_more"}
            </span>
            {expandedProtocol ? "Collapse Protocol" : "Expand Protocol"}
          </button>
        </div>

        {/* Expanded protocol: decision gates */}
        {expandedProtocol && (
          <div className="px-5 pb-4 border-t border-slate-700/30 pt-3">
            <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-3 font-semibold">
              Decision Gates
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {gates.map((gate) => {
                const isPassed = gate.status === "passed";
                const isReady = gate.status === "ready";
                return (
                  <div
                    key={gate.id}
                    className={`rounded-md border p-3 ${
                      isPassed
                        ? "border-green-500/30 bg-green-500/5"
                        : isReady
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-slate-700/40 bg-slate-800/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isPassed
                            ? "text-green-400"
                            : isReady
                            ? "text-blue-400"
                            : "text-slate-500"
                        }`}
                      >
                        {isPassed ? "check_circle" : isReady ? "pending" : "radio_button_unchecked"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                        Day {gate.dayNumber}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-300">
                      {gate.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {gate.owner}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Filter Pills ═════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveWorkstream(null)}
          className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all ${
            activeWorkstream === null
              ? "bg-[#00389a] text-blue-100 shadow-lg shadow-blue-900/20"
              : "bg-[#131b2d] text-slate-400 hover:text-slate-200 border border-slate-700/40"
          }`}
        >
          All Workstreams
        </button>
        {workstreams.map((ws) => (
          <button
            key={ws.id}
            onClick={() =>
              setActiveWorkstream(activeWorkstream === ws.name ? null : ws.name)
            }
            className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase font-semibold transition-all flex items-center gap-2 ${
              activeWorkstream === ws.name
                ? "bg-[#00389a] text-blue-100 shadow-lg shadow-blue-900/20"
                : "bg-[#131b2d] text-slate-400 hover:text-slate-200 border border-slate-700/40"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ws.color }}
            />
            {ws.name}
          </button>
        ))}
      </div>

      {/* ═══ Kanban Board ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATUS_COLUMNS.map((col) => {
          const columnTasks = filteredTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              {/* Column header */}
              <div
                className={`border-l-2 ${col.borderColor} pl-3 flex items-center justify-between`}
              >
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-slate-400">
                  {col.label}
                </span>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: col.color + "18",
                    color: col.color,
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} columnColor={col.color} />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-[11px] tracking-wider uppercase">
                    No directives
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Metric Dashboard (Bento) ═════════════════════════════ */}
      <div className="grid grid-cols-12 gap-4">
        {/* Resource Allocation Chart */}
        <div className="col-span-12 lg:col-span-8 bg-[#131b2d] rounded-lg border border-slate-700/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-semibold">
                Resource Allocation Drift
              </div>
              <div className="text-lg font-serif text-slate-200 mt-1">
                Task Distribution by Workstream
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-slate-600">
              bar_chart
            </span>
          </div>
          {/* Bar chart mockup */}
          <div className="flex items-end gap-3 h-40 pt-4">
            {workstreams.map((ws) => {
              const wsTasks = tasks.filter((t) => t.workstream === ws.name);
              const total = wsTasks.length;
              const done = wsTasks.filter((t) => t.status === "done").length;
              const active = wsTasks.filter(
                (t) => t.status === "in_progress"
              ).length;
              const barHeight = Math.max((total / 25) * 100, 8);
              const doneHeight = total > 0 ? (done / total) * barHeight : 0;
              const activeHeight =
                total > 0 ? (active / total) * barHeight : 0;

              return (
                <div
                  key={ws.id}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-sm relative overflow-hidden"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: ws.color + "20",
                    }}
                  >
                    {/* Done portion */}
                    <div
                      className="absolute bottom-0 w-full transition-all duration-500"
                      style={{
                        height: `${doneHeight + activeHeight}%`,
                        backgroundColor: ws.color + "60",
                      }}
                    />
                    <div
                      className="absolute bottom-0 w-full transition-all duration-500"
                      style={{
                        height: `${doneHeight}%`,
                        backgroundColor: ws.color,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 text-center leading-tight">
                    {ws.name.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/30">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="text-[10px] text-slate-500">Executed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500/50" />
              <span className="text-[10px] text-slate-500">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500/15" />
              <span className="text-[10px] text-slate-500">Pending</span>
            </div>
          </div>
        </div>

        {/* Command Center Status */}
        <div className="col-span-12 lg:col-span-4 bg-[#00389a] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-blue-300/60 font-semibold">
              Command Center
            </div>
            <div className="text-lg font-serif text-white mt-1">
              Operational Status
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <StatusRow
              icon="speed"
              label="Active Phase"
              value={activePhase?.name ?? "—"}
            />
            <StatusRow
              icon="assignment"
              label="Total Directives"
              value={`${totalTasks}`}
            />
            <StatusRow
              icon="check_circle"
              label="Executed"
              value={`${doneTasks} (${directivesPct}%)`}
            />
            <StatusRow
              icon="block"
              label="Impediments"
              value={`${tasks.filter((t) => t.status === "blocked").length}`}
            />
            <StatusRow
              icon="groups"
              label="Cross-Office"
              value={`${tasks.filter((t) => t.isCrossOffice).length} tasks`}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-blue-400/20">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="text-[11px] text-blue-200">
                System Operational — Day {currentDay}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Task Card ───────────────────────────────────────────────────
function TaskCard({
  task,
  columnColor,
}: {
  task: TaskData;
  columnColor: string;
}) {
  const isCritical = task.priority === "critical";
  const isInProgress = task.status === "in_progress";

  // Simulated progress for in-progress items
  const progressPct = isInProgress ? Math.floor(Math.random() * 40 + 20) : 0;

  return (
    <div
      className="bg-[#131b2d] p-4 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors"
      style={{ borderTopWidth: "2px", borderTopColor: columnColor }}
    >
      {/* Task code + critical badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-slate-500">
          {task.taskCode}
        </span>
        {isCritical && (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] tracking-[0.15em] uppercase text-red-400 font-semibold">
              Critical Path
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="font-serif text-sm text-slate-200 leading-snug mb-3">
        {task.title}
      </div>

      {/* Progress bar for in-progress */}
      {isInProgress && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] tracking-[0.1em] uppercase text-blue-400/70">
              {progressPct}% Synchronized
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-slate-600/50"
              style={{
                backgroundColor: task.workstreamColor
                  ? task.workstreamColor + "20"
                  : "#1e293b",
                color: task.workstreamColor ?? "#94a3b8",
              }}
            >
              {task.assignee.initials}
            </div>
            <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
              {task.assignee.name}
            </span>
          </div>
        ) : (
          <div />
        )}
        {task.dueDate && (
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">
            {task.dueDate}
          </span>
        )}
      </div>

      {/* Cross-office badge */}
      {task.isCrossOffice && (
        <div className="mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px] text-[#dfc299]/50">
            language
          </span>
          <span className="text-[9px] tracking-[0.1em] uppercase text-[#dfc299]/50">
            Cross-Office
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Status Row (Command Center) ─────────────────────────────────
function StatusRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-blue-300/50">
          {icon}
        </span>
        <span className="text-[11px] text-blue-200/70">{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-white tabular-nums">
        {value}
      </span>
    </div>
  );
}
