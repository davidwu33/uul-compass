import {
  getTaskStats,
  getWorkstreams,
  getNextGate,
  getScorecard,
  getNeedsAttention,
  getUpcomingMilestones,
  getCurrentDay,
} from "@/lib/data";

const SCORECARD_ICONS: Record<string, string> = {
  financial: "speed",
  operations: "verified_user",
  technology: "hub",
  people: "payments",
};

const STATUS_COLORS: Record<string, string> = {
  green: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  gray: "text-slate-500",
};

const STATUS_BORDER: Record<string, string> = {
  green: "border-emerald-400",
  amber: "border-amber-400",
  red: "border-red-400",
  gray: "border-slate-600",
};

const TREND_ARROWS: Record<string, string> = {
  up: "arrow_upward",
  down: "arrow_downward",
  flat: "arrow_forward",
};

export default function DashboardPage() {
  const stats = getTaskStats();
  const workstreams = getWorkstreams();
  const nextGate = getNextGate();
  const scorecard = getScorecard();
  const attentionTasks = getNeedsAttention();
  const milestones = getUpcomingMilestones(5);
  const currentDay = getCurrentDay();
  const completionPct =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const daysRemaining = Math.max(0, 100 - currentDay);

  // Status logic
  let statusLabel = "On Track";
  let dotColor = "bg-emerald-400";
  if (stats.overdue > 2 || stats.blocked > 2) {
    statusLabel = "At Risk";
    dotColor = "bg-red-400";
  } else if (stats.overdue > 0 || stats.blocked > 0) {
    statusLabel = "Needs Attention";
    dotColor = "bg-amber-400";
  }

  return (
    <div className="space-y-10">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${dotColor} animate-pulse`}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {statusLabel}
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="font-serif text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
              Institutional
              <br />
              Progress Audit
            </h1>
            <p className="mt-3 text-lg text-[#dfc299] font-serif italic">
              100-Day Post-Merger Integration
            </p>
          </div>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
              <span className="material-symbols-outlined text-emerald-400 text-base">
                check_circle
              </span>
              <span className="tabular-nums font-medium text-white">
                {stats.done}
              </span>
              <span className="text-slate-500">Done</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
              <span className="material-symbols-outlined text-[#b4c5ff] text-base">
                play_circle
              </span>
              <span className="tabular-nums font-medium text-white">
                {stats.active}
              </span>
              <span className="text-slate-500">Active</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
              <span className="material-symbols-outlined text-amber-400 text-base">
                schedule
              </span>
              <span className="tabular-nums font-medium text-white">
                {stats.overdue}
              </span>
              <span className="text-slate-500">Overdue</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
              <span className="material-symbols-outlined text-red-400 text-base">
                block
              </span>
              <span className="tabular-nums font-medium text-white">
                {stats.blocked}
              </span>
              <span className="text-slate-500">Blocked</span>
            </span>
          </div>
        </div>

        {/* Right Column — Completion Ring */}
        <div className="lg:col-span-5 flex flex-col items-end text-right space-y-4">
          <p className="font-serif text-7xl lg:text-8xl font-light tabular-nums text-white tracking-tight">
            {completionPct}
            <span className="text-4xl text-slate-500">%</span>
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xs">
            <div className="h-2 rounded-full bg-[#171f32] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#b4c5ff] transition-all duration-700"
                style={{ width: `${Math.max(completionPct, 1)}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500 tabular-nums">
              {stats.done} of {stats.total} tasks complete &middot;{" "}
              {daysRemaining} days remaining
            </p>
          </div>
        </div>
      </section>

      {/* ── Scorecard Grid (2x2) ────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">Key Metrics</h2>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            Scorecard
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scorecard.map((metric) => (
            <div
              key={metric.id}
              className="relative h-44 rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-5 flex flex-col justify-between"
            >
              {/* Icon */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">
                    {metric.category}
                  </span>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {metric.name}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-600 text-xl">
                  {SCORECARD_ICONS[metric.category] || "analytics"}
                </span>
              </div>

              {/* Value */}
              <div className="flex items-end justify-between">
                <p
                  className={`text-4xl font-light tabular-nums ${STATUS_COLORS[metric.status]}`}
                >
                  {metric.value}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  {metric.trend && (
                    <span
                      className={`material-symbols-outlined text-sm ${
                        metric.trend === "up"
                          ? "text-emerald-400"
                          : metric.trend === "down"
                            ? "text-red-400"
                            : "text-slate-500"
                      }`}
                    >
                      {TREND_ARROWS[metric.trend]}
                    </span>
                  )}
                  <span className="tabular-nums">
                    Target: {metric.target}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Workstream Progress ──────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">
            Workstream Progress
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            Aggregated Data
          </span>
        </div>
        <div className="space-y-4">
          {workstreams.map((ws) => {
            const pct =
              ws.taskCount > 0
                ? Math.round((ws.completed / ws.taskCount) * 100)
                : 0;
            return (
              <div key={ws.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: ws.color }}
                    />
                    <span className="text-sm text-slate-300">{ws.name}</span>
                  </div>
                  <span className="text-sm tabular-nums text-slate-400">
                    {pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#171f32] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(pct, 1)}%`,
                      backgroundColor: ws.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Needs Attention + Upcoming Milestones ────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Critical Attention */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-red-400 text-lg">
              warning
            </span>
            <h2 className="font-serif text-2xl text-red-400">
              Critical Attention
            </h2>
          </div>
          {attentionTasks.length === 0 ? (
            <div className="rounded-lg bg-[#131b2d] p-5 text-sm text-slate-500">
              No blocked or overdue tasks.
            </div>
          ) : (
            <div className="space-y-3">
              {attentionTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg bg-red-500/10 border-l-2 border-red-400 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          {task.taskCode}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold ${
                            task.status === "blocked"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {task.status === "blocked" ? "Blocked" : "Overdue"}
                        </span>
                      </div>
                      <p className="text-sm text-white truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {task.dueDate && (
                          <span className="text-[11px] text-slate-500 tabular-nums">
                            Due {task.dueDate}
                          </span>
                        )}
                        {task.assignee && (
                          <span className="text-[11px] text-slate-500">
                            {task.assignee.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="h-2 w-2 rounded-full shrink-0 mt-2"
                      style={{ backgroundColor: task.workstreamColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Strategic Milestones */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#dfc299] text-lg">
              flag
            </span>
            <h2 className="font-serif text-2xl text-[#dfc299]">
              Strategic Milestones
            </h2>
          </div>
          {milestones.length === 0 ? (
            <div className="rounded-lg bg-[#131b2d] p-5 text-sm text-slate-500">
              All milestones completed.
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="rounded-lg bg-[#131b2d] p-4 flex items-center gap-4"
                >
                  {/* Date badge */}
                  <div className="shrink-0 w-14 h-14 rounded-lg bg-[#171f32] flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      {ms.targetDate.split(" ")[0]}
                    </span>
                    <span className="text-lg font-semibold tabular-nums text-white">
                      {ms.targetDate.split(" ")[1]}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{ms.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: ms.workstreamColor }}
                      />
                      <span className="text-[11px] text-slate-500">
                        {ms.workstream}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold ${
                          ms.status === "at_risk"
                            ? "text-amber-400"
                            : ms.status === "in_progress"
                              ? "text-[#b4c5ff]"
                              : "text-slate-500"
                        }`}
                      >
                        {ms.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <span className="material-symbols-outlined text-slate-600 text-lg shrink-0">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Next Decision Gate (if any) ──────────────────────── */}
      {nextGate && (
        <section className="rounded-lg bg-[#131b2d] border border-[#dfc299]/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#dfc299] text-lg">
              door_front
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Next Decision Gate
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-lg text-white">{nextGate.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                Day {nextGate.dayNumber} &middot; Target {nextGate.targetDate}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#dfc299] font-semibold">
              {nextGate.status}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
