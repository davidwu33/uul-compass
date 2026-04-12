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
import type { GrowthPriority } from "@/lib/data";
import type { CurrentUser } from "@/lib/supabase/get-current-user";
import {
  createGrowthPriority,
  updateGrowthPriority,
  deleteGrowthPriority,
} from "@/lib/actions/growth-priorities";

interface GrowthPriorityModalProps {
  open: boolean;
  onClose: () => void;
  priority?: GrowthPriority | null;
  currentUser: CurrentUser;
}

const defaultForm = {
  name: "",
  description: "",
  status: "active" as "active" | "planned",
  icon: "star",
  sortOrder: "0",
};

const STATUS_LABELS = { active: "Active", planned: "Planned" };

const SUGGESTED_ICONS = [
  "bolt", "group_add", "swap_horiz", "price_change", "public",
  "star", "rocket_launch", "trending_up", "flag", "target",
  "handshake", "storefront", "inventory_2", "factory", "hub",
];

export function GrowthPriorityModal({
  open,
  onClose,
  priority,
  currentUser,
}: GrowthPriorityModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [metrics, setMetrics] = useState<Array<{ label: string; value: string }>>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  const isEdit = !!priority;
  const canWrite = currentUser.isAdmin || currentUser.isContributor;
  const canDelete = isEdit && currentUser.isAdmin;

  useEffect(() => {
    if (!open) { setConfirmDelete(false); return; }
    if (priority) {
      setForm({
        name: priority.name,
        description: priority.description ?? "",
        status: priority.status,
        icon: priority.icon,
        sortOrder: String(priority.sortOrder),
      });
      setMetrics(priority.metrics.map((m) => ({ ...m })));
    } else {
      setForm(defaultForm);
      setMetrics([]);
    }
  }, [open, priority?.id]);

  function set<K extends keyof typeof defaultForm>(key: K, value: (typeof defaultForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addMetric() {
    setMetrics((m) => [...m, { label: "", value: "" }]);
  }

  function updateMetric(i: number, field: "label" | "value", val: string) {
    setMetrics((m) => m.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  function removeMetric(i: number) {
    setMetrics((m) => m.filter((_, idx) => idx !== i));
  }

  function handleSubmit() {
    startTransition(async () => {
      const data = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        status: form.status,
        icon: form.icon.trim() || "star",
        sortOrder: parseInt(form.sortOrder) || 0,
        metrics: metrics.filter((m) => m.label.trim()),
      };
      if (isEdit) {
        await updateGrowthPriority(priority!.id, data);
      } else {
        await createGrowthPriority(data);
      }
      onClose();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteGrowthPriority(priority!.id);
      onClose();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#131b2d] border-slate-700/50 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100 text-base">
            {isEdit ? "Edit Growth Priority" : "New Growth Priority"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-1">
          {/* Name */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Name *</label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Priority name"
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
            />
          </div>

          {/* Status + Icon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Status *</label>
              <Select value={form.status} onValueChange={(v) => set("status", v as typeof form.status)} disabled={!canWrite || pending}>
                <SelectTrigger className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm">
                  <span className="flex-1 text-left">{STATUS_LABELS[form.status]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#1a2236] border border-slate-700/60">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Sort Order</label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", e.target.value)}
                min="0"
                disabled={!canWrite || pending}
                className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm"
              />
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Icon (Material Symbol)</label>
            <div className="flex items-center gap-2">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-[#1a2744] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#b4c5ff] text-xl">{form.icon || "star"}</span>
              </div>
              <Input
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
                placeholder="e.g. bolt"
                disabled={!canWrite || pending}
                className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-9 text-sm flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SUGGESTED_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => set("icon", ic)}
                  disabled={!canWrite || pending}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                    form.icon === ic
                      ? "bg-[#b4c5ff]/20 border border-[#b4c5ff]/50"
                      : "bg-[#0e1525] border border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-[#b4c5ff] text-base">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block uppercase tracking-wider">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What is this priority about?"
              rows={3}
              disabled={!canWrite || pending}
              className="bg-[#0e1525] border-slate-700/50 text-slate-100 text-sm resize-none"
            />
          </div>

          {/* Metrics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] text-slate-400 uppercase tracking-wider">Metrics</label>
              {canWrite && (
                <button
                  type="button"
                  onClick={addMetric}
                  disabled={pending}
                  className="flex items-center gap-1 text-[11px] text-[#b4c5ff] hover:text-[#b4c5ff]/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add metric
                </button>
              )}
            </div>
            <div className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={m.label}
                    onChange={(e) => updateMetric(i, "label", e.target.value)}
                    placeholder="Label"
                    disabled={!canWrite || pending}
                    className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-8 text-sm flex-1"
                  />
                  <Input
                    value={m.value}
                    onChange={(e) => updateMetric(i, "value", e.target.value)}
                    placeholder="Value"
                    disabled={!canWrite || pending}
                    className="bg-[#0e1525] border-slate-700/50 text-slate-100 h-8 text-sm flex-1"
                  />
                  {canWrite && (
                    <button
                      type="button"
                      onClick={() => removeMetric(i)}
                      disabled={pending}
                      className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  )}
                </div>
              ))}
              {metrics.length === 0 && (
                <p className="text-[11px] text-slate-600 italic">No metrics yet</p>
              )}
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
