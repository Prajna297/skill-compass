import { createFileRoute } from "@tanstack/react-router";
import { students } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, TrendingDown, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_faculty/alerts")({
  head: () => ({ meta: [{ title: "Alert Panel — SkillAlign" }] }),
  component: AlertPage,
});

function AlertPage() {
  const lowSentiment = students.filter((s) => s.fruitfulnessScore < 2);
  const silent = students.filter((s) => s.daysSinceLog > 3);
  const critical = students.filter((s) => s.status === "critical");

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Alert Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            High-priority interventions requiring mentor action.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 border">
            {critical.length + lowSentiment.length + silent.length} active alerts
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-elevated border-destructive/40 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-xs uppercase tracking-widest text-destructive font-semibold">
                Low Sentiment
              </span>
            </div>
            <div className="font-display text-3xl font-bold">{lowSentiment.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Students with score &lt; 2</div>
          </CardContent>
        </Card>
        <Card className="card-elevated border-warning/40 bg-warning/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-xs uppercase tracking-widest text-warning font-semibold">
                Log Silence
              </span>
            </div>
            <div className="font-display text-3xl font-bold">{silent.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Inactive &gt; 3 days</div>
          </CardContent>
        </Card>
        <Card className="card-elevated border-info/40 bg-info/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-info" />
              <span className="text-xs uppercase tracking-widest text-info font-semibold">
                Critical Total
              </span>
            </div>
            <div className="font-display text-3xl font-bold">{critical.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Combined risk profile</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {[...new Set([...lowSentiment, ...silent, ...critical])].map((s) => {
          const reasons: string[] = [];
          if (s.fruitfulnessScore < 2) reasons.push(`Sentiment score ${s.fruitfulnessScore}`);
          if (s.daysSinceLog > 3) reasons.push(`${s.daysSinceLog} days silent`);
          if (s.matchPercent < 50) reasons.push(`${s.matchPercent}% JD match`);
          return (
            <Card key={s.id} className="border-destructive/40 card-elevated">
              <CardContent className="p-5 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center font-semibold shrink-0"
                  style={{ background: s.avatarColor, color: "oklch(0.18 0.04 250)" }}
                >
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{s.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {s.company}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {reasons.map((r) => (
                      <Badge
                        key={r}
                        className="bg-destructive/15 text-destructive border-destructive/30 border text-xs"
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Contact mentor
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
