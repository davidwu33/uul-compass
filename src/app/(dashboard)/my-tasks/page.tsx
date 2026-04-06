"use client";

import { useState } from "react";
import { getTasksByAssignee } from "@/lib/data";
import type { TaskData } from "@/lib/data/types";

// ─── Constants ────────────────────────────────────────────────
const CURRENT_USER = "Jerry Shi";

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

// ─── Date helpers ─────────────────────────────────────────────
const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split(" ");
  if (parts.length !== 2) return null;
  const month = MONTHS[parts[0]];
  const day = parseInt(parts[1]);
  if (month === undefined || isNaN(day)) return null;
  return new Date(2026, month, day);
}

function isOverdue(dateStr: string): boolean {
  const d = parseDate(dateStr);
  return d ? new Date() > d : false;
}

function isThisWeek(dateStr: string): boolean {
  const d = parseDate(dateStr);
  if (!d) return false;
  const now = new Date();
  const weekOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return d >= now && d <= weekOut;
}

function relativeTime(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "1 day overdue";
  if (diffDays > 1) return `${diffDays} days overdue`;
  if (diffDays === -1) return "Due tomorrow";
  return `Due in ${Math.abs(diffDays)} days`;
}

// ─── Grouping ─────────────────────────────────────────────────
function groupTasks(tasks: TaskData[]) {
  const overdue: TaskData[] = [];
  const thisWeek: TaskData[] = [];
  const later: TaskData[] = [];
  const completed: TaskData[] = [];

  for (const task of tasks) {
    if (task.status === "done") {
      completed.push(task);
    } else if (task.dueDate && isOverdue(task.dueDate)) {
      overdue.push(task);
    } else if (task.dueDate && isThisWeek(task.dueDate)) {
      thisWeek.push(task);
    } else {
      later.push(task);
    }
  }

  const sortByPriority = (a: TaskData, b: TaskData) =>
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];

  overdue.sort(sortByPriority);
  thisWeek.sort(sortByPriority);
  later.sort(sortByPriority);

  return { overdue, thisWeek, later, completed };
}

// ─── Sub-components ───────────────────────────────────────────

function TaskCode({ code }: { code: string }) {
  return (
    <code className="font-mono text-xs text-slate-500 bg-[#2d3448] px-2 py-1 rounded">
      {code}
    </code>
  );
}

function CrossOfficeBadge({ task }: { task: TaskData }) {
  if (!task.isCrossOffice) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#1e2a42] px-2.5 py-0.5 text-[10px] text-slate-400 uppercase tracking-wider">
      <span className="material-symbols-outlined text-xs">public</span>
      Cross-Office
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority !== "critical" && priority !== "high") return null;
  return (
    <span className="inline-flex items-center rounded-full bg-[#dfc299]/15 px-2.5 py-0.5 text-[10px] text-[#dfc299] font-semibold uppercase tracking-wider">
      Priority
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-blue-400">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        In Progress
      </span>
    );
  }
  if (status === "blocked") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        Blocked
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#b4c5ff]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b4c5ff]" />
        In Progress
      </span>
    );
  }
  return null;
}

function AssigneeAvatar({ assignee }: { assignee: TaskData["assignee"] }) {
  if (!assignee) return null;
  return (
    <div className="h-7 w-7 rounded-full bg-[#2d3448] flex items-center justify-center text-[10px] font-semibold text-slate-400 shrink-0">
      {assignee.initials}
    </div>
  );
}

// ─── Card variants ────────────────────────────────────────────

function OverdueCard({ task }: { task: TaskData }) {
  return (
    <div className="relative rounded-lg bg-[#131b2d] p-4 pl-6 flex items-center gap-4">
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-red-500" />

      <TaskCode code={task.taskCode} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-lg text-blue-100 truncate">{task.title}</p>
          <CrossOfficeBadge task={task} />
        </div>
        <div className="flex items-center gap-3 mt-1">
          {task.dueDate && (
            <span className="text-[11px] text-red-400 tabular-nums">
              {relativeTime(task.dueDate)}
            </span>
          )}
          <StatusDot status={task.status} />
        </div>
      </div>

      <button className="shrink-0 rounded bg-red-500/20 border border-red-500/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-300 hover:bg-red-500/30 transition-colors">
        Execute
      </button>
    </div>
  );
}

function WeekCard({ task }: { task: TaskData }) {
  return (
    <div className="relative rounded-lg bg-[#131b2d] p-4 pl-6 flex items-center gap-4">
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-blue-500" />

      <TaskCode code={task.taskCode} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-lg text-blue-100 truncate">{task.title}</p>
          <CrossOfficeBadge task={task} />
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="flex items-center gap-3 mt-1">
          {task.dueDate && (
            <span className="text-[11px] text-slate-500 tabular-nums">
              Due {task.dueDate}
            </span>
          )}
          <StatusDot status={task.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <AssigneeAvatar assignee={task.assignee} />
        {(
          <button className="rounded bg-[#b4c5ff]/15 border border-[#b4c5ff]/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#b4c5ff] hover:bg-[#b4c5ff]/25 transition-colors">
            Execute
          </button>
        )}
      </div>
    </div>
  );
}

function LaterCard({ task }: { task: TaskData }) {
  return (
    <div className="relative rounded-lg bg-[#131b2d]/60 p-4 pl-6 flex items-center gap-4">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-slate-600" />
      <TaskCode code={task.taskCode} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-slate-300 truncate">{task.title}</p>
          <CrossOfficeBadge task={task} />
        </div>
        <div className="flex items-center gap-3 mt-1">
          {task.dueDate && (
            <span className="text-[11px] text-slate-500 tabular-nums">
              Due {task.dueDate}
            </span>
          )}
          <StatusDot status={task.status} />
        </div>
      </div>
      <AssigneeAvatar assignee={task.assignee} />
    </div>
  );
}

function CompletedCard({ task }: { task: TaskData }) {
  return (
    <div className="relative rounded-lg bg-[#131b2d]/40 p-4 pl-6 flex items-center gap-4">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-emerald-600/50" />
      <TaskCode code={task.taskCode} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 line-through truncate">{task.title}</p>
      </div>
      <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
    </div>
  );
}

// ─── Collapsible section ──────────────────────────────────────

function CollapsibleSection({
  icon,
  title,
  titleColor,
  count,
  badgeText,
  badgeColor,
  defaultOpen = true,
  opacity,
  children,
}: {
  icon: string;
  title: string;
  titleColor: string;
  count: number;
  badgeText?: string;
  badgeColor?: string;
  defaultOpen?: boolean;
  opacity?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (count === 0) return null;

  return (
    <section className={opacity}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 mb-4 group cursor-pointer"
      >
        <span className={`material-symbols-outlined text-xl ${titleColor}`}>
          {icon}
        </span>
        <h2 className={`font-serif text-2xl ${titleColor}`}>{title}</h2>
        {badgeText && (
          <span
            className={`ml-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor}`}
          >
            {badgeText}
          </span>
        )}
        <span className="ml-auto material-symbols-outlined text-slate-600 text-lg transition-transform group-hover:text-slate-400">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function MyTasksPage() {
  const tasks = getTasksByAssignee(CURRENT_USER);
  const { overdue, thisWeek, later, completed } = groupTasks(tasks);
  const activeTasks = tasks.filter((t) => t.status !== "done");

  return (
    <div className="space-y-10">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-4">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#dfc299]">
            Operator Queue
          </span>
          <h1 className="font-serif text-5xl font-light tracking-tight text-white leading-[1.1]">
            Institutional Tasks
          </h1>
          <p className="text-sm text-slate-400 max-w-md">
            Personal directive queue. Overdue items require immediate action.
            Scheduled items are sequenced by priority.
          </p>
        </div>

        {/* Active Queue stat card */}
        <div className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] px-6 py-4 text-center shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
            Active Queue
          </p>
          <p className="font-serif text-4xl font-light tabular-nums text-white">
            {activeTasks.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#dfc299] mt-1">
            Directives
          </p>
        </div>
      </section>

      {/* ── Overdue ────────────────────────────────────────── */}
      <CollapsibleSection
        icon="error"
        title="Overdue Priorities"
        titleColor="text-red-400"
        count={overdue.length}
        badgeText={`${overdue.length} ACTIONS REQUIRED`}
        badgeColor="bg-red-500/20 text-red-400"
      >
        {overdue.map((task) => (
          <OverdueCard key={task.id} task={task} />
        ))}
      </CollapsibleSection>

      {/* ── This Week ──────────────────────────────────────── */}
      <CollapsibleSection
        icon="calendar_month"
        title="Scheduled This Week"
        titleColor="text-blue-200"
        count={thisWeek.length}
        badgeText={`${thisWeek.length}`}
        badgeColor="bg-[#b4c5ff]/15 text-[#b4c5ff]"
      >
        {thisWeek.map((task) => (
          <WeekCard key={task.id} task={task} />
        ))}
      </CollapsibleSection>

      {/* ── Later (collapsed, muted) ──────────────────────── */}
      <CollapsibleSection
        icon="schedule"
        title="Deferred &amp; Future"
        titleColor="text-slate-400"
        count={later.length}
        badgeText={`${later.length}`}
        badgeColor="bg-slate-700 text-slate-400"
        defaultOpen={false}
        opacity="opacity-60 hover:opacity-100 transition-opacity"
      >
        {later.map((task) => (
          <LaterCard key={task.id} task={task} />
        ))}
      </CollapsibleSection>

      {/* ── Completed (collapsed, dimmer) ─────────────────── */}
      <CollapsibleSection
        icon="check_circle"
        title="Directive Archives"
        titleColor="text-slate-500"
        count={completed.length}
        badgeText={`${completed.length}`}
        badgeColor="bg-emerald-500/10 text-emerald-500"
        defaultOpen={false}
        opacity="opacity-40 hover:opacity-80 transition-opacity"
      >
        {completed.map((task) => (
          <CompletedCard key={task.id} task={task} />
        ))}
      </CollapsibleSection>

      {/* ── Empty state ────────────────────────────────────── */}
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">
            task_alt
          </span>
          <p className="font-serif text-xl text-slate-400">
            No directives assigned
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Tasks assigned to you will appear here
          </p>
        </div>
      )}

      {/* ── FAB ────────────────────────────────────────────── */}
      <button className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-[#b4c5ff] text-[#0a0f1c] shadow-lg shadow-[#b4c5ff]/20 flex items-center justify-center hover:bg-[#c5d4ff] transition-colors z-50">
        <span className="material-symbols-outlined text-2xl">add_task</span>
      </button>
    </div>
  );
}
