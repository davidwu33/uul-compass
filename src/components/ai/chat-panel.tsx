"use client";

import { useRef, useEffect } from "react";
import { useChatPanel } from "./chat-provider";
import { useChat } from "@/hooks/use-chat";
import { useChatContext } from "@/hooks/use-chat-context";
import { ChatInput } from "./chat-input";
import { MessageBubble } from "./message-bubble";
import { ProposalCard } from "./proposal-card";
import { ConfirmCard } from "./confirm-card";
import { DraftCard } from "./draft-card";

export function ChatPanel() {
  const { isOpen, setIsOpen } = useChatPanel();
  const pageContext = useChatContext();
  const {
    messages,
    isLoading,
    sendMessage,
    refineProposal,
    markProposalApplied,
    markProposalDismissed,
    markDraftApproved,
    markDraftDiscarded,
    resetConversation,
  } = useChat(pageContext);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div
        className="fixed z-50 flex flex-col
          bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl
          lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:w-[420px] lg:h-full lg:rounded-none"
        style={{ background: "#0b1325", borderLeft: "1px solid #1e293b" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid #1e293b" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
              <span className="material-symbols-outlined text-sm text-white">
                assistant
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">
                Compass AI
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                PMI Intelligence
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetConversation}
              className="p-2 rounded-lg transition-colors hover:bg-slate-800"
              title="New conversation"
            >
              <span className="material-symbols-outlined text-lg text-slate-500">
                add
              </span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg transition-colors hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-lg text-slate-500">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
              <span
                className="material-symbols-outlined text-5xl"
                style={{ color: "#1e293b" }}
              >
                chat
              </span>
              <p className="text-sm text-center text-slate-500">
                Ask anything about the integration — task status, risks,
                value initiatives, upcoming decisions, or paste a meeting
                transcript to analyze.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            // Tier 1 confirm card
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
            // Tier 2 draft card
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
            // Inline field proposal
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
        </div>

        {/* Input */}
        <div className="shrink-0">
          <ChatInput
            onSend={(text, attachments) => sendMessage(text, { attachments })}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
