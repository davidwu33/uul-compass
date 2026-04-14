"use client";

import { useState, useRef, useEffect } from "react";

type FeedbackType = "bug" | "idea" | "question" | "praise";

const TYPES: { key: FeedbackType; label: string }[] = [
  { key: "bug", label: "Bug" },
  { key: "idea", label: "Idea" },
  { key: "question", label: "Question" },
  { key: "praise", label: "Praise" },
];

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("bug");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  async function handleSubmit() {
    if (!text.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          body: text,
          pageUrl: window.location.pathname,
        }),
      });
      setSubmitted(true);
      setText("");
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 lg:left-72 z-40">
      {/* Popover */}
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-80 bg-[#131b2d] border border-slate-700/40 rounded-xl p-4 shadow-2xl shadow-black/40">
          {submitted ? (
            <div className="py-6 flex flex-col items-center gap-2">
              <span
                className="material-symbols-outlined text-3xl text-emerald-400"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <p className="text-sm text-slate-300">Thanks for the feedback!</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Send Feedback
              </p>

              {/* Type pills */}
              <div className="flex gap-2 flex-wrap mb-3">
                {TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setType(t.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      type === t.key
                        ? "bg-[#1a2744] text-[#b4c5ff] border-[#b4c5ff]/30"
                        : "bg-[#131b2d] text-slate-400 border-slate-700/40 hover:text-slate-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe the issue or idea…"
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 px-3 py-2 resize-none focus:outline-none focus:border-slate-600 mb-3"
              />

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || isSubmitting}
                className="w-full px-4 py-2 rounded-lg text-xs font-semibold bg-[#1a2744] hover:bg-[#1f3060] border border-[#b4c5ff]/20 text-[#b4c5ff] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending…" : "Send"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        title="Send feedback"
        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/40 hover:border-slate-600 flex items-center justify-center transition-colors"
      >
        <span
          className="material-symbols-outlined text-slate-400 hover:text-slate-200 text-xl"
          style={{ fontVariationSettings: isOpen ? "'FILL' 1" : "'FILL' 0" }}
        >
          feedback
        </span>
      </button>
    </div>
  );
}
