"use client";

import { useEffect, useState } from "react";
import type { ChatMessage } from "@/hooks/use-chat";
import { usePageBridge } from "@/lib/ai/page-bridge";

export function ProposalCard({
  message,
  onApplied,
  onDismissed,
  onRefine,
}: {
  message: ChatMessage;
  onApplied: (messageId: string) => void;
  onDismissed: (messageId: string) => void;
  onRefine: (messageId: string, instruction: string) => void;
}) {
  const bridge = usePageBridge();
  const proposal = message.proposalPayload;
  const status = message.proposalStatus ?? "pending";

  const [draftValue, setDraftValue] = useState(proposal?.value ?? "");
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineText, setRefineText] = useState("");

  useEffect(() => {
    setDraftValue(proposal?.value ?? "");
    setRefineOpen(false);
    setRefineText("");
  }, [proposal?.value]);

  if (!proposal) return null;

  const field = bridge.fields.find((f) => f.name === proposal.field);
  const label = field?.label ?? proposal.field;
  const isPending = status === "pending";
  const isRegenerating = status === "regenerating";

  const statusLabel =
    status === "applied"
      ? "Applied"
      : status === "dismissed"
        ? "Dismissed"
        : null;

  const handleApply = () => {
    const ok = bridge.applyFieldUpdate(proposal.field, draftValue);
    if (ok) onApplied(message.id);
  };

  const handleRefineSubmit = () => {
    const trimmed = refineText.trim();
    if (!trimmed) return;
    onRefine(message.id, trimmed);
    setRefineText("");
    setRefineOpen(false);
  };

  return (
    <div
      className="mx-4 rounded-lg overflow-hidden"
      style={{ background: "#131b2d", borderLeft: "3px solid #3b82f6" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid #1e293b" }}
      >
        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 font-mono">
          Suggestion · {label}
        </span>
        {statusLabel && (
          <span
            className="text-[10px] uppercase px-2 py-0.5 rounded font-mono"
            style={{
              background: status === "dismissed" ? "#ef444420" : "#22c55e20",
              color: status === "dismissed" ? "#ef4444" : "#22c55e",
            }}
          >
            {statusLabel}
          </span>
        )}
      </div>

      {/* Editable value */}
      <div className="px-4 py-3">
        {renderEditor({ field, value: draftValue, onChange: setDraftValue, disabled: !isPending, dimmed: isRegenerating })}
      </div>

      {/* Reasoning */}
      {proposal.reasoning && (
        <div
          className="px-4 py-2 text-xs italic text-slate-400"
          style={{ borderTop: "1px solid #1e293b", opacity: isRegenerating ? 0.5 : 1 }}
        >
          Why: {proposal.reasoning}
        </div>
      )}

      {/* Refine input */}
      {isPending && refineOpen && (
        <div className="px-4 py-3 space-y-2" style={{ borderTop: "1px solid #1e293b" }}>
          <textarea
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="How should I tweak this?"
            rows={2}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleRefineSubmit();
              }
            }}
            className="w-full px-3 py-2 rounded text-sm outline-none resize-none bg-[#0e1525] text-slate-100 border border-slate-700"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRefineSubmit}
              disabled={!refineText.trim()}
              className="flex-1 py-1.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-600 text-white disabled:opacity-40"
            >
              Regenerate
            </button>
            <button
              onClick={() => { setRefineOpen(false); setRefineText(""); }}
              className="py-1.5 px-3 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {isPending && !refineOpen && (
        <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid #1e293b" }}>
          <button
            onClick={handleApply}
            disabled={!field}
            className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#22c55e20", color: "#22c55e" }}
            title={field ? undefined : `Field "${proposal.field}" not on current page`}
          >
            Apply
          </button>
          <button
            onClick={() => setRefineOpen(true)}
            className="py-2 px-3 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-blue-400"
          >
            Refine
          </button>
          <button
            onClick={() => onDismissed(message.id)}
            className="py-2 px-3 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Regenerating indicator */}
      {isRegenerating && (
        <div className="px-4 py-3 flex items-center gap-1.5" style={{ borderTop: "1px solid #1e293b" }}>
          <span className="block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "160ms" }} />
          <span className="block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "320ms" }} />
          <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            Regenerating
          </span>
        </div>
      )}
    </div>
  );
}

function renderEditor(opts: {
  field: { type: "text" | "textarea" | "select" | "number"; options?: string[] } | undefined;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  dimmed: boolean;
}) {
  const { field, value, onChange, disabled, dimmed } = opts;
  const baseStyle = {
    background: "#0e1525",
    color: "#dbe2fb",
    border: "1px solid #334155",
    opacity: dimmed ? 0.5 : 1,
  } as const;
  const commonClass = "w-full px-3 py-2 rounded text-sm outline-none disabled:cursor-not-allowed";

  if (field?.type === "select" && field.options?.length) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${commonClass} appearance-none`}
        style={baseStyle}
      >
        {!field.options.includes(value) && value ? (
          <option value={value}>{value}</option>
        ) : null}
        {field.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (field?.type === "text") {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={commonClass}
        style={baseStyle}
      />
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={Math.min(6, Math.max(2, value.split("\n").length))}
      className={`${commonClass} resize-y`}
      style={baseStyle}
    />
  );
}
