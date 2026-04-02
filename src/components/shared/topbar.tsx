"use client";

import { Compass, Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70">
          <Compass className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm">Compass</span>
      </div>

      {/* Desktop left — search hint */}
      <div className="hidden lg:flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors text-muted-foreground text-sm">
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search tasks...</span>
          <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground ml-6">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Day counter pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/8">
          <span className="text-xs font-semibold text-primary tabular-nums">Day 2</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>

        {/* Notifications */}
        <button className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[9px] bg-destructive text-white border-2 border-background">
            3
          </Badge>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-border/60 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-[10px] font-semibold bg-primary text-primary-foreground">
              JS
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-xs font-medium leading-none">Jerry</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
