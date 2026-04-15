"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatInput } from "./chat-input";
import { MessageBubble } from "./message-bubble";
import { ProposalCard } from "./proposal-card";
import { ConfirmCard } from "./confirm-card";
import { DraftCard } from "./draft-card";
import type { ChatMode } from "@/lib/ai/tools";
import type { ModeConfig } from "./chat-panel";

// ─── Mode config (shared) ──────────────────────────────────────────────────

export const MODE_CONFIG: Record<NonNullable<ChatMode>, ModeConfig> = {
  create_task: {
    label: "New Task",
    icon: "task_alt",
    description: "Draft and stage a new PMI task for review",
    accent: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
  },
  log_risk: {
    label: "Log Risk",
    icon: "warning",
    description: "Capture a new risk with severity and mitigation",
    accent: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
  },
  analyze_meeting: {
    label: "Analyze Meeting",
    icon: "description",
    description: "Paste a transcript — AI extracts tasks, risks, decisions",
    accent: "text-violet-400",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/30",
  },
  status: {
    label: "Status Check",
    icon: "bar_chart",
    description: "Summary of progress, blockers, and upcoming decisions",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
  },
};

// ─── Mode picker ───────────────────────────────────────────────────────────

export function ModePicker({ onSelect }: { onSelect: (mode: ChatMode) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-300">What would you like to do?</p>
        <p className="text-xs text-slate-600 mt-1">Choose a focused mode, or ask anything.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {(Object.entries(MODE_CONFIG) as [NonNullable<ChatMode>, ModeConfig][]).map(([mode, cfg]) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all hover:brightness-110 active:scale-[0.98] ${cfg.accentBg} ${cfg.accentBorder}`}
          >
            <span className={`material-symbols-outlined ${cfg.accent}`} style={{ fontSize: 22 }}>
              {cfg.icon}
            </span>
            <div>
              <p className={`text-xs font-semibold ${cfg.accent}`}>{cfg.label}</p>
              <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{cfg.description}</p>
            </div>
          </button>
        ))}

        <button
          onClick={() => onSelect(null)}
          className="col-span-2 flex items-center gap-3 p-4 rounded-xl border text-left transition-all hover:brightness-110 active:scale-[0.98] bg-slate-800/40 border-slate-700/40"
        >
          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 22 }}>chat</span>
          <div>
            <p className="text-xs font-semibold text-slate-300">General</p>
            <p className="text-[10px] text-slate-500 leading-snug mt-0.5">Ask anything about the integration</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Mode badge ────────────────────────────────────────────────────────────

export function ModeBadge({ mode, onClear }: { mode: NonNullable<ChatMode>; onClear: () => void }) {
  const cfg = MODE_CONFIG[mode];
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.accentBg} ${cfg.accentBorder} ${cfg.accent}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{cfg.icon}</span>
      {cfg.label}
      <button onClick={onClear} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity" title="Exit mode">
        <span className="material-symbols-outlined" style={{ fontSize: 11 }}>close</span>
      </button>
    </span>
  );
}

// ─── Chat body ─────────────────────────────────────────────────────────────

/**
 * Shared body used by both ChatPanel (slide-in) and /chat full page.
 * Accepts the full useChat() return value so parents own the state.
 */
export function ChatBody({ chat }: { chat: ReturnType<typeof useChat> }) {
  const {
    messages,
    isLoading,
    conversationMode,
    setConversationMode,
    sendMessage,
    refineProposal,
    markProposalApplied,
    markProposalDismissed,
    markDraftApproved,
    markDraftDiscarded,
    resetConversation,
  } = chat;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showModePicker = messages.length === 0 && conversationMode === null;

  return (
    <>
      {/* Messages / Mode picker */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {showModePicker ? (
          <ModePicker onSelect={(mode) => setConversationMode(mode)} />
        ) : (
          <>
            {messages.map((msg) => {
              if (msg.draftPayload?.kind === "confirm") {
                return (
                  <ConfirmCard
                    key={msg.id}
                    message={msg}
                    onConfirmed={markDraftApproved}
                    onCancelled={markDraftDiscarded}
                  />
                );
              }
              if (msg.draftPayload?.kind === "draft") {
                return (
                  <DraftCard
                    key={msg.id}
                    message={msg}
                    onApproved={markDraftApproved}
                    onDiscarded={markDraftDiscarded}
                  />
                );
              }
              if (msg.proposalPayload) {
                return (
                  <ProposalCard
                    key={msg.id}
                    message={msg}
                    onApplied={markProposalApplied}
                    onDismissed={markProposalDismissed}
                    onRefine={refineProposal}
                  />
                );
              }
              return <MessageBubble key={msg.id} message={msg} />;
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input — hidden until mode is chosen */}
      {!showModePicker && (
        <div className="shrink-0">
          <ChatInput
            onSend={(text, attachments) => sendMessage(text, { attachments })}
            isLoading={isLoading}
            mode={conversationMode}
          />
        </div>
      )}
    </>
  );
}
