import type { ValueInitiative } from "@/lib/data";

const statusConfig = {
  planned: { label: "Planned", dot: "bg-gray-400" },
  in_progress: { label: "In Progress", dot: "bg-amber-400" },
  capturing: { label: "Capturing", dot: "bg-blue-400" },
  captured: { label: "Captured", dot: "bg-emerald-400" },
} as const;

const workstreamColors: Record<string, string> = {
  Finance: "#ef4444",
  "Finance Integration": "#ef4444",
  Operations: "#f97316",
  "Operations Consolidation": "#f97316",
  Sales: "#3b82f6",
  "Sales Engine": "#3b82f6",
  "Brand & Marketing": "#8b5cf6",
  Marketing: "#8b5cf6",
  "Technology & AI": "#06b6d4",
  "Organization & HR": "#22c55e",
  HR: "#22c55e",
};

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

interface InitiativeCardProps {
  initiative: ValueInitiative;
}

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  const status = statusConfig[initiative.status];
  const wsColor = initiative.workstream
    ? workstreamColors[initiative.workstream] ?? "#6b7280"
    : null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3 hover:border-border transition-colors duration-150">
      {/* Top row: name + status */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug">{initiative.name}</h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`h-2 w-2 rounded-full ${status.dot}`} />
          <span className="text-[11px] text-muted-foreground">{status.label}</span>
        </div>
      </div>

      {/* Target description */}
      <p className="text-xs text-muted-foreground">{initiative.targetDescription}</p>

      {/* Impact numbers */}
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-bold tabular-nums">
          {formatUsd(initiative.capturedImpact)}
        </span>
        <span className="text-xs text-muted-foreground">
          / {formatUsd(initiative.plannedImpact)} planned
        </span>
      </div>

      {/* Footer: owner + workstream */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
            {initiative.owner.initials}
          </div>
          <span className="text-xs text-muted-foreground">{initiative.owner.name}</span>
        </div>

        {initiative.workstream && wsColor && (
          <div className="flex items-center gap-1.5">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: wsColor }}
            />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {initiative.workstream}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
