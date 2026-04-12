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
import type { ValueInitiative, WorkstreamData, UserOption } from "@/lib/data";
import type { CurrentUser } from "@/lib/supabase/get-current-user";
import { createInitiative, updateInitiative, deleteInitiative } from "@/lib/actions/initiatives";

interface InitiativeModalProps {
  open: boolean;
  onClose: () => void;
  initiative?: ValueInitiative | null;
  workstreams: WorkstreamData[];
  userOptions: UserOption[];
  currentUser: CurrentUser;
}

const defaultForm = {
  name: "",
  category: "revenue_growth" as "cost_savings" | "revenue_growth" | "cash_flow",
  description: "",
  targetDescription: "",
  plannedImpact: "",
  capturedImpact: "",
  status: "planned" as "planned" | "in_progress" | "capturing" | "captured",
  ownerId: "",
  workstreamId: "",
  startDate: "",
  targetDate: "",
};

const CATEGORY_LABELS = {
  revenue_growth: "Revenue Growth",
  cost_savings: "Cost Savings",
  cash_flow: "Cash Flow",
};

const STATUS_LABELS = {
  planned: "Planned",
  in_progress: "In Progress",
  capturing: "Capturing",
  captured: "Captured",
};

export function InitiativeModal({
  open,
  onClose,
  initiative,
  workstreams,
  userOptions,
  currentUser,
}: InitiativeModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const isEdit = !!initiative;
  const canWrite = currentUser.isAdmin || currentUser.isContributor;
  const canDelete = isEdit && currentUser.isAdmin;

  useEffect(() => {
    if (!open) { setConfirmDelete(false); return; }
    if (initiative) {
      setForm({
        name: initiative.name,
        category: initiative.category,
        description: initiative.description ?? "",
        targetDescription: initiative.targetDescription ?? "",
        plannedImpact: initiative.plannedImpact ? String(initiative.plannedImpact) : "",
        capturedImpact: initiative.capturedImpact ? String(initiative.capturedImpact) : "",
        status: initiative.status,
        ownerId: userOptions.find((u) => u.fullName === initiative.owner.name)?.id ?? "",
        workstreamId: workstreams.find((w) => w.name === initiative.workstream)?.id ?? "",
        startDate: "",
        targetDate: "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, initiative?.id]);

  function set<K extends keyof typeof defaultForm>(key: K, value: (typeof defaultForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const data = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || undefined,
        targetDescription: form.targetDescription.trim() || undefined,
        plannedImpact: form.plannedImpact ? parseFloat(form.plannedImpact) : undefined,
        capturedImpact: form.capturedImpact ? parseFloat(form.capturedImpact) : undefined,
        status: form.status,
        ownerId: form.ownerId || undefined,
        workstreamId: form.workstreamId || undefined,
        startDate: form.startDate || undefined,
        targetDate: form.targetDate || undefined,
      };
      if (isEdit) {
        await updateInitiative(initiative!.id, data);
      } else {
        await createInitiative(data);
      }
      onClose();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteInitiative(initiative!.id);
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#131b2d] border-slate-700/50 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-base">
            {isEdit ? "Edit Initiative" : "New Initiative"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* Name */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Name *</label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Initiative name"
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Category *</label>
              <Select value={form.category} onValueChange={(v) => set("category", v as typeof form.category)} disabled={!canWrite || pending}>
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left">{CATEGORY_LABELS[form.category]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="revenue_growth">Revenue Growth</SelectItem>
                  <SelectItem value="cost_savings">Cost Savings</SelectItem>
                  <SelectItem value="cash_flow">Cash Flow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Status *</label>
              <Select value={form.status} onValueChange={(v) => set("status", v as typeof form.status)} disabled={!canWrite || pending}>
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left">{STATUS_LABELS[form.status]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="capturing">Capturing</SelectItem>
                  <SelectItem value="captured">Captured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What is this initiative?"
              rows={2}
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 text-sm resize-none"
            />
          </div>

          {/* Target Description */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Target</label>
            <Input
              value={form.targetDescription}
              onChange={(e) => set("targetDescription", e.target.value)}
              placeholder="e.g. +3-5% revenue"
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
            />
          </div>

          {/* Planned + Captured Impact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Planned Impact (USD)</label>
              <Input
                type="number"
                value={form.plannedImpact}
                onChange={(e) => set("plannedImpact", e.target.value)}
                placeholder="0"
                disabled={!canWrite || pending}
                className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Captured Impact (USD)</label>
              <Input
                type="number"
                value={form.capturedImpact}
                onChange={(e) => set("capturedImpact", e.target.value)}
                placeholder="0"
                disabled={!canWrite || pending}
                className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
              />
            </div>
          </div>

          {/* Owner + Workstream */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Owner</label>
              <Select value={form.ownerId} onValueChange={(v) => set("ownerId", v ?? "")} disabled={!canWrite || pending}>
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left truncate">
                    {userOptions.find((u) => u.id === form.ownerId)?.fullName ?? <span className="text-slate-500">Unassigned</span>}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="">Unassigned</SelectItem>
                  {userOptions.map((u) => <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Workstream</label>
              <Select value={form.workstreamId} onValueChange={(v) => set("workstreamId", v ?? "")} disabled={!canWrite || pending}>
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left truncate">
                    {workstreams.find((w) => w.id === form.workstreamId)?.name ?? <span className="text-slate-500">None</span>}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="">None</SelectItem>
                  {workstreams.map((ws) => <SelectItem key={ws.id} value={ws.id}>{ws.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Start Date</label>
              <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} disabled={!canWrite || pending} className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Target Date</label>
              <Input type="date" value={form.targetDate} onChange={(e) => set("targetDate", e.target.value)} disabled={!canWrite || pending} className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm" />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center gap-2 pt-2">
          {canDelete && (
            confirmDelete ? (
              <>
                <span className="text-xs text-slate-400 mr-1">Are you sure?</span>
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)} disabled={pending} className="text-xs h-8">Cancel</Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={pending} className="text-xs h-8 opacity-60 hover:opacity-100">Yes, delete</Button>
              </>
            ) : (
              <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)} disabled={pending} className="mr-auto text-xs h-8">Delete</Button>
            )
          )}
          {!confirmDelete && (
            <>
              <Button variant="outline" size="sm" onClick={onClose} disabled={pending} className="text-xs h-8">Cancel</Button>
              {canWrite && (
                <Button size="sm" onClick={handleSubmit} disabled={pending || !form.name.trim()} className="text-xs h-8">
                  {pending ? "Saving…" : isEdit ? "Save" : "Create"}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
