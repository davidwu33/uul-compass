"use client";

import { useState } from "react";
import type { ChatMessage } from "@/hooks/use-chat";

type DraftPayload = {
  kind: "draft";
  entityType: "task" | "risk" | "initiative";
  description: string;
  payload: Record<string, any>;
};

type FieldDef = { label: string; key: string; type?: "text" | "select"; options?: string[] };

const FIELD_MAP: Record<string, FieldDef[]> = {
  task: [
    { label: "Title", key: "title" },
    { label: "Workstream", key: "workstream" },
    { label: "Assignee", key: "assignee" },
    { label: "Priority", key: "priority", type: "select", options: ["critical", "high", "medium", "low"] },
    { label: "Phase", key: "phase", type: "select", options: ["1", "2", "3"] },
    { label: "Due Date", key: "dueDate" },
    { label: "Description", key: "description" },
  ],
  risk: [
    { label: "Title", key: "title" },
    { label: "Severity", key: "severity", type: "select", options: ["high", "medium", "low"] },
    { label: "Workstream", key: "workstream" },
    { label: "Owner", key: "owner" },
    { label: "Description", key: "description" },
    { label: "Mitigation Plan", key: "mitigationPlan" },
  ],
  initiative: [
    { label: "Name", key: "name" },
    { label: "Category", key: "category", type: "select", options: ["cost_savings", "revenue_growth", "cash_flow"] },
    { label: "Workstream", key: "workstream" },
    { label: "Owner", key: "owner" },
    { label: "Planned Impact (USD)", key: "plannedImpactUsd" },
    { label: "Description", key: "description" },
  ],
};

const ENTITY_ICON: Record<string, string> = {
  task: "task_alt",
  risk: "warning",
  initiative: "trending_up",
};

const ENTITY_COLOR: Record<string, string> = {
  task: "#3b82f6",
  risk: "#ef4444",
  initiative: "#22c55e",
};

export function DraftCard({
  message,
  onApproved,
  onDiscarded,
}: {
  message: ChatMessage;
  onApproved: (id: string) => void;
  onDiscarded: (id: string) => void;
}) {
  const draft = message.draftPayload as DraftPayload | null;
  const [status, setStatus] = useState<"pending" | "loading" | "editing" | "done" | "discarded">(
    message.draftStatus === "approved" || message.draftStatus === "edited"
      ? "done"
      : message.draftStatus === "discarded"
        ? "discarded"
        : "pending"
  );
  const [editedPayload, setEditedPayload] = useState<Record<string, any>>(
    draft?.payload ?? {}
  );

  if (!draft || !message.draftId) return null;

  const { entityType, description } = draft;
  const fields = FIELD_MAP[entityType] ?? [];
  const accentColor = ENTITY_COLOR[entityType] ?? "#3b82f6";

  const handleApprove = async (payload?: Record<string, any>) => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/ai/chat/draft/${message.draftId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          ...(payload ? { editedPayload: { ...draft.payload, ...payload, action: draft.payload.action } } : {}),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
      onApproved(message.draftId!);
    } catch (err) {
      setStatus(editedPayload ? "editing" : "pending");
      console.error("Approve failed:", err);
    }
  };

  const handleDiscard = async () => {
    setStatus("discarded");
    await fetch(`/api/ai/chat/draft/${message.draftId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "discard" }),
    }).catch(() => {});
    onDiscarded(message.draftId!);
  };

  // Convert payload keys to display values
  const payloadToFormValues = (p: Record<string, any>): Record<string, any> => {
    const out: Record<string, any> = { ...p };
    // Convert cents back to USD for display
    if (out.plannedImpactCents !== undefined) {
      out.plannedImpactUsd = (out.plannedImpactCents / 100).toString();
      delete out.plannedImpactCents;
    }
    delete out.action;
    return out;
  };

  const displayValues = payloadToFormValues(editedPayload);

  return (
    <div
      className="mx-4 rounded-lg overflow-hidden"
      style={{ background: "#131b2d", borderLeft: `3px solid ${accentColor}` }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: "1px solid #1e293b" }}
      >
        <span className="material-symbols-outlined text-sm" style={{ color: accentColor }}>
          {ENTITY_ICON[entityType] ?? "add_circle"}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-bold font-mono" style={{ color: accentColor }}>
          New {entityType}
        </span>
        {status === "done" && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-emerald-400 font-mono">✓ Created</span>
        )}
        {status === "discarded" && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500 font-mono">Dismissed</span>
        )}
        {(status === "pending" || status === "editing") && (
          <button
            onClick={() => setStatus(status === "editing" ? "pending" : "editing")}
            className="ml-auto text-[10px] uppercase tracking-wider font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            {status === "editing" ? "← Back" : "Edit ✎"}
          </button>
        )}
      </div>

      {/* Summary or edit form */}
      {status !== "editing" ? (
        <div className="px-4 py-3">
          <p className="text-sm text-slate-400">{description}</p>
          {/* Key field preview */}
          <div className="mt-2 space-y-1">
            {fields.slice(0, 4).map((f) => {
              const val = displayValues[f.key];
              if (!val) return null;
              return (
                <div key={f.key} className="flex gap-2 text-xs">
                  <span className="text-slate-500 w-20 shrink-0">{f.label}</span>
                  <span className="text-slate-200 truncate">{String(val)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">
          {fields.map((f) => {
            const val = String(displayValues[f.key] ?? "");
            const isLong = !f.type && val.length > 60;

            return (
              <div key={f.key}>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
                  {f.label}
                </label>
                {f.type === "select" ? (
                  <select
                    value={val}
                    onChange={(e) => setEditedPayload((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded text-sm bg-[#0e1525] text-slate-100 border border-slate-700 outline-none appearance-none"
                  >
                    {f.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                ) : isLong ? (
                  <textarea
                    value={val}
                    onChange={(e) => setEditedPayload((p) => ({ ...p, [f.key]: e.target.value }))}
                    rows={3}
                    className="w-full px-2 py-1.5 rounded text-sm bg-[#0e1525] text-slate-100 border border-slate-700 outline-none resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setEditedPayload((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded text-sm bg-[#0e1525] text-slate-100 border border-slate-700 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {(status === "pending" || status === "editing") && (
        <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid #1e293b" }}>
          <button
            onClick={() =>
              handleApprove(status === "editing" ? editedPayload : undefined)
            }
            disabled={status === "loading" as any}
            className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider text-white active:scale-[0.98] transition-all"
            style={{ background: accentColor }}
          >
            {status === "editing" ? "Save & Create" : "Accept"}
          </button>
          <button
            onClick={handleDiscard}
            className="py-2 px-4 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            Dismiss
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: "1px solid #1e293b" }}>
          <span className="material-symbols-outlined text-sm animate-spin" style={{ color: accentColor }}>
            progress_activity
          </span>
          <span className="text-xs text-slate-500 font-mono">Creating...</span>
        </div>
      )}
    </div>
  );
}
