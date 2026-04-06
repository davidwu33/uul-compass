import type { ValueInitiative } from "@/lib/data";

const categoryConfig = {
  cost_savings: {
    label: "Cost Savings",
    color: "emerald",
    barBg: "bg-emerald-500/20",
    barFill: "bg-emerald-500",
    textColor: "text-emerald-400",
  },
  revenue_growth: {
    label: "Revenue Growth",
    color: "blue",
    barBg: "bg-blue-500/20",
    barFill: "bg-blue-500",
    textColor: "text-blue-400",
  },
  cash_flow: {
    label: "Cash Flow",
    color: "amber",
    barBg: "bg-amber-500/20",
    barFill: "bg-amber-500",
    textColor: "text-amber-400",
  },
} as const;

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

interface CategorySummaryProps {
  initiatives: ValueInitiative[];
}

export function CategorySummary({ initiatives }: CategorySummaryProps) {
  const categories = (["cost_savings", "revenue_growth", "cash_flow"] as const).map(
    (cat) => {
      const items = initiatives.filter((i) => i.category === cat);
      const planned = items.reduce((s, i) => s + i.plannedImpact, 0);
      const captured = items.reduce((s, i) => s + i.capturedImpact, 0);
      const pct = planned > 0 ? Math.round((captured / planned) * 100) : 0;
      return { key: cat, ...categoryConfig[cat], planned, captured, pct, count: items.length };
    }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
      {categories.map((cat) => (
        <div
          key={cat.key}
          className="rounded-xl border border-border/60 bg-card p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{cat.label}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {cat.count} initiative{cat.count !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tabular-nums ${cat.textColor}`}>
              {formatUsd(cat.captured)}
            </span>
            <span className="text-xs text-muted-foreground">
              of {formatUsd(cat.planned)} planned
            </span>
          </div>

          <div className="space-y-1">
            <div className={`h-1.5 rounded-full ${cat.barBg} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${cat.barFill} transition-all duration-500`}
                style={{ width: `${Math.max(cat.pct, cat.captured > 0 ? 2 : 0)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground tabular-nums">
              {cat.pct}% captured
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
