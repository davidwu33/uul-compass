// TODO: Unused — no imports found. Safe to delete.
import { Diamond } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MilestoneData } from "@/lib/data/types";

interface MilestoneStripProps {
  milestones: MilestoneData[];
}

const statusDot: Record<MilestoneData["status"], string> = {
  not_started: "text-slate-400",
  in_progress: "text-blue-500",
  at_risk: "text-amber-500",
  completed: "text-emerald-500",
};

export function MilestoneStrip({ milestones }: MilestoneStripProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {milestones.map((ms) => (
          <div
            key={ms.id}
            className={cn(
              "flex-none w-[180px] sm:w-[200px] rounded-lg border border-border/60 bg-card p-3",
              "hover:border-border transition-colors"
            )}
            style={{ borderLeftColor: ms.workstreamColor, borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Diamond className={cn("h-3 w-3 shrink-0", statusDot[ms.status])} />
              <span className="text-[10px] font-mono text-muted-foreground">{ms.code}</span>
            </div>
            <p className="text-[11px] font-medium leading-snug line-clamp-2 mb-2">
              {ms.name}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{ms.targetDate}</span>
              <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                {ms.completedTaskCount}/{ms.linkedTaskCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
