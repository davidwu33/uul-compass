// TODO: Unused — no imports found. Safe to delete.
"use client";

import { useState } from "react";
import { PhaseFilter } from "./phase-filter";
import { KanbanBoard } from "./kanban-board";
import type { TaskData, WorkstreamData } from "@/lib/data/types";

interface PlanClientProps {
  tasks: TaskData[];
  workstreams: WorkstreamData[];
}

export function PlanClient({ tasks, workstreams }: PlanClientProps) {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const filteredTasks = activePhase
    ? tasks.filter((t) => t.phase === activePhase)
    : tasks;

  // Recompute workstream counts based on filtered tasks
  const filteredWorkstreams = workstreams.map((ws) => {
    const wsTasks = filteredTasks.filter((t) => t.workstream === ws.name);
    return {
      ...ws,
      taskCount: wsTasks.length,
      completed: wsTasks.filter((t) => t.status === "done").length,
    };
  });

  return (
    <>
      {/* Phase filter + Workstream pills */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <PhaseFilter activePhase={activePhase} onPhaseChange={setActivePhase} />
        <div className="h-4 w-px bg-border/60 hidden sm:block" />
        <div className="flex flex-wrap gap-2">
          {filteredWorkstreams.map((ws) => (
            <div
              key={ws.name}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-border/60 bg-card text-xs"
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: ws.color }}
              />
              <span className="font-medium">{ws.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {ws.completed}/{ws.taskCount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard tasks={filteredTasks} />
    </>
  );
}
