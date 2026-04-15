"use client";

import { useChatPanel } from "./chat-provider";
import { useChat } from "@/hooks/use-chat";
import { useChatContext } from "@/hooks/use-chat-context";
import { ChatBody, ModeBadge } from "./chat-body";

// Re-exported so chat-body.tsx can reference the type without a circular dep
export type ModeConfig = {
  label: string;
  icon: string;
  description: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
};

export function ChatPanel() {
  const { isOpen, setIsOpen } = useChatPanel();
  const pageContext = useChatContext();
  const chat = useChat(pageContext);
  const { conversationMode, resetConversation } = chat;

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
              <span className="material-symbols-outlined text-sm text-white">assistant</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">Compass AI</span>
                {conversationMode && (
                  <ModeBadge mode={conversationMode} onClear={resetConversation} />
                )}
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
              <span className="material-symbols-outlined text-lg text-slate-500">add</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg transition-colors hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-lg text-slate-500">close</span>
            </button>
          </div>
        </div>

        <ChatBody chat={chat} />
      </div>
    </>
  );
}
