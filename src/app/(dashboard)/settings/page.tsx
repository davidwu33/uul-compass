import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Building2, Globe } from "lucide-react";

const teamMembers = [
  { name: "Alic Ge", nameZh: "葛成", role: "board", title: "Chairman of the Board", location: "Ningbo", email: "" },
  { name: "Jerry Shi", nameZh: "施童洲", role: "owner", title: "PE Owner & Board Member", location: "Toronto / Asia", email: "jerryshi@synergiscap.com" },
  { name: "Billy Cheng", nameZh: "", role: "board", title: "HK CEO & Board Member", location: "Hong Kong", email: "" },
  { name: "Season Yu", nameZh: "", role: "advisor", title: "PE Partner, Finance Advisor", location: "Shanghai", email: "" },
  { name: "Jason Likens", nameZh: "", role: "executive", title: "CEO, US Operations", location: "US", email: "" },
  { name: "Josh Foster", nameZh: "", role: "executive", title: "COO, US Operations", location: "US", email: "" },
  { name: "Serena Lin", nameZh: "林静", role: "executive", title: "CFO", location: "", email: "" },
  { name: "David Wu", nameZh: "", role: "operator", title: "Engineer", location: "North America", email: "" },
];

const roleConfig: Record<string, { label: string; className: string }> = {
  owner: { label: "Owner", className: "bg-purple-50 text-purple-700 border-purple-200" },
  board: { label: "Board", className: "bg-blue-50 text-blue-700 border-blue-200" },
  advisor: { label: "Advisor", className: "bg-amber-50 text-amber-700 border-amber-200" },
  executive: { label: "Executive", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  operator: { label: "Team", className: "bg-slate-50 text-slate-600 border-slate-200" },
};

const avatarColors: Record<string, string> = {
  owner: "bg-purple-600 text-white",
  board: "bg-blue-600 text-white",
  advisor: "bg-amber-600 text-white",
  executive: "bg-emerald-600 text-white",
  operator: "bg-slate-500 text-white",
};

const entities = [
  { name: "UUL Global", code: "UUL", desc: "Parent company, US HQ", offices: "US, CN, HK, VN" },
  { name: "US United Logistics", code: "MH", desc: "China operations", offices: "SZ, SH, NB, GZ" },
  { name: "Star Navigation", code: "XH", desc: "Northern China logistics", offices: "XM, SZ" },
  { name: "Sageline", code: "SAGE", desc: "Independent operations", offices: "—" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/5">
          <Settings className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
          <p className="text-xs text-muted-foreground">Team, entities, and system configuration</p>
        </div>
      </div>

      {/* Team */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Team Members</CardTitle>
            <span className="text-xs text-muted-foreground ml-auto">{teamMembers.length} members</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {teamMembers.map((m) => {
              const role = roleConfig[m.role] || roleConfig.operator;
              const avatarColor = avatarColors[m.role] || avatarColors.operator;
              return (
                <div
                  key={m.name}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className={`text-[10px] font-bold ${avatarColor}`}>
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{m.name}</p>
                      {m.nameZh && (
                        <span className="text-xs text-muted-foreground">{m.nameZh}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{m.title}</p>
                      {m.location && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <p className="text-xs text-muted-foreground/70">{m.location}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${role.className}`}
                  >
                    {role.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Entities */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Entities</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {entities.map((e) => (
              <div
                key={e.code}
                className="flex items-start gap-3 border border-border/60 rounded-xl p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 shrink-0">
                  <Globe className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{e.name}</p>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{e.code}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Offices: {e.offices}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
