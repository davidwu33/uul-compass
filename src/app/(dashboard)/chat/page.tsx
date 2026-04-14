"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatInput } from "@/components/ai/chat-input";
import { MessageBubble } from "@/components/ai/message-bubble";
import { ProposalCard } from "@/components/ai/proposal-card";
import { ConfirmCard } from "@/components/ai/confirm-card";
import { DraftCard } from "@/components/ai/draft-card";
import type { PageContext } from "@/lib/ai/system-prompt";

const CHAT_PAGE_CONTEXT: PageContext = { route: "/chat" };

export default function ChatPage() {
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
  } = useChat(CHAT_PAGE_CONTEXT);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex flex-col h-[calc(100vh-96px)] -mx-6 -mt-0"
      style={{ background: "#0b1325" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600/20 border border-blue-500/30">
            <span
              className="material-symbols-outlined text-base text-blue-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              assistant
            </span>
          </div>
          <div>
            <h1 className="font-serif text-lg text-slate-100 leading-none mb-0.5">
              Compass AI
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
              PMI Intelligence
            </p>
          </div>
        </div>

        <button
          onClick={resetConversation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-24 gap-5 px-4">
              <span
                className="material-symbols-outlined text-6xl text-slate-800"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                assistant
              </span>
              <div className="text-center">
                <p className="text-base font-serif text-slate-400 mb-2">
                  Ask Compass anything
                </p>
                <p className="text-sm text-slate-600 max-w-md">
                  Task status, risks, value initiatives, upcoming decisions — or paste a
                  meeting transcript to analyze and bulk-update the plan.
                </p>
              </div>
            </div>
          )}

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
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 max-w-3xl w-full mx-auto px-6">
        <ChatInput
          onSend={(text, attachments) => sendMessage(text, { attachments })}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
