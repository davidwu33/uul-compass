import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  AlertTriangle,
  CalendarCheck,
  Activity,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Zap,
  Layers,
} from "lucide-react";

const stats = {
  completionPercent: 8,
  totalTasks: 52,
  completedTasks: 4,
  overdueTasks: 3,
  dayNumber: 2,
  daysRemaining: 98,
};

const upcomingMilestones = [
  { name: "VP Finance Hire Approved", workstream: "Finance", dueDate: "Apr 4", status: "at_risk" as const, color: "#ef4444" },
  { name: "Silfab 30% AR Prepayment", workstream: "Finance", dueDate: "Apr 7", status: "in_progress" as const, color: "#ef4444" },
  { name: "Target Account List Complete", workstream: "Sales", dueDate: "Apr 5", status: "not_started" as const, color: "#3b82f6" },
  { name: "Corporate Deck v2 Draft", workstream: "Marketing", dueDate: "Apr 2", status: "in_progress" as const, color: "#8b5cf6" },
];

const recentActivity = [
  { action: "created task", target: "VP Finance job posting", actor: "Jerry", initials: "JS", time: "2h ago", color: "bg-blue-500" },
  { action: "completed", target: "Board seat assignments", actor: "Jerry", initials: "JS", time: "3h ago", color: "bg-emerald-500" },
  { action: "commented on", target: "Silfab AR collection plan", actor: "Jerry", initials: "JS", time: "5h ago", color: "bg-amber-500" },
  { action: "created workstream", target: "Technology & AI", actor: "Jerry", initials: "JS", time: "1d ago", color: "bg-cyan-500" },
];

const statusConfig = {
  not_started: { label: "Not Started", className: "bg-slate-100 text-slate-600 border-slate-200" },
  in_progress: { label: "In Progress", className: "bg-sky-50 text-sky-700 border-sky-200" },
  at_risk: { label: "At Risk", className: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const workstreamProgress = [
  { name: "Finance", color: "#ef4444", pct: 8 },
  { name: "Operations", color: "#f97316", pct: 0 },
  { name: "Sales", color: "#3b82f6", pct: 12 },
  { name: "Marketing", color: "#8b5cf6", pct: 28 },
  { name: "Tech & AI", color: "#06b6d4", pct: 0 },
  { name: "Org & HR", color: "#22c55e", pct: 33 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Post-Merger Integration &middot; Day {stats.dayNumber} of 100
        </p>
      </div>

      {/* Hero progress card — elevated design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[oklch(0.25_0.08_250)] via-[oklch(0.22_0.10_250)] to-[oklch(0.18_0.06_260)] text-white shadow-xl shadow-primary/15">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[oklch(0.65_0.15_195)]/10 to-transparent rounded-full translate-y-24 -translate-x-24" />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Layers className="h-4 w-4 text-[oklch(0.75_0.15_195)]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">100-Day Plan Progress</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl lg:text-6xl font-bold tracking-tighter">{stats.completionPercent}%</span>
                <div className="space-y-0.5">
                  <p className="text-sm text-white/60">{stats.completedTasks} of {stats.totalTasks} tasks</p>
                  <p className="text-xs text-white/40">{stats.daysRemaining} days remaining</p>
                </div>
              </div>
              <div className="w-full max-w-sm">
                <Progress
                  value={stats.completionPercent}
                  className="h-1.5 bg-white/10 [&>div]:bg-[oklch(0.75_0.15_195)]"
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="flex gap-1">
              <StatPill value={stats.overdueTasks} label="Overdue" color="text-red-300" />
              <StatPill value={6} label="Active" color="text-[oklch(0.75_0.15_195)]" />
              <StatPill value={22} label="Open" color="text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard
          icon={<Target className="h-4 w-4" />}
          label="Workstreams"
          value="6"
          sub="all active"
          trend="+2 this week"
          trendUp
        />
        <KpiCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Overdue"
          value={String(stats.overdueTasks)}
          sub="need attention"
          accent="destructive"
        />
        <KpiCard
          icon={<CalendarCheck className="h-4 w-4" />}
          label="This Week"
          value="4"
          sub="milestones due"
        />
        <KpiCard
          icon={<Zap className="h-4 w-4" />}
          label="Blocked"
          value="1"
          sub="needs resolution"
        />
      </div>

      {/* Workstream progress bars */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Workstream Progress</CardTitle>
            <span className="text-xs text-muted-foreground">6 workstreams</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {workstreamProgress.map((ws) => (
              <div key={ws.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ws.color }} />
                    <span className="text-xs font-medium">{ws.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">{ws.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(ws.pct, 2)}%`, backgroundColor: ws.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Milestones */}
        <Card className="lg:col-span-3 shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">This Week&apos;s Milestones</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {upcomingMilestones.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <div
                  className="w-1 h-10 rounded-full shrink-0"
                  style={{ backgroundColor: m.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.workstream} &middot; Due {m.dueDate}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] shrink-0 ${statusConfig[m.status].className}`}
                >
                  {statusConfig[m.status].label}
                </Badge>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity feed */}
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {/* Timeline line */}
              <div className="absolute left-[13px] top-3 bottom-3 w-px bg-border" />
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="relative flex items-start gap-3 py-3 px-1"
                >
                  <div className={`relative z-10 h-[10px] w-[10px] rounded-full mt-1.5 ring-2 ring-background ${a.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white/5 backdrop-blur-sm min-w-[80px]">
      <span className={`text-2xl font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  trend,
  trendUp,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  trend?: string;
  trendUp?: boolean;
  accent?: "destructive";
}) {
  return (
    <Card className="shadow-sm border-border/60 hover:shadow-md transition-all duration-200 group">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${
            accent === "destructive" ? "bg-red-50 text-red-500" : "bg-primary/5 text-primary"
          }`}>
            {icon}
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
        </div>
        <div className={`text-3xl font-bold tracking-tight tabular-nums ${
          accent === "destructive" ? "text-red-600" : ""
        }`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {trendUp && <TrendingUp className="h-3 w-3 text-emerald-600" />}
            <span className={trendUp ? "text-emerald-600 font-medium" : "text-muted-foreground"}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
