"use client";

import { cn } from "@/lib/utils";

interface PhaseFilterProps {
  activePhase: number | null;
  onPhaseChange: (phase: number | null) => void;
}

const phases = [
  { value: null, label: "All" },
  { value: 1, label: "Phase 1" },
  { value: 2, label: "Phase 2" },
  { value: 3, label: "Phase 3" },
] as const;

export function PhaseFilter({ activePhase, onPhaseChange }: PhaseFilterProps) {
  return (
    <div className="flex gap-1.5">
      {phases.map((p) => (
        <button
          key={p.label}
          onClick={() => onPhaseChange(p.value)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            activePhase === p.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
