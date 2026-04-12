import { getMeetings } from "@/lib/data";
import { CheckSquare, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MEETING_TYPE_LABEL: Record<string, string> = {
  board: "Board",
  leadership: "Leadership",
  department: "Department",
  strategy: "Strategy",
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DecisionsPage() {
  const meetings = await getMeetings();
  const totalDecisions = meetings.reduce((sum, m) => sum + m.decisions.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/5">
          <CheckSquare className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Decisions</h1>
          <p className="text-xs text-muted-foreground">
            {totalDecisions} decisions across {meetings.length} meetings
          </p>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No meetings recorded yet.
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-4 w-px bg-border hidden sm:block" />

          <div className="space-y-4">
            {meetings.map((m) => (
              <div key={m.id} className="relative flex gap-4">
                <div className="hidden sm:flex flex-col items-center pt-6">
                  <div className="w-[10px] h-[10px] rounded-full bg-primary ring-4 ring-background z-10 shrink-0" />
                </div>

                <Card className="flex-1 shadow-sm border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{m.title}</h3>
                          {m.meetingType && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              {MEETING_TYPE_LABEL[m.meetingType] ?? m.meetingType}
                            </Badge>
                          )}
                        </div>
                        {m.attendees.length > 0 && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {m.attendees.map((a) => a.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 w-fit">
                        {formatDate(m.meetingDate)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {m.decisions.map((item, j) => (
                        <div key={j} className="flex gap-2.5">
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
      )}
    </div>
  );
}
