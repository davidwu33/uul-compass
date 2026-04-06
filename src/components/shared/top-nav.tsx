"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  { label: "Overview", href: "/" },
  { label: "Plan", href: "/plan" },
  { label: "Growth", href: "/value-gains" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950 backdrop-blur-xl border-b border-slate-800/50 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-8">
        <span className="font-serif text-blue-200 tracking-widest text-xl">Compass</span>
        <div className="hidden md:flex gap-6 text-sm font-serif text-blue-200 tracking-tight">
          {tabs.map((tab) => {
            const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  isActive
                    ? "text-blue-200 border-b-2 border-blue-400 py-1 transition-colors"
                    : "text-slate-400 hover:text-blue-100 transition-colors py-1"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search parameters..."
            className="bg-slate-900/40 border border-slate-800 text-xs px-4 py-2 w-64 rounded-lg focus:ring-1 focus:ring-blue-400/30 text-blue-100"
          />
        </div>
        <span className="material-symbols-outlined text-blue-200 cursor-pointer">notifications</span>
        <span className="material-symbols-outlined text-blue-200 cursor-pointer">account_circle</span>
      </div>
    </nav>
  );
}
