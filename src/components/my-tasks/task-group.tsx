"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PersonalTaskCard } from "./personal-task-card";
import type { TaskData } from "@/lib/data/types";

interface TaskGroupProps {
  label: string;
  count: number;
  tasks: TaskData[];
  variant?: "overdue" | "default" | "muted";
  defaultOpen?: boolean;
}

export function TaskGroup({
  label,
  count,
  tasks,
  variant = "default",
  defaultOpen = true,
}: TaskGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (count === 0) return null;

  return (
    <div>
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full py-2 group cursor-pointer"
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-150",
            !open && "-rotate-90"
          )}
        />
        <span
          className={cn(
            "text-sm font-semibold",
            variant === "overdue" && "text-red-400",
            variant === "muted" && "text-muted-foreground"
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
            variant === "overdue"
              ? "bg-red-500/15 text-red-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {count}
        </span>
      </button>

      {/* Task cards */}
      {open && (
        <div className="space-y-3 mt-1">
          {tasks.map((task) => (
            <PersonalTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
