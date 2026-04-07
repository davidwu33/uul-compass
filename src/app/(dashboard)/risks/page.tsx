import { getRisks, getLinkedTasksMap } from "@/lib/data";
import type { TaskData } from "@/lib/data";

const severityOrder = { high: 0, medium: 1, low: 2 } as const;

const severityConfig = {
  high: {
    border: "border-red-400",
    badge: "text-red-400 bg-red-400/10",
    label: "High",
  },
  medium: {
    border: "border-amber-400",
    badge: "text-amber-400 bg-amber-400/10",
    label: "Medium",
  },
  low: {
    border: "border-slate-500",
    badge: "text-slate-400 bg-slate-400/10",
    label: "Low",
  },
} as const;

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "text-red-400" },
  mitigating: { label: "Mitigating", color: "text-amber-400" },
  resolved: { label: "Resolved", color: "text-emerald-400" },
};

const taskStatusConfig: Record<string, { color: string; icon: string }> = {
  todo: { color: "text-slate-500", icon: "circle" },
  in_progress: { color: "text-[#b4c5ff]", icon: "play_circle" },
  blocked: { color: "text-red-400", icon: "block" },
  done: { color: "text-emerald-400", icon: "check_circle" },
};

export default async function RisksPage() {
  const [risks, linkedTasksMap] = await Promise.all([getRisks(), getLinkedTasksMap()]);

  const sorted = [...risks].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const counts = {
    high: risks.filter((r) => r.severity === "high").length,
    medium: risks.filter((r) => r.severity === "medium").length,
    low: risks.filter((r) => r.severity === "low").length,
  };

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight text-white">
          Risks
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {risks.length} tracked risks &middot; {counts.high} high, {counts.medium} medium, {counts.low} low
        </p>
      </div>

      {/* ── Summary ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="tabular-nums font-medium text-white">{counts.high}</span>
          <span className="text-slate-500">High</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="tabular-nums font-medium text-white">{counts.medium}</span>
          <span className="text-slate-500">Medium</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span className="tabular-nums font-medium text-white">{counts.low}</span>
          <span className="text-slate-500">Low</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#131b2d] px-4 py-2 text-sm">
          <span className="text-slate-500">Mitigating:</span>
          <span className="tabular-nums font-medium text-amber-400">
            {risks.filter((r) => r.status === "mitigating").length}
          </span>
          <span className="text-slate-500">Open:</span>
          <span className="tabular-nums font-medium text-red-400">
            {risks.filter((r) => r.status === "open").length}
          </span>
        </span>
      </div>

      {/* ── Risk Cards ──────────────────────────────────────── */}
      <div className="space-y-4">
        {sorted.map((risk) => {
          const config = severityConfig[risk.severity];
          const status = statusConfig[risk.status] || statusConfig.open;
          const linkedTasks = linkedTasksMap[risk.id] || [];

          return (
            <div
              key={risk.id}
              className={`rounded-lg bg-[#131b2d] border-l-2 ${config.border} overflow-hidden`}
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${config.badge}`}>
                    {config.label}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                  {risk.workstream && (
                    <span className="text-[10px] text-slate-600">{risk.workstream}</span>
                  )}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{risk.owner.name}</span>
                    {risk.targetDate && (
                      <span className="text-[10px] text-slate-600 font-mono tabular-nums">{risk.targetDate}</span>
                    )}
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="text-lg font-medium text-white mb-2">{risk.title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed mb-4">{risk.description}</p>

                {/* Mitigation plan */}
                <div className="rounded-md bg-[#171f32] px-4 py-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-sm text-slate-500">shield</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Mitigation</span>
                  </div>
                  <p className="text-[12px] text-slate-300 leading-relaxed">{risk.mitigationPlan}</p>
                </div>

                {/* Linked tasks */}
                {linkedTasks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-sm text-slate-500">link</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                        Linked Tasks ({linkedTasks.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {linkedTasks.map((task: TaskData) => {
                        const tCfg = taskStatusConfig[task.status] || taskStatusConfig.todo;
                        return (
                          <div key={task.id} className="flex items-center gap-3 rounded-md bg-[#171f32] px-3 py-2">
                            <span className={`material-symbols-outlined text-sm ${tCfg.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                              {tCfg.icon}
                            </span>
                            <span className="text-[11px] text-slate-400 shrink-0 w-14 truncate">
                              {task.assignee?.name.split(" ")[0] || "—"}
                            </span>
                            <span className="text-[10px] font-mono text-slate-600 shrink-0 w-8">{task.taskCode}</span>
                            <span className="text-[12px] text-slate-300 flex-1 truncate">{task.title}</span>
                            {task.dueDate && (
                              <span className="text-[10px] text-slate-600 font-mono tabular-nums shrink-0">{task.dueDate}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
