"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ValueSnapshot } from "@/lib/data";

function formatUsdAxis(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function formatUsdTooltip(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000).toLocaleString()}K`;
  return `$${n.toLocaleString()}`;
}

interface TrendChartProps {
  snapshots: ValueSnapshot[];
}

export function TrendChart({ snapshots }: TrendChartProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <h3 className="text-sm font-semibold mb-4">Value Capture Over Time</h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={snapshots}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.02 250)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "oklch(0.60 0.015 250)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => v.replace(" 2026", "")}
            />
            <YAxis
              tick={{ fill: "oklch(0.60 0.015 250)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatUsdAxis}
              width={52}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.025 250)",
                border: "1px solid oklch(0.25 0.02 250)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "oklch(0.93 0.005 250)",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: any, name: any) => [
                formatUsdTooltip(Number(value)),
                name === "planned" ? "Planned" : "Captured",
              ]) as any}
              labelStyle={{ color: "oklch(0.60 0.015 250)", marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey="planned"
              stroke="oklch(0.55 0.02 250)"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              name="planned"
            />
            <Line
              type="monotone"
              dataKey="captured"
              stroke="oklch(0.70 0.17 155)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "oklch(0.70 0.17 155)" }}
              activeDot={{ r: 5, fill: "oklch(0.70 0.17 155)" }}
              name="captured"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
