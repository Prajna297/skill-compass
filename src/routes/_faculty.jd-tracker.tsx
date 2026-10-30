import { createFileRoute } from "@tanstack/react-router";
import { students } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_faculty/jd-tracker")({
  head: () => ({ meta: [{ title: "JD Tracker — SkillAlign" }] }),
  component: JDTracker,
});

function Gauge({ value }: { value: number }) {
  const color =
    value >= 75
      ? "oklch(0.78 0.18 152)"
      : value >= 50
        ? "oklch(0.82 0.16 80)"
        : "oklch(0.65 0.22 25)";
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} stroke="oklch(0.3 0.03 250)" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-xl font-bold">{value}%</div>
        <div className="text-[9px] text-muted-foreground uppercase tracking-wider">match</div>
      </div>
    </div>
  );
}

function JDTracker() {
  return (
    <div className="space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-2xl font-display font-bold">JD Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare each student's actual technology usage against the Job Description requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {students.map((s) => {
          const requiredSet = new Set(s.jdRequired);
          const usedSet = new Set(s.actualUsed);
          return (
            <Card key={s.id} className="card-elevated border-border/60">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center font-semibold text-sm"
                    style={{ background: s.avatarColor, color: "oklch(0.18 0.04 250)" }}
                  >
                    {s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <CardTitle className="text-base font-display">{s.name}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {s.company} · {s.role}
                    </div>
                  </div>
                </div>
                <Gauge value={s.matchPercent} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      JD Required
                    </div>
                    <div className="space-y-1.5">
                      {s.jdRequired.map((t) => {
                        const matched = usedSet.has(t);
                        return (
                          <div key={t} className="flex items-center gap-2 text-sm">
                            {matched ? (
                              <Check className="h-3.5 w-3.5 text-success" />
                            ) : (
                              <X className="h-3.5 w-3.5 text-destructive" />
                            )}
                            <span className={matched ? "" : "text-muted-foreground line-through"}>
                              {t}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      Actual Used
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.actualUsed.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className={
                            requiredSet.has(t)
                              ? "border-success/40 text-success bg-success/5"
                              : "border-info/40 text-info bg-info/5"
                          }
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-3 font-mono">
                      {[...usedSet].filter((x) => !requiredSet.has(x)).length} bonus skills detected
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
