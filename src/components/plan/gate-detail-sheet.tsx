"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Diamond, Calendar, User, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DecisionGate } from "@/lib/data/types";

interface GateDetailSheetProps {
  gate: DecisionGate | null;
  onClose: () => void;
}

const statusConfig: Record<DecisionGate["status"], { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-slate-100 text-slate-700 border-slate-200" },
  ready: { label: "Ready", className: "bg-blue-50 text-blue-700 border-blue-200" },
  passed: { label: "Passed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200" },
  deferred: { label: "Deferred", className: "bg-slate-50 text-slate-500 border-slate-200" },
};

export function GateDetailSheet({ gate, onClose }: GateDetailSheetProps) {
  if (!gate) return null;

  const status = statusConfig[gate.status];

  return (
    <Sheet open={!!gate} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <Diamond className="h-5 w-5 text-primary shrink-0" />
            <SheetTitle className="text-base">{gate.name}</SheetTitle>
          </div>
          <SheetDescription className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Day {gate.dayNumber} &middot; {gate.targetDate}
            </span>
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5", status.className)}>
              {status.label}
            </Badge>
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-5">
          {/* Owner */}
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
              Owner
            </p>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {gate.owner}
            </div>
          </div>

          {/* Criteria */}
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
              Gate Criteria
            </p>
            <ul className="space-y-2">
              {gate.criteria.map((criterion, i) => {
                const isPassed = gate.status === "passed";
                return (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    {isPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                    )}
                    <span className={cn(isPassed && "text-muted-foreground line-through")}>
                      {criterion}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Outcome (if passed/failed) */}
          {gate.outcome && (
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">
                Outcome
              </p>
              <p className="text-sm">{gate.outcome}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
