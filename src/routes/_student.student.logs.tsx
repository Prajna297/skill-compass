import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/_student/student/logs")({
  head: () => ({ meta: [{ title: "Daily Logs — SkillAlign" }] }),
  component: LogsPage,
});

interface Log {
  id: string;
  log_date: string;
  transcript: string;
  tech_tags: string[];
  sentiment: number | null;
  created_at: string;
}

function LogsPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const [logs, setLogs] = useState<Log[]>([]);
  const [transcript, setTranscript] = useState("");
  const [techTags, setTechTags] = useState("");
  const [sentiment, setSentiment] = useState("4");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setLogs([]);
      return;
    }

    const { data } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false });
    setLogs((data as Log[]) ?? []);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const s = parseFloat(sentiment);
      const { error } = await supabase.from("activity_logs").insert({
        student_id: userId,
        transcript: transcript.trim(),
        tech_tags: techTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        sentiment: isNaN(s) ? null : Math.max(1, Math.min(5, s)),
      });
      if (error) throw error;
      toast.success("Log added");
      setTranscript("");
      setTechTags("");
      await load();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to add log"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Daily Activity Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add what you worked on today. Your faculty mentor sees this in real time.
        </p>
      </div>

      <Card className="card-elevated border-border/60">
        <CardContent className="p-5">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="t">What did you work on today?</Label>
              <Textarea
                id="t"
                rows={4}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                required
                maxLength={2000}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tech used (comma-separated)</Label>
                <Input
                  id="tags"
                  value={techTags}
                  onChange={(e) => setTechTags(e.target.value)}
                  placeholder="SQL, Python"
                />
              </div>
              <div>
                <Label htmlFor="s">Fruitfulness (1-5)</Label>
                <Input
                  id="s"
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={sentiment}
                  onChange={(e) => setSentiment(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add log"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          History · {logs.length} entries
        </div>
        {logs.length === 0 && <div className="text-sm text-muted-foreground">No logs yet.</div>}
        {logs.map((l) => (
          <Card key={l.id} className="card-elevated border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{new Date(l.created_at).toLocaleString()}</span>
                {l.sentiment != null && (
                  <Badge
                    variant={
                      l.sentiment >= 3.5
                        ? "default"
                        : l.sentiment >= 2
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    Score {l.sentiment.toFixed(1)}
                  </Badge>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{l.transcript}</p>
              {l.tech_tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {l.tech_tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
