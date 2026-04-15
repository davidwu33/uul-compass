"use client";

import { useChat } from "@/hooks/use-chat";
import { ChatBody, ModeBadge } from "@/components/ai/chat-body";
import type { PageContext } from "@/lib/ai/system-prompt";

const CHAT_PAGE_CONTEXT: PageContext = { route: "/chat" };

export default function ChatPage() {
  const chat = useChat(CHAT_PAGE_CONTEXT);
  const { conversationMode, resetConversation } = chat;

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
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg text-slate-100 leading-none">Compass AI</h1>
              {conversationMode && (
                <ModeBadge mode={conversationMode} onClear={resetConversation} />
              )}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mt-0.5">
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

      {/* Body — mode picker + messages + input */}
      <div className="flex-1 flex flex-col overflow-hidden max-w-3xl w-full mx-auto px-6">
        <ChatBody chat={chat} />
      </div>
    </div>
  );
}
