"use client";

import { useChatPanel } from "./chat-provider";

/**
 * Floating action button that opens the Compass AI chat panel.
 * Fixed bottom-right, above mobile bottom nav.
 */
export function ChatFab() {
  const { toggle, isOpen } = useChatPanel();

  if (isOpen) return null;

  return (
    <button
      onClick={toggle}
      data-chat-fab
      className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform z-40 bg-blue-600 hover:bg-blue-500"
      title="Open Compass AI"
    >
      <span className="material-symbols-outlined text-2xl text-white">
        assistant
      </span>
    </button>
  );
}
