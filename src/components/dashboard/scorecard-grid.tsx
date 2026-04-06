import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MetricData } from "@/lib/data";

const statusDot: Record<MetricData["status"], string> = {
  green: "bg-emerald-400",
  amber: "bg-amber-400",
  red: "bg-red-400",
  gray: "bg-gray-400",
};

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
} as const;

const trendColor = {
  up: "text-emerald-400",
  down: "text-red-400",
  flat: "text-muted-foreground",
};

interface ScorecardGridProps {
  metrics: MetricData[];
}

export function ScorecardGrid({ metrics }: ScorecardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.slice(0, 4).map((metric) => {
        const TrendIcon = metric.trend ? trendIcon[metric.trend] : null;

        return (
          <Card key={metric.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {metric.name}
                </span>
                <div className={`h-2.5 w-2.5 rounded-full ${statusDot[metric.status]} shrink-0`} />
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold tabular-nums tracking-tight leading-none">
                  {metric.value}
                </span>
                {TrendIcon && (
                  <TrendIcon className={`h-3.5 w-3.5 ${trendColor[metric.trend!]} shrink-0`} />
                )}
              </div>

              <p className="text-[11px] text-muted-foreground mt-1.5">
                Target: {metric.target}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
