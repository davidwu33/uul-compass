import { getRisks } from "@/lib/data";

const severityOrder = { high: 0, medium: 1, low: 2 } as const;

const severityConfig = {
  high: {
    border: "border-red-500",
    badge: "bg-red-500/20 text-red-400 ring-red-500/30",
    label: "CAT-A CRITICAL",
    barColor: "bg-red-500",
    statLabel: "Critical Priority",
    pillLabel: "High",
    pillClass: "bg-red-500/20 text-red-400",
  },
  medium: {
    border: "border-amber-500",
    badge: "bg-amber-500/20 text-amber-400 ring-amber-500/30",
    label: "CAT-B ELEVATED",
    barColor: "bg-amber-500",
    statLabel: "High Volatility",
    pillLabel: "Med",
    pillClass: "bg-amber-500/20 text-amber-400",
  },
  low: {
    border: "border-blue-500",
    badge: "bg-blue-500/20 text-blue-400 ring-blue-500/30",
    label: "CAT-C OBSERVATION",
    barColor: "bg-blue-500",
    statLabel: "Observation Only",
    pillLabel: "Low",
    pillClass: "bg-blue-500/20 text-blue-400",
  },
} as const;

function getStatusWidth(status: "open" | "mitigating" | "resolved"): string {
  switch (status) {
    case "open":
      return "w-[85%]";
    case "mitigating":
      return "w-[50%]";
    case "resolved":
      return "w-[15%]";
  }
}

function getStatusLabel(status: "open" | "mitigating" | "resolved"): string {
  switch (status) {
    case "open":
      return "Active — Unmitigated";
    case "mitigating":
      return "Mitigation In Progress";
    case "resolved":
      return "Contained";
  }
}

function getRiskScore(
  counts: { high: number; medium: number; low: number },
  total: number
): number {
  if (total === 0) return 0;
  const weighted = counts.high * 10 + counts.medium * 5 + counts.low * 1;
  const maxWeighted = total * 10;
  return Math.round((weighted / maxWeighted) * 100);
}

export default function RisksPage() {
  const risks = getRisks();

  const sorted = [...risks].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const counts = {
    high: risks.filter((r) => r.severity === "high").length,
    medium: risks.filter((r) => r.severity === "medium").length,
    low: risks.filter((r) => r.severity === "low").length,
  };

  const riskScore = getRiskScore(counts, risks.length);

  return (
    <div className="space-y-10">
      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-3">
          Risk Intelligence Dashboard
        </p>
        <h1 className="font-serif text-5xl font-light tracking-tight text-white mb-4">
          Active Strategic Risks
        </h1>
        <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
          Comprehensive risk register tracking critical exposures across all
          workstreams. Each risk is assessed, assigned, and monitored through
          structured mitigation protocols.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button className="px-4 py-2 text-sm font-medium text-slate-300 bg-[#1a2235] rounded-lg border border-slate-700/50 hover:bg-[#1f2940] transition-colors">
            Filter
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            + New Entry
          </button>
        </div>
      </div>

      {/* ── Summary Stats ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical */}
        <div className="bg-[#1a2235] p-6 rounded-xl shadow-xl border-l-4 border-red-500">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
            {severityConfig.high.statLabel}
          </p>
          <p className="font-serif text-4xl font-light text-white mb-2">
            {counts.high}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-red-500/20 text-red-400">
            High
          </span>
        </div>

        {/* Elevated */}
        <div className="bg-[#1a2235] p-6 rounded-xl shadow-xl border-l-4 border-amber-500">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
            {severityConfig.medium.statLabel}
          </p>
          <p className="font-serif text-4xl font-light text-white mb-2">
            {counts.medium}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400">
            Med
          </span>
        </div>

        {/* Observation */}
        <div className="bg-[#1a2235] p-6 rounded-xl shadow-xl border-l-4 border-blue-500">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
            {severityConfig.low.statLabel}
          </p>
          <p className="font-serif text-4xl font-light text-white mb-2">
            {counts.low}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400">
            Low
          </span>
        </div>

        {/* Aggregated Index */}
        <div className="bg-[#1a2235] p-6 rounded-xl shadow-xl border-l-4 border-slate-600">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
            Aggregated Index
          </p>
          <p className="font-serif text-4xl font-light text-white mb-2">
            {riskScore}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-500/20 text-slate-400">
            Risk Score
          </span>
        </div>
      </div>

      {/* ── Risk Cards ──────────────────────────────────────── */}
      <div className="space-y-5">
        {sorted.map((risk, i) => {
          const config = severityConfig[risk.severity];
          const riskId = `RSK-${String(i + 1).padStart(3, "0")}`;

          return (
            <div
              key={risk.id}
              className={`bg-[#1a2235] rounded-xl border-l-[6px] ${config.border} shadow-xl overflow-hidden`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Left 2/3 — Main content */}
                <div className="flex-1 p-8 md:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ring-1 ${config.badge}`}
                    >
                      {config.label}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">
                      {riskId}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-light text-white mb-3 leading-tight">
                    {risk.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xl">
                    {risk.description}
                  </p>

                  {/* Mitigation Strategy Box */}
                  <div className="bg-[#131b2d] rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Mitigation Strategy
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      {risk.mitigationPlan}
                    </p>
                  </div>
                </div>

                {/* Right 1/3 — Metadata panel */}
                <div className="bg-[#171f32] p-8 md:w-1/3 flex flex-col justify-between gap-6">
                  {/* Exposure */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1">
                      Exposure Level
                    </p>
                    <p className="text-lg font-semibold text-white capitalize">
                      {risk.severity === "high"
                        ? "Maximum"
                        : risk.severity === "medium"
                          ? "Elevated"
                          : "Minimal"}
                    </p>
                  </div>

                  {/* Stakeholder */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1">
                      Stakeholder
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        {risk.owner.initials}
                      </div>
                      <span className="text-sm text-slate-300">
                        {risk.owner.name}
                      </span>
                    </div>
                  </div>

                  {/* Probability bar */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-2">
                      Probability Assessment
                    </p>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${config.barColor} ${getStatusWidth(risk.status)} transition-all`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {getStatusLabel(risk.status)}
                    </p>
                  </div>

                  {/* Target date */}
                  {risk.targetDate && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1">
                        Target Resolution
                      </p>
                      <p className="text-sm text-slate-300">
                        {risk.targetDate}
                      </p>
                    </div>
                  )}

                  {/* Action button */}
                  <button className="w-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-slate-700/50 rounded-lg border border-slate-600/50 hover:bg-slate-700 transition-colors">
                    View Full Assessment →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Section ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 — Heatmap placeholder */}
        <div className="lg:col-span-2 bg-[#1a2235] rounded-xl shadow-xl p-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-2">
            Threat Landscape
          </p>
          <h2 className="font-serif text-2xl font-light text-white mb-6">
            Regional Threat Heatmap
          </h2>
          <div className="aspect-[16/9] bg-[#131b2d] rounded-lg flex items-center justify-center border border-slate-700/30">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-slate-700 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-sm text-slate-600">
                Heatmap visualization — coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Right 1/3 — Guidelines */}
        <div className="bg-[#1a2235] rounded-xl shadow-xl p-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-2">
            Governance Framework
          </p>
          <h2 className="font-serif text-2xl font-light text-white mb-6">
            Institutional Risk Guidelines
          </h2>
          <ol className="space-y-4">
            {[
              "All CAT-A risks require weekly board-level review and active mitigation plans.",
              "Risk owners must update status within 48 hours of any material change.",
              "Mitigation strategies are reviewed at each decision gate checkpoint.",
              "Resolved risks remain in the register for 90 days for pattern analysis.",
              "Cross-workstream risks escalate automatically to the executive sponsor.",
            ].map((text, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
