"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/hooks/use-chat";

export function ConfirmCard({
  message,
  onConfirmed,
  onCancelled,
}: {
  message: ChatMessage;
  onConfirmed: (id: string) => void;
  onCancelled: (id: string) => void;
}) {
  const [status, setStatus] = useState<"pending" | "loading" | "done" | "cancelled">(
    message.draftStatus === "approved" || message.draftStatus === "edited"
      ? "done"
      : message.draftStatus === "discarded"
        ? "cancelled"
        : "pending"
  );

  if (!message.draftPayload || !message.draftId) return null;

  const { description, entityType } = message.draftPayload as {
    description: string;
    entityType: string;
  };

  const entityIcon: Record<string, string> = {
    task: "task_alt",
    risk: "warning",
    initiative: "trending_up",
    comment: "chat_bubble",
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/ai/chat/draft/${message.draftId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
      onConfirmed(message.draftId!);
    } catch (err) {
      setStatus("pending");
      console.error("Confirm failed:", err);
    }
  };

  const handleCancel = async () => {
    setStatus("cancelled");
    await fetch(`/api/ai/chat/draft/${message.draftId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "discard" }),
    }).catch(() => {});
    onCancelled(message.draftId!);
  };

  return (
    <div
      className="mx-4 rounded-lg overflow-hidden"
      style={{ background: "#131b2d", borderLeft: "3px solid #f59e0b" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: "1px solid #1e293b" }}
      >
        <span className="material-symbols-outlined text-sm text-amber-400">
          {entityIcon[entityType] ?? "edit"}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 font-mono">
          Pending Action
        </span>
        {status === "done" && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-emerald-400 font-mono">
            ✓ Applied
          </span>
        )}
        {status === "cancelled" && (
          <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            Cancelled
          </span>
        )}
      </div>

      {/* Description */}
      <div className="px-4 py-3 text-sm text-slate-300 leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p>{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
            code: ({ children }) => <code className="bg-slate-800 rounded px-1 text-xs font-mono text-blue-300">{children}</code>,
          }}
        >
          {description}
        </ReactMarkdown>
      </div>

      {/* Actions */}
      {status === "pending" && (
        <div className="px-4 py-3 flex gap-2" style={{ borderTop: "1px solid #1e293b" }}>
          <button
            onClick={handleConfirm}
            disabled={status !== "pending"}
            className="flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-900 hover:bg-amber-400 active:scale-[0.98] transition-all"
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            className="py-2 px-4 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: "1px solid #1e293b" }}>
          <span className="material-symbols-outlined text-sm text-amber-400 animate-spin">
            progress_activity
          </span>
          <span className="text-xs text-slate-500 font-mono">Applying...</span>
        </div>
      )}
    </div>
  );
}
