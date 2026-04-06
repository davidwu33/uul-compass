import { Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DecisionGate } from "@/lib/data";

const gateStatusConfig = {
  upcoming: { dot: "bg-blue-400", label: "Upcoming" },
  ready: { dot: "bg-emerald-400", label: "Ready" },
  passed: { dot: "bg-emerald-400", label: "Passed" },
  failed: { dot: "bg-red-400", label: "Failed" },
  deferred: { dot: "bg-amber-400", label: "Deferred" },
} as const;

interface NextCheckpointProps {
  gate: DecisionGate | undefined;
  currentDay: number;
}

export function NextCheckpoint({ gate, currentDay }: NextCheckpointProps) {
  if (!gate) return null;

  const config = gateStatusConfig[gate.status];
  const daysUntil = gate.dayNumber - currentDay;

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Flag className="h-4 w-4 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Next Checkpoint
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${config.dot} shrink-0`} />
              <p className="text-sm font-semibold truncate">{gate.name}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-[18px]">
              Day {gate.dayNumber} &middot; {gate.targetDate}
            </p>
          </div>

          <div className="text-right shrink-0 ml-4">
            <span className="text-2xl font-bold tabular-nums">
              {daysUntil > 0 ? daysUntil : 0}
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {daysUntil > 0 ? "days left" : "today"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
