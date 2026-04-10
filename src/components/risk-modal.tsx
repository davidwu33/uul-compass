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

import type { RiskData, WorkstreamData, UserOption } from "@/lib/data";
import type { CurrentUser } from "@/lib/supabase/get-current-user";
import { createRisk, updateRisk, deleteRisk } from "@/lib/actions/risks";

interface RiskModalProps {
  open: boolean;
  onClose: () => void;
  risk?: RiskData | null;
  workstreams: WorkstreamData[];
  userOptions: UserOption[];
  currentUser: CurrentUser;
}

const defaultForm = {
  title: "",
  description: "",
  severity: "medium" as "high" | "medium" | "low",
  status: "open" as "open" | "mitigating" | "resolved",
  mitigationPlan: "",
  ownerId: "",
  workstreamId: "",
  targetDate: "",
};

export function RiskModal({
  open,
  onClose,
  risk,
  workstreams,
  userOptions,
  currentUser,
}: RiskModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [pending, startTransition] = useTransition();

  const isEdit = !!risk;
  const canWrite = currentUser.isAdmin || currentUser.isContributor;
  const canDelete = isEdit && currentUser.isAdmin;

  useEffect(() => {
    if (!open) return;
    if (risk) {
      setForm({
        title: risk.title,
        description: risk.description ?? "",
        severity: risk.severity,
        status: risk.status,
        mitigationPlan: risk.mitigationPlan ?? "",
        ownerId: risk.owner?.name
          ? (userOptions.find((u) => u.fullName === risk.owner.name)?.id ?? "")
          : "",
        workstreamId: workstreams.find((w) => w.name === risk.workstream)?.id ?? "",
        targetDate: risk.targetDate ?? "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, risk?.id]);

  function set<K extends keyof typeof defaultForm>(key: K, value: (typeof defaultForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const data = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        severity: form.severity,
        status: form.status,
        mitigationPlan: form.mitigationPlan.trim() || undefined,
        ownerId: form.ownerId || undefined,
        workstreamId: form.workstreamId || undefined,
        targetDate: form.targetDate || undefined,
      };
      if (isEdit) {
        await updateRisk(risk!.id, data);
      } else {
        await createRisk(data);
      }
      onClose();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteRisk(risk!.id);
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#131b2d] border-slate-700/50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-base">
            {isEdit ? "Edit Risk" : "New Risk"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* Title */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Risk title"
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
              placeholder="What is the risk?"
              rows={2}
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 text-sm resize-none"
            />
          </div>

          {/* Severity + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Severity *</label>
              <Select
                value={form.severity}
                onValueChange={(v) => set("severity", (v ?? "medium") as typeof form.severity)}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left capitalize">{form.severity}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Status *</label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", (v ?? "open") as typeof form.status)}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left capitalize">{form.status}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="mitigating">Mitigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Mitigation Plan</label>
            <Textarea
              value={form.mitigationPlan}
              onChange={(e) => set("mitigationPlan", e.target.value)}
              placeholder="How is this being mitigated?"
              rows={2}
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 text-sm resize-none"
            />
          </div>

          {/* Owner + Workstream */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Owner</label>
              <Select
                value={form.ownerId}
                onValueChange={(v) => set("ownerId", v ?? "")}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left truncate">
                    {userOptions.find((u) => u.id === form.ownerId)?.fullName
                      ?? <span className="text-slate-500">Unassigned</span>}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="">Unassigned</SelectItem>
                  {userOptions.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Workstream</label>
              <Select
                value={form.workstreamId}
                onValueChange={(v) => set("workstreamId", v ?? "")}
                disabled={!canWrite || pending}
              >
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left truncate">
                    {workstreams.find((w) => w.id === form.workstreamId)?.name
                      ?? <span className="text-slate-500">None</span>}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="">None</SelectItem>
                  {workstreams.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Target Resolution Date</label>
            <Input
              type="date"
              value={form.targetDate}
              onChange={(e) => set("targetDate", e.target.value)}
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
            />
          </div>
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
              disabled={pending || !form.title.trim()}
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
