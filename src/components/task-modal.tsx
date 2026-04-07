"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical", high: "High", medium: "Medium", low: "Low",
};
const STATUS_LABELS: Record<string, string> = {
  todo: "To Do", in_progress: "In Progress", review: "Review",
  blocked: "Blocked", done: "Done",
};
import type { TaskData, WorkstreamData, UserOption } from "@/lib/data";
import type { CurrentUser } from "@/lib/supabase/get-current-user";
import { createTask, updateTask, deleteTask } from "@/lib/actions/tasks";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: TaskData | null;
  workstreams: WorkstreamData[];
  userOptions: UserOption[];
  currentUser: CurrentUser;
}

const defaultForm = {
  title: "",
  description: "",
  workstreamId: "",
  phase: 1 as 1 | 2 | 3,
  assigneeId: "",
  priority: "medium" as "critical" | "high" | "medium" | "low",
  status: "todo" as "todo" | "in_progress" | "blocked" | "review" | "done",
  dueDate: "",
  isCrossOffice: false,
};

export function TaskModal({
  open,
  onClose,
  task,
  workstreams,
  userOptions,
  currentUser,
}: TaskModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [pending, startTransition] = useTransition();

  const isEdit = !!task;
  const canWrite = currentUser.isAdmin || currentUser.isContributor;
  const canDelete = isEdit && currentUser.isAdmin;

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? "",
        workstreamId: task.workstreamId ?? "",
        phase: task.phase,
        assigneeId: task.assigneeId ?? "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDateRaw ?? "",
        isCrossOffice: task.isCrossOffice ?? false,
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, task?.id]);

  function set<K extends keyof typeof defaultForm>(key: K, value: (typeof defaultForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const data = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        workstreamId: form.workstreamId,
        assigneeId: form.assigneeId || undefined,
        phase: form.phase,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
        isCrossOffice: form.isCrossOffice,
      };
      if (isEdit) {
        await updateTask(task!.id, data);
      } else {
        await createTask(data);
      }
      onClose();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTask(task!.id);
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#131b2d] border-slate-700/50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-base">
            {isEdit ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* Title */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Task title"
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional details..."
              rows={3}
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 text-sm resize-none"
            />
          </div>

          {/* Workstream + Phase */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Workstream *</label>
              <Select
                value={form.workstreamId}
                onValueChange={(v) => set("workstreamId", v ?? "")}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left truncate">
                    {workstreams.find((w) => w.id === form.workstreamId)?.name
                      ?? <span className="text-slate-500">Select...</span>}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  {workstreams.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Phase</label>
              <Select
                value={String(form.phase)}
                onValueChange={(v) => set("phase", Number(v ?? 1) as 1 | 2 | 3)}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left">Phase {form.phase}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="1">Phase 1</SelectItem>
                  <SelectItem value="2">Phase 2</SelectItem>
                  <SelectItem value="3">Phase 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Assignee</label>
              <Select
                value={form.assigneeId}
                onValueChange={(v) => set("assigneeId", v ?? "")}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left truncate">
                    {userOptions.find((u) => u.id === form.assigneeId)?.fullName
                      ?? <span className="text-slate-500">Unassigned</span>}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="">Unassigned</SelectItem>
                  {userOptions.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Priority</label>
              <Select
                value={form.priority}
                onValueChange={(v) => set("priority", (v ?? "medium") as typeof form.priority)}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left">{PRIORITY_LABELS[form.priority]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Status</label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", (v ?? "todo") as typeof form.status)}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left">{STATUS_LABELS[form.status]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Due Date</label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
                disabled={!canWrite || pending}
                className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
              />
            </div>
          </div>

          {/* Cross-office */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isCrossOffice}
              onChange={(e) => set("isCrossOffice", e.target.checked)}
              disabled={!canWrite || pending}
              className="w-3.5 h-3.5 rounded accent-[#b4c5ff]"
            />
            <span className="text-xs text-slate-400">Cross-office task</span>
          </label>
        </div>

        <DialogFooter className="flex items-center gap-2 pt-2">
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={pending}
              className="mr-auto text-xs h-8"
            >
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={pending}
            className="text-xs h-8 border-slate-700"
          >
            Cancel
          </Button>
          {canWrite && (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={pending || !form.title.trim() || !form.workstreamId}
              className="text-xs h-8"
            >
              {pending ? "Saving…" : isEdit ? "Save" : "Create"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
