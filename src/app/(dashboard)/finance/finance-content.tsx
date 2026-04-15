"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import type { ValueInitiative, ValueSnapshot, WorkstreamData, UserOption, GrowthPriority } from "@/lib/data";
import type { CurrentUser } from "@/lib/supabase/get-current-user";
import { InitiativeModal } from "@/components/initiative-modal";
import { GrowthPriorityModal } from "@/components/growth-priority-modal";

function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

const statusDot: Record<string, string> = {
  planned: "bg-slate-400",
  in_progress: "bg-amber-400",
  capturing: "bg-[#b4c5ff]",
  captured: "bg-emerald-400",
};

const statusLabelKey: Record<string, "growth_statusPlanned" | "growth_statusInProgress" | "growth_statusCapturing" | "growth_statusCaptured"> = {
  planned: "growth_statusPlanned",
  in_progress: "growth_statusInProgress",
  capturing: "growth_statusCapturing",
  captured: "growth_statusCaptured",
};

interface FinanceContentProps {
  initiatives: ValueInitiative[];
  snapshots: ValueSnapshot[];
  workstreams: WorkstreamData[];
  userOptions: UserOption[];
  currentUser: CurrentUser | null;
  growthPriorities: GrowthPriority[];
}

export function FinanceContent({ initiatives, snapshots, workstreams, userOptions, currentUser, growthPriorities }: FinanceContentProps) {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<ValueInitiative | null>(null);
  const [gpModalOpen, setGpModalOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<GrowthPriority | null>(null);

  const canWrite = !!currentUser && (currentUser.isAdmin || currentUser.isContributor);

  function openCreate() { setEditingInitiative(null); setModalOpen(true); }
  function openEdit(init: ValueInitiative) { setEditingInitiative(init); setModalOpen(true); }
  function openGpCreate() { setEditingPriority(null); setGpModalOpen(true); }
  function openGpEdit(gp: GrowthPriority) { setEditingPriority(gp); setGpModalOpen(true); }

  const totalPlanned = initiatives.reduce((s, i) => s + i.plannedImpact, 0);
  const totalCaptured = initiatives.reduce((s, i) => s + i.capturedImpact, 0);
  const revenueInitiatives = initiatives.filter((i) => i.category === "revenue_growth");
  const revenueTotal = revenueInitiatives.reduce((s, i) => s + i.plannedImpact, 0);
  const activeCount = growthPriorities.filter((g) => g.status === "active").length;
  const totalGpCount = growthPriorities.length;

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight text-slate-100">
            {t("growth_title")}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {t("growth_subtitle")}
          </p>
        </div>
        {canWrite && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b4c5ff]/15 text-[#b4c5ff] border border-[#b4c5ff]/30 text-sm font-medium hover:bg-[#b4c5ff]/25 transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Initiative
          </button>
        )}
      </div>

      {/* ── Top KPIs ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{t("growth_revenuePipeline")}</span>
          <p className="text-2xl font-light tabular-nums text-[#dfc299]">{formatUsd(revenueTotal)}</p>
          <p className="text-[11px] text-slate-500">{revenueInitiatives.length} {t("growth_initiatives")}</p>
        </div>
        <div className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{t("growth_totalValueTarget")}</span>
          <p className="text-2xl font-light tabular-nums text-slate-300">{formatUsd(totalPlanned)}</p>
          <p className="text-[11px] text-slate-500">{t("growth_allCategories")}</p>
        </div>
        <div className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{t("growth_valueCaptured")}</span>
          <p className="text-2xl font-light tabular-nums text-slate-500">{formatUsd(totalCaptured)}</p>
          <p className="text-[11px] text-slate-500">0% {t("growth_ofTarget")}</p>
        </div>
        <div className="rounded-lg bg-[#131b2d] border-t-2 border-[#dfc299] p-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{t("growth_growthPriorities")}</span>
          <p className="text-2xl font-light tabular-nums text-[#b4c5ff]">{activeCount}</p>
          <p className="text-[11px] text-slate-500">{t("growth_activeOf")} {totalGpCount}</p>
        </div>
      </div>

      {/* ── Growth Priorities ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl text-white">{t("growth_growthPriorities")}</h2>
          {canWrite && (
            <button
              onClick={openGpCreate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b4c5ff]/10 text-[#b4c5ff] border border-[#b4c5ff]/25 text-xs font-medium hover:bg-[#b4c5ff]/20 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Priority
            </button>
          )}
        </div>
        <div className="space-y-4">
          {growthPriorities.map((gp) => (
            <div
              key={gp.id}
              onClick={() => canWrite && openGpEdit(gp)}
              className={`rounded-lg bg-[#131b2d] p-5 ${canWrite ? "cursor-pointer hover:bg-[#171f32] transition-colors" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[#1a2744] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#b4c5ff] text-xl">{gp.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-medium text-white">{gp.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold ${
                      gp.status === "active" ? "text-[#b4c5ff]" : "text-slate-500"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${gp.status === "active" ? "bg-[#b4c5ff]" : "bg-slate-600"}`} />
                      {gp.status === "active" ? t("growth_active") : t("growth_planned")}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400 leading-relaxed mb-4">{gp.description}</p>
                  <div className="flex flex-wrap gap-6">
                    {gp.metrics.map((m, i) => (
                      <div key={i}>
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">{m.label}</p>
                        <p className="text-sm font-medium text-slate-300 tabular-nums">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {growthPriorities.length === 0 && (
            <p className="text-sm text-slate-600 italic py-4">No growth priorities yet.</p>
          )}
        </div>
      </div>

      {/* ── Value Initiatives ──────────────────────────── */}
      <div>
        <h2 className="font-serif text-2xl text-white mb-5">{t("growth_valueInitiatives")}</h2>
        <div className="space-y-2">
          {initiatives.map((init) => (
            <div key={init.id} onClick={() => canWrite && openEdit(init)} className={`flex items-center gap-4 rounded-lg bg-[#131b2d] px-4 py-3 hover:bg-[#171f32] transition-colors ${canWrite ? "cursor-pointer" : ""}`}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#222a3d] text-[10px] font-medium text-slate-300 shrink-0">
                {init.owner.initials}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-200 truncate">{init.name}</span>
                <p className="text-[11px] text-slate-500">{init.owner.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusDot[init.status]}`} />
                <span className="text-[10px] text-slate-500">{t(statusLabelKey[init.status] ?? "growth_statusPlanned")}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-[#dfc299] shrink-0">
                {formatUsd(init.plannedImpact)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Value Capture Trend ─────────────────────────── */}
      <div className="rounded-lg bg-[#131b2d] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-white">{t("growth_valueCaptureTrend")}</h2>
          <div className="flex items-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded bg-[#b4c5ff]" />
              {t("growth_legendPlanned")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded bg-[#dfc299]" />
              {t("growth_legendCaptured")}
            </span>
          </div>
        </div>
        {(() => {
          const chartW = 600, chartH = 200, padX = 40, padY = 24;
          const plotW = chartW - padX * 2, plotH = chartH - padY * 2;
          const maxVal = Math.max(...snapshots.map((s) => Math.max(s.planned, s.captured)), 1);
          const pt = (i: number, val: number) => ({
            x: padX + (i / Math.max(snapshots.length - 1, 1)) * plotW,
            y: padY + plotH - (val / maxVal) * plotH,
          });
          const plannedLine = snapshots.map((s, i) => pt(i, s.planned)).map((p) => `${p.x},${p.y}`).join(" ");
          const capturedLine = snapshots.map((s, i) => pt(i, s.captured)).map((p) => `${p.x},${p.y}`).join(" ");

          return (
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = padY + plotH - frac * plotH;
                return (
                  <g key={frac}>
                    <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#222a3d" strokeWidth="1" />
                    <text x={padX - 6} y={y + 3} textAnchor="end" fill="#6b7280" fontSize="9">{formatUsd(frac * maxVal)}</text>
                  </g>
                );
              })}
              {snapshots.map((s, i) => (
                <text key={i} x={pt(i, 0).x} y={chartH - 4} textAnchor="middle" fill="#6b7280" fontSize="9">
                  {s.month.split(" ")[0]}
                </text>
              ))}
              <polyline points={plannedLine} fill="none" stroke="#b4c5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {snapshots.map((s, i) => <circle key={`pl-${i}`} cx={pt(i, s.planned).x} cy={pt(i, s.planned).y} r="3" fill="#b4c5ff" />)}
              <polyline points={capturedLine} fill="none" stroke="#dfc299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {snapshots.map((s, i) => <circle key={`cp-${i}`} cx={pt(i, s.captured).x} cy={pt(i, s.captured).y} r="3" fill="#dfc299" />)}
            </svg>
          );
        })()}
      </div>
      {currentUser && (
        <InitiativeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initiative={editingInitiative}
          workstreams={workstreams}
          userOptions={userOptions}
          currentUser={currentUser}
        />
      )}
      {currentUser && (
        <GrowthPriorityModal
          open={gpModalOpen}
          onClose={() => setGpModalOpen(false)}
          priority={editingPriority}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
