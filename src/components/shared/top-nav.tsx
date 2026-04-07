"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export function TopNav() {
  const { lang, setLang } = useLanguage();

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950 backdrop-blur-xl border-b border-slate-800/50 flex justify-between items-center px-6 h-16">
      <Link href="/" className="font-serif text-blue-200 tracking-widest text-xl hover:text-blue-100 transition-colors">
        UUL Global
      </Link>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-900/40 border border-slate-800 text-xs px-4 py-2 w-48 rounded-lg focus:ring-1 focus:ring-blue-400/30 text-blue-100"
          />
        </div>

        {/* Language toggle */}
        <div className="flex items-center rounded-lg border border-slate-700 overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 transition-colors ${
              lang === "en"
                ? "bg-blue-900/60 text-blue-200"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            EN
          </button>
          <div className="w-px h-4 bg-slate-700" />
          <button
            onClick={() => setLang("zh")}
            className={`px-3 py-1.5 transition-colors ${
              lang === "zh"
                ? "bg-blue-900/60 text-blue-200"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            中
          </button>
        </div>

        <span className="material-symbols-outlined text-blue-200 cursor-pointer">notifications</span>
        <span className="material-symbols-outlined text-blue-200 cursor-pointer">account_circle</span>
      </div>
    </nav>
  );
}
