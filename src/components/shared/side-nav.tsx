"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: "dashboard", href: "/" },
  { label: "Plan", icon: "event_note", href: "/plan" },
  { label: "My Tasks", icon: "assignment_turned_in", href: "/my-tasks" },
  { label: "Risks", icon: "warning", href: "/risks" },
  { label: "Value Gains", icon: "insights", href: "/value-gains" },
];

const systemItems = [
  { label: "Decisions", icon: "gavel", href: "/decisions" },
  { label: "Settings", icon: "settings", href: "/settings" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col bg-slate-950 border-r border-slate-800/50 z-40 overflow-y-auto">
      <div className="p-6 pt-24">
        {/* Identity */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#00389a] flex items-center justify-center border border-blue-400/20">
            <span className="material-symbols-outlined text-blue-200" style={{ fontVariationSettings: "'FILL' 1" }}>
              compass_calibration
            </span>
          </div>
          <div>
            <p className="font-serif text-blue-100 text-sm">Compass OS</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Intelligence Hub</p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1 divide-y divide-slate-800/30">
          <div className="py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "flex items-center gap-3 px-4 py-3 text-blue-200 font-semibold bg-blue-900/30 border-l-4 border-blue-500 transition-all"
                      : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all"
                  }
                >
                  <span
                    className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="font-sans text-sm font-light tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="py-4 space-y-1">
            {systemItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "flex items-center gap-3 px-4 py-3 text-blue-200 font-semibold bg-blue-900/30 border-l-4 border-blue-500 transition-all"
                      : "flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-all"
                  }
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-sans text-sm font-light tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* CTA */}
        <div className="mt-8">
          <button className="w-full py-3 bg-[#b4c5ff] text-[#002a78] text-xs font-bold rounded-lg tracking-widest uppercase hover:bg-[#b4c5ff]/90 transition-colors">
            New Logistics Plan
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-6 border-t border-slate-800/50">
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 transition-all">
          <span className="material-symbols-outlined">help_outline</span>
          <span className="font-sans text-sm font-light tracking-wide">Support</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 transition-all">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-sans text-sm font-light tracking-wide">Logout</span>
        </a>
      </div>
    </aside>
  );
}
