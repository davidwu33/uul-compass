"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

export interface TaskData {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "blocked" | "review" | "done";
  priority: "critical" | "high" | "medium" | "low";
  assignee?: { name: string; initials: string };
  dueDate?: string;
  workstream: string;
  workstreamColor?: string;
}

const priorityConfig = {
  critical: { label: "Critical", dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200", ring: "ring-red-500/20" },
  high: { label: "High", dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200", ring: "" },
  medium: { label: "Medium", dot: "bg-sky-500", badge: "bg-sky-50 text-sky-700 border-sky-200", ring: "" },
  low: { label: "Low", dot: "bg-slate-400", badge: "bg-slate-50 text-slate-600 border-slate-200", ring: "" },
};

export function TaskCard({ task }: { task: TaskData }) {
  const isOverdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate + ", 2026") < new Date();
  const p = priorityConfig[task.priority];
  const isCritical = task.priority === "critical";

  return (
    <div className={cn(
      "bg-card rounded-xl border p-4 transition-all duration-200 cursor-pointer group",
      isCritical
        ? "border-red-200/60 shadow-sm shadow-red-500/5 hover:shadow-md hover:shadow-red-500/10 hover:-translate-y-0.5"
        : "border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      isOverdue && "border-red-300/60"
    )}>
      {/* Workstream tag */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: task.workstreamColor || "#6b7280" }}
          />
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
            {task.workstream}
          </span>
        </div>
        {isOverdue && (
          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
        )}
      </div>

      {/* Title */}
      <p className="text-[13px] font-medium leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-5 shrink-0", p.badge)}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full mr-1 shrink-0", p.dot)} />
            {p.label}
          </Badge>
          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 text-[10px] shrink-0",
                isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground"
              )}
            >
              <Calendar className="h-2.5 w-2.5" />
              {task.dueDate}
            </span>
          )}
        </div>
        {task.assignee && (
          <Avatar className="h-6 w-6 shrink-0 ring-1 ring-border/50">
            <AvatarFallback className="text-[9px] font-semibold bg-primary/8 text-primary">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
