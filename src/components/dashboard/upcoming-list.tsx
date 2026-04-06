import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MilestoneData } from "@/lib/data";

const milestoneStatusDot: Record<MilestoneData["status"], string> = {
  not_started: "bg-gray-400",
  in_progress: "bg-blue-400",
  at_risk: "bg-amber-400",
  completed: "bg-emerald-400",
};

const milestoneStatusLabel: Record<MilestoneData["status"], string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  at_risk: "At Risk",
  completed: "Done",
};

interface UpcomingListProps {
  milestones: MilestoneData[];
}

export function UpcomingList({ milestones }: UpcomingListProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Upcoming This Week</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground py-3 text-center">
            No milestones due this week
          </p>
        ) : (
          <div className="space-y-0.5">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: m.workstreamColor }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {m.workstream} &middot; {m.targetDate}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className={`h-2 w-2 rounded-full ${milestoneStatusDot[m.status]}`} />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {milestoneStatusLabel[m.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
