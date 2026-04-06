import { getValueInitiatives, getValueSnapshots } from "@/lib/data";
import type { ValueInitiative } from "@/lib/data";

// ─── Helpers ──────────────────────────────────────────────────

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

const statusOrder: Record<string, number> = {
  capturing: 0,
  in_progress: 1,
  planned: 2,
  captured: 3,
};

const statusDot: Record<string, string> = {
  planned: "bg-slate-400",
  in_progress: "bg-amber-400",
  capturing: "bg-blue-400",
  captured: "bg-emerald-400",
};

const statusLabel: Record<string, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  capturing: "Capturing",
  captured: "Captured",
};

type CategoryKey = "cost_savings" | "revenue_growth" | "cash_flow";

const categoryConfig: Record<
  CategoryKey,
  { label: string; icon: string; accent: string; accentBg: string; iconBg: string; barBg: string }
> = {
  cost_savings: {
    label: "Cost Savings",
    icon: "account_balance_wallet",
    accent: "text-blue-400",
    accentBg: "border-blue-400",
    iconBg: "bg-blue-500/15",
    barBg: "bg-blue-400",
  },
  revenue_growth: {
    label: "Revenue Growth",
    icon: "trending_up",
    accent: "text-[#dfc299]",
    accentBg: "border-[#dfc299]",
    iconBg: "bg-[#dfc299]/15",
    barBg: "bg-[#dfc299]",
  },
  cash_flow: {
    label: "Cash Flow",
    icon: "payments",
    accent: "text-slate-300",
    accentBg: "border-slate-400",
    iconBg: "bg-slate-500/15",
    barBg: "bg-slate-400",
  },
};

// ─── Page ─────────────────────────────────────────────────────

export default function ValueGainsPage() {
  const initiatives = getValueInitiatives();
  const snapshots = getValueSnapshots();

  const totalPlanned = initiatives.reduce((s, i) => s + i.plannedImpact, 0);
  const totalCaptured = initiatives.reduce((s, i) => s + i.capturedImpact, 0);

  // Group by category
  const byCategory = (cat: CategoryKey) =>
    initiatives.filter((i) => i.category === cat);

  const sorted = [...initiatives].sort(
    (a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
  );

  // SVG chart dimensions
  const chartW = 600;
  const chartH = 200;
  const chartPadX = 40;
  const chartPadY = 24;
  const plotW = chartW - chartPadX * 2;
  const plotH = chartH - chartPadY * 2;
  const maxVal = Math.max(...snapshots.map((s) => Math.max(s.planned, s.captured)), 1);

  function toPoint(i: number, val: number) {
    const x = chartPadX + (i / Math.max(snapshots.length - 1, 1)) * plotW;
    const y = chartPadY + plotH - (val / maxVal) * plotH;
    return { x, y };
  }

  const plannedPoints = snapshots.map((s, i) => toPoint(i, s.planned));
  const capturedPoints = snapshots.map((s, i) => toPoint(i, s.captured));
  const plannedLine = plannedPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const capturedLine = capturedPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfc299] mb-1">
            Strategic performance
          </p>
          <h1 className="font-serif text-5xl tracking-tight">Value Gains</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2235] border border-[#2d3448] text-xs text-slate-300 hover:bg-[#222a3d] transition-colors">
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a2235] border border-[#2d3448] text-xs text-slate-300 hover:bg-[#222a3d] transition-colors">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Settings
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["cost_savings", "revenue_growth", "cash_flow"] as const).map((cat) => {
          const cfg = categoryConfig[cat];
          const items = byCategory(cat);
          const planned = items.reduce((s, i) => s + i.plannedImpact, 0);
          const captured = items.reduce((s, i) => s + i.capturedImpact, 0);
          const pct = planned > 0 ? Math.round((captured / planned) * 100) : 0;

          return (
            <div
              key={cat}
              className={`rounded-xl bg-[#131b2d] border-l-2 ${cfg.accentBg} p-5`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${cfg.iconBg}`}>
                  <span className={`material-symbols-outlined text-[20px] ${cfg.accent}`}>
                    {cfg.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">{cfg.label}</p>
                  <p className="text-[10px] text-slate-500">Planned vs Captured</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">
                  {formatUsd(planned)}
                </span>
                {captured > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-emerald-400">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                    {formatUsd(captured)}
                  </span>
                )}
                {captured === 0 && (
                  <span className="text-xs text-slate-500">
                    {formatUsd(captured)} captured
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-1">
                <div className="h-1.5 rounded-full bg-[#222a3d] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cfg.barBg} transition-all duration-500`}
                    style={{ width: `${Math.max(pct, captured > 0 ? 3 : 0)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 tabular-nums">{pct}% captured</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Trend Chart ─────────────────────────────────── */}
      <div className="rounded-xl bg-[#131b2d] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg">Value Capture Trend</h2>
          <div className="flex items-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded bg-blue-400" />
              Planned
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded bg-[#dfc299]" />
              Captured
            </span>
          </div>
        </div>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = chartPadY + plotH - frac * plotH;
            return (
              <g key={frac}>
                <line x1={chartPadX} y1={y} x2={chartW - chartPadX} y2={y} stroke="#222a3d" strokeWidth="1" />
                <text x={chartPadX - 6} y={y + 3} textAnchor="end" fill="#6b7280" fontSize="9" fontFamily="var(--font-inter)">
                  {formatUsd(frac * maxVal)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {snapshots.map((s, i) => {
            const p = toPoint(i, 0);
            const label = s.month.split(" ")[0]; // "Apr", "May", etc.
            return (
              <text key={i} x={p.x} y={chartH - 4} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="var(--font-inter)">
                {label}
              </text>
            );
          })}

          {/* Planned line */}
          <polyline
            points={plannedLine}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {plannedPoints.map((p, i) => (
            <circle key={`pl-${i}`} cx={p.x} cy={p.y} r="3" fill="#60a5fa" />
          ))}

          {/* Captured line */}
          <polyline
            points={capturedLine}
            fill="none"
            stroke="#dfc299"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {capturedPoints.map((p, i) => (
            <circle key={`cp-${i}`} cx={p.x} cy={p.y} r="3" fill="#dfc299" />
          ))}
        </svg>
      </div>

      {/* ── Initiative List ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg">
            Initiatives
            <span className="ml-2 text-xs text-slate-500 font-sans font-normal">
              {initiatives.length} total
            </span>
          </h2>
        </div>
        <div className="space-y-2">
          {sorted.map((init) => (
            <InitiativeRow key={init.id} initiative={init} />
          ))}
        </div>
      </div>

      {/* ── Efficiency Analysis ─────────────────────────── */}
      <div className="rounded-xl bg-[#131b2d] p-5">
        <h2 className="font-serif text-lg mb-1">Efficiency Analysis</h2>
        <p className="text-xs text-slate-500 mb-4">
          Regional performance against planned value targets
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-[#222a3d]">
                <th className="text-left py-2 pr-4 font-medium">Category</th>
                <th className="text-right py-2 px-4 font-medium">Initiatives</th>
                <th className="text-right py-2 px-4 font-medium">Planned</th>
                <th className="text-right py-2 px-4 font-medium">Captured</th>
                <th className="text-right py-2 pl-4 font-medium">Capture Rate</th>
              </tr>
            </thead>
            <tbody>
              {(["cost_savings", "revenue_growth", "cash_flow"] as const).map((cat) => {
                const cfg = categoryConfig[cat];
                const items = byCategory(cat);
                const planned = items.reduce((s, i) => s + i.plannedImpact, 0);
                const captured = items.reduce((s, i) => s + i.capturedImpact, 0);
                const rate = planned > 0 ? Math.round((captured / planned) * 100) : 0;
                return (
                  <tr key={cat} className="border-b border-[#1a2235]">
                    <td className="py-2.5 pr-4">
                      <span className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[16px] ${cfg.accent}`}>{cfg.icon}</span>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="text-right py-2.5 px-4 tabular-nums text-slate-300">{items.length}</td>
                    <td className="text-right py-2.5 px-4 tabular-nums text-slate-300">{formatUsd(planned)}</td>
                    <td className="text-right py-2.5 px-4 tabular-nums text-slate-300">{formatUsd(captured)}</td>
                    <td className="text-right py-2.5 pl-4 tabular-nums text-slate-300">{rate}%</td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="font-medium">
                <td className="py-2.5 pr-4 text-slate-200">Total</td>
                <td className="text-right py-2.5 px-4 tabular-nums text-slate-200">{initiatives.length}</td>
                <td className="text-right py-2.5 px-4 tabular-nums text-slate-200">{formatUsd(totalPlanned)}</td>
                <td className="text-right py-2.5 px-4 tabular-nums text-slate-200">{formatUsd(totalCaptured)}</td>
                <td className="text-right py-2.5 pl-4 tabular-nums text-slate-200">
                  {totalPlanned > 0 ? Math.round((totalCaptured / totalPlanned) * 100) : 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Initiative Row ───────────────────────────────────────────

function InitiativeRow({ initiative }: { initiative: ValueInitiative }) {
  const cfg = categoryConfig[initiative.category];

  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#131b2d] px-4 py-3 hover:bg-[#171f32] transition-colors">
      {/* Avatar */}
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#222a3d] text-xs font-medium text-slate-300 shrink-0">
        {initiative.owner.initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{initiative.name}</span>
          <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[initiative.status]}`} />
          <span className="text-[10px] text-slate-500 shrink-0">{statusLabel[initiative.status]}</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {initiative.owner.name} &middot; {initiative.workstream ?? cfg.label}
        </p>
      </div>

      {/* Value */}
      <div className="text-right shrink-0">
        <span className={`text-sm font-semibold tabular-nums ${cfg.accent}`}>
          {formatUsd(initiative.plannedImpact)}
        </span>
        <p className="text-[10px] text-slate-500">{initiative.targetDescription}</p>
      </div>

      {/* Chevron */}
      <span className="material-symbols-outlined text-[18px] text-slate-600 shrink-0">chevron_right</span>
    </div>
  );
}
