import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Check } from "lucide-react";

const decisions = [
  {
    date: "Mar 31, 2026",
    meeting: "Strategy Call",
    attendees: "Jerry, Alic, Billy, Season",
    items: [
      "Exploring logistics stablecoin for on-chain factoring",
      "LC Warehouse + Packsmith WMS integration approved",
      "Ben Fogarty hired for corporate deck rewrite ($4K)",
    ],
  },
  {
    date: "Mar 26, 2026",
    meeting: "Board Decision",
    attendees: "Jerry, Alic, Billy, Season",
    items: [
      "Shenzhen warehouse expansion approved",
      "Hiring 3 operations managers in Q2",
    ],
  },
  {
    date: "Mar 25, 2026",
    meeting: "Operations & Cash Flow Review",
    attendees: "Jerry, Alic, Billy, Season, Jason, Josh",
    items: [
      "VP Finance hire approved at RMB 250-300K/year",
      "$20K marketing budget approved",
      "Bridge financing: Jerry to provide $300K if needed Apr-May",
      "Supply chain finance partnerships: Standard Chartered + Klear",
    ],
  },
  {
    date: "Mar 23, 2026",
    meeting: "Board Sync",
    attendees: "Jerry, Alic, Billy",
    items: [
      "New sales rule: collect payment before shipping for all new contracts",
      "Silfab Plan A: demand 30% prepayment before port arrival",
      "Board structure: Jerry (Chair), Alic, Billy, Season",
      "Jason Likens appointed CEO US, Josh Foster appointed COO US",
      "Three business pillars confirmed: Logistics, SCF, Compliance & Sourcing",
    ],
  },
];

export default function DecisionsPage() {
  const totalDecisions = decisions.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/5">
          <CheckSquare className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Decisions</h1>
          <p className="text-xs text-muted-foreground">
            {totalDecisions} decisions across {decisions.length} meetings
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-8 bottom-4 w-px bg-border hidden sm:block" />

        <div className="space-y-4">
          {decisions.map((d, i) => (
            <div key={i} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className="hidden sm:flex flex-col items-center pt-6">
                <div className="w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-background z-10 shrink-0" />
              </div>

              <Card className="flex-1 shadow-sm border-border/60 hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold">{d.meeting}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{d.attendees}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 w-fit">
                      {d.date}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {d.items.map((item, j) => (
                      <div key={j} className="flex gap-2.5 group">
                        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
