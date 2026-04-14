// TODO: Unused — no imports found. Safe to delete.
"use client";

import { useState } from "react";
import { Diamond } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhaseData, DecisionGate } from "@/lib/data/types";
import { GateDetailSheet } from "./gate-detail-sheet";

interface PhaseTimelineProps {
  phases: PhaseData[];
  gates: DecisionGate[];
  currentDay: number;
}

const gateStatusColors: Record<DecisionGate["status"], string> = {
  upcoming: "text-slate-400",
  ready: "text-blue-500",
  passed: "text-emerald-500",
  failed: "text-red-500",
  deferred: "text-slate-300",
};

const gateStatusFill: Record<DecisionGate["status"], string> = {
  upcoming: "fill-slate-400/20",
  ready: "fill-blue-500/20",
  passed: "fill-emerald-500/20",
  failed: "fill-red-500/20",
  deferred: "fill-slate-300/20",
};

const phaseColors = [
  { bg: "bg-teal-500/20", bar: "bg-teal-500", text: "text-teal-300" },
  { bg: "bg-sky-500/20", bar: "bg-sky-500", text: "text-sky-300" },
  { bg: "bg-violet-500/20", bar: "bg-violet-500", text: "text-violet-300" },
];

export function PhaseTimeline({ phases, gates, currentDay }: PhaseTimelineProps) {
  const [selectedGate, setSelectedGate] = useState<DecisionGate | null>(null);

  const totalDays = 100;
  const currentPct = ((currentDay - 1) / totalDays) * 100;

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
        {/* Phase bar */}
        <div className="relative">
          {/* Track */}
          <div className="flex h-8 rounded-lg overflow-hidden bg-muted/30">
            {phases.map((phase, i) => {
              const width = ((phase.endDay - phase.startDay + 1) / totalDays) * 100;
              const colors = phaseColors[i];
              return (
                <div
                  key={phase.id}
                  className={cn("relative h-full", colors.bg)}
                  style={{ width: `${width}%` }}
                >
                  {/* Filled progress within active phase */}
                  {phase.status === "active" && (
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-l-lg", colors.bar, "opacity-30")}
                      style={{
                        width: `${Math.min(100, ((currentDay - phase.startDay) / (phase.endDay - phase.startDay + 1)) * 100)}%`,
                      }}
                    />
                  )}
                  {phase.status === "completed" && (
                    <div className={cn("absolute inset-0", colors.bar, "opacity-30")} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Gate diamonds */}
          {gates.map((gate) => {
            const leftPct = ((gate.dayNumber - 1) / totalDays) * 100;
            return (
              <button
                key={gate.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hover:scale-125 transition-transform"
                style={{ left: `${leftPct}%` }}
                onClick={() => setSelectedGate(gate)}
                title={`Day ${gate.dayNumber}: ${gate.name}`}
              >
                <Diamond
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 drop-shadow-sm",
                    gateStatusColors[gate.status],
                    gateStatusFill[gate.status]
                  )}
                />
              </button>
            );
          })}

          {/* Current day marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/90 z-20 pointer-events-none"
            style={{ left: `${currentPct}%` }}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-[9px] font-bold text-slate-900 px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              D{currentDay}
            </div>
          </div>
        </div>

        {/* Phase labels */}
        <div className="flex mt-2.5">
          {phases.map((phase, i) => {
            const width = ((phase.endDay - phase.startDay + 1) / totalDays) * 100;
            const colors = phaseColors[i];
            return (
              <div key={phase.id} style={{ width: `${width}%` }} className="min-w-0">
                <p className={cn("text-[11px] font-semibold truncate", colors.text)}>
                  {phase.name}
                </p>
                <p className="text-[9px] text-muted-foreground truncate hidden sm:block">
                  {phase.startDate} — {phase.endDate}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gate detail sheet */}
      <GateDetailSheet
        gate={selectedGate}
        onClose={() => setSelectedGate(null)}
      />
    </>
  );
}
