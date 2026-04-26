import { createFileRoute } from "@tanstack/react-router";
import { activityFeed } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Cpu, Quote } from "lucide-react";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Activity Feed — SkillAlign" }] }),
  component: ActivityFeedPage,
});

function ActivityFeedPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Daily Activity Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time student logs · transcribed by Whisper, summarized by Falcon-7B.</p>
        </div>
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live stream
        </div>
      </div>

      <div className="space-y-3">
        {activityFeed.map((log) => (
          <Card key={log.id} className="card-elevated border-border/60 hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center font-semibold text-xs text-primary-foreground">
                    {log.studentName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{log.studentName}</div>
                    <div className="text-xs text-muted-foreground">{log.company} · {log.timestamp}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {log.source === "whisper" ? <Mic className="h-3 w-3 mr-1" /> : <Cpu className="h-3 w-3 mr-1" />}
                    {log.source}
                  </Badge>
                  <Badge className={
                    log.sentiment >= 4 ? "bg-success/15 text-success border-success/30 border" :
                    log.sentiment >= 3 ? "bg-warning/15 text-warning border-warning/30 border" :
                    "bg-destructive/15 text-destructive border-destructive/30 border"
                  }>
                    ⚡ {log.sentiment}
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/40 rounded-lg p-4 border-l-2 border-primary/40 relative">
                <Quote className="absolute top-2 right-2 h-3 w-3 text-muted-foreground/40" />
                <p className="text-sm text-foreground/90 leading-relaxed font-mono">"{log.transcript}"</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground self-center mr-1">Tags:</span>
                {log.techTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-info/40 text-info bg-info/5">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
