import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskData } from "@/lib/data";

const severityConfig = {
  high: {
    border: "border-l-red-500",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "High",
  },
  medium: {
    border: "border-l-amber-500",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    label: "Medium",
  },
  low: {
    border: "border-l-gray-500",
    badge: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    label: "Low",
  },
} as const;

const statusConfig = {
  open: {
    badge: "border-border text-foreground",
    variant: "outline" as const,
    label: "Open",
  },
  mitigating: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    variant: "default" as const,
    label: "Mitigating",
  },
  resolved: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    variant: "default" as const,
    label: "Resolved",
  },
} as const;

export function RiskCard({ risk }: { risk: RiskData }) {
  const severity = severityConfig[risk.severity];
  const status = statusConfig[risk.status];

  return (
    <Card
      className={cn(
        "border-border/60 rounded-xl border-l-3",
        severity.border
      )}
    >
      <CardContent className="pt-5 pb-4 space-y-3">
        {/* Title + badges row */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold leading-snug">{risk.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={cn("text-[10px] border", severity.badge)}>
              {severity.label}
            </Badge>
            <Badge
              variant={status.variant}
              className={cn(
                "text-[10px]",
                status.variant !== "outline" && cn("border", status.badge)
              )}
            >
              {status.label}
            </Badge>
            {risk.workstream && (
              <span className="text-[10px] text-muted-foreground">
                {risk.workstream}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {risk.description}
        </p>

        {/* Mitigation plan */}
        <div className="text-[13px]">
          <span className="text-muted-foreground/70">Plan: </span>
          <span className="text-muted-foreground">{risk.mitigationPlan}</span>
        </div>

        {/* Owner + target date */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback className="text-[10px] font-medium">
                {risk.owner.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {risk.owner.name}
            </span>
          </div>
          {risk.targetDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{risk.targetDate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
