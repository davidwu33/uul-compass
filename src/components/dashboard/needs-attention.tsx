import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaskData } from "@/lib/data";
import { formatDueDate } from "@/lib/utils";

interface NeedsAttentionProps {
  tasks: TaskData[];
}

const statusLabel: Record<string, { text: string; color: string }> = {
  blocked: { text: "Blocked", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  overdue: { text: "Overdue", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
};

export function NeedsAttention({ tasks }: NeedsAttentionProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Needs Attention</CardTitle>
          {tasks.length > 0 && (
            <span className="text-[10px] font-semibold tabular-nums bg-red-500/15 text-red-400 border border-red-500/30 rounded-full px-1.5 py-0.5">
              {tasks.length}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex items-center gap-2 py-3 px-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-sm text-emerald-400 font-medium">All clear</span>
          </div>
        ) : (
          <div className="space-y-1">
            {tasks.map((task) => {
              const isBlocked = task.status === "blocked";
              const badge = isBlocked ? statusLabel.blocked : statusLabel.overdue;

              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 py-3 px-3 rounded-xl ${
                    isBlocked ? "border-l-2 border-l-red-500" : "border-l-2 border-l-amber-500"
                  } bg-card/40`}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: task.workstreamColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">
                        {task.workstream}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] text-muted-foreground">
                          &middot; Due {formatDueDate(task.dueDate)}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-[10px] text-muted-foreground">
                          &middot; {task.assignee.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 border shrink-0 ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
