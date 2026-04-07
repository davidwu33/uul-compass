import {
  getTaskStats,
  getPhases,
  getGates,
  getPillarScorecard,
  getFinancialPulse,
  getNeedsAttention,
  getUpcomingDecisions,
  getCurrentDay,
} from "@/lib/data";

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

export default async function DashboardPage() {
  const [stats, phases, gates, attentionTasks, decisions, currentDay] = await Promise.all([
    getTaskStats(),
    getPhases(),
    getGates(),
    getNeedsAttention(),
    getUpcomingDecisions(),
    getCurrentDay(),
  ]);
  const pillars = getPillarScorecard();
  const financialPulse = getFinancialPulse();
  const completionPct =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const daysRemaining = Math.max(0, 100 - currentDay);

  // Merge all attention items into one prioritized list
  const attentionItems = [
    ...decisions.gates.map((g) => ({ type: "gate" as const, id: g.id, title: g.name, subtitle: `${g.owner} · ${g.targetDate}`, badge: `Day ${g.dayNumber}`, badgeColor: "text-[#dfc299]", borderColor: "border-[#dfc299]" })),
    ...attentionTasks.map((t) => ({ type: "task" as const, id: t.id, title: t.title, subtitle: `${t.assignee?.name || "Unassigned"}${t.dueDate ? ` · Due ${t.dueDate}` : ""}`, badge: t.status === "blocked" ? "Blocked" : "Overdue", badgeColor: t.status === "blocked" ? "text-red-400" : "text-amber-400", borderColor: t.status === "blocked" ? "border-red-400" : "border-amber-400", taskCode: t.taskCode, workstreamColor: t.workstreamColor })),
    ...decisions.criticalTasks.filter((ct) => !attentionTasks.some((at) => at.id === ct.id)).map((t) => ({ type: "task" as const, id: t.id, title: t.title, subtitle: `${t.assignee?.name || "Unassigned"}${t.dueDate ? ` · Due ${t.dueDate}` : ""}`, badge: "Critical", badgeColor: "text-red-400", borderColor: "border-red-400", taskCode: t.taskCode, workstreamColor: t.workstreamColor })),
  ];

  return (
    <div className="space-y-10">
      {/* ── Section 1: Hero ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="font-serif text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
              Day {currentDay}
              <span className="text-slate-500"> of 100</span>
            </h1>
            <p className="mt-3 text-lg text-[#dfc299] font-serif italic">
              {daysRemaining} days remaining
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: "schedule", color: "text-amber-400", count: stats.overdue, label: "Overdue" },
              { icon: "block", color: "text-red-400", count: stats.blocked, label: "Blocked" },
              { icon: "play_circle", color: "text-[#b4c5ff]", count: stats.active, label: "In Progress" },
              { icon: "check_circle", color: "text-emerald-400", count: stats.done, label: "Completed" },
            ].map((pill) => (
              <span key={pill.label} className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
                <span className={`material-symbols-outlined ${pill.color} text-base`}>{pill.icon}</span>
                <span className="tabular-nums font-medium text-white">{pill.count}</span>
                <span className="text-slate-500">{pill.label}</span>
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
              {stats.done} of {stats.total} tasks complete
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Phase Timeline ──────────────────────── */}
      <section className="rounded-lg bg-[#131b2d] p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#dfc299] text-lg">timeline</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Integration Timeline
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

          <div
            className="absolute top-0 h-10 w-0.5 bg-[#b4c5ff]"
            style={{ left: `${currentDay}%` }}
          >
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
                  Phase {phase.phaseNumber}: {phase.startDate} – {phase.endDate}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Needs Attention ─────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-amber-400 text-lg">priority_high</span>
          <h2 className="font-serif text-2xl text-white">Needs Attention</h2>
          {attentionItems.length > 0 && (
            <span className="ml-auto text-[10px] uppercase tracking-widest text-slate-500">
              {attentionItems.length} items
            </span>
          )}
        </div>

        {attentionItems.length === 0 ? (
          <div className="rounded-lg bg-[#131b2d] p-5 text-sm text-slate-500">
            All clear — no blocked, overdue, or pending decisions.
          </div>
        ) : (
          <div className="space-y-3">
            {attentionItems.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className={`rounded-lg bg-[#131b2d] border-l-2 ${item.borderColor} p-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === "gate" ? (
                        <span className="text-[10px] uppercase tracking-wider text-[#dfc299] font-semibold">Gate</span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          {(item as { taskCode?: string }).taskCode}
                        </span>
                      )}
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-sm text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{item.subtitle}</p>
                  </div>
                  {item.type === "task" && (item as { workstreamColor?: string }).workstreamColor && (
                    <div
                      className="h-2 w-2 rounded-full shrink-0 mt-2"
                      style={{ backgroundColor: (item as { workstreamColor?: string }).workstreamColor }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Section 4: Financial Pulse ─────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">Financial Pulse</h2>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Live Data</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {financialPulse.map((metric) => (
            <div
              key={metric.id}
              className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-4 flex flex-col gap-3"
            >
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

      {/* ── Section 5: Strategic Pillars (3x2) ────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">Strategic Pillars</h2>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            100-Day Priorities
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-5 flex flex-col gap-4"
            >
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
    </div>
  );
}
