import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_faculty/students/$id")({
  head: () => ({ meta: [{ title: "Student Detail — SkillAlign" }] }),
  component: StudentDetail,
});

function StudentDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [sub, setSub] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [jdUrl, setJdUrl] = useState<string | null>(null);

  const load = async () => {
    const [{ data: p }, { data: s }, { data: l }, { data: c }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase.from("internship_submissions").select("*").eq("student_id", id).maybeSingle(),
      supabase.from("activity_logs").select("*").eq("student_id", id).order("created_at", { ascending: false }),
      supabase.from("student_comments").select("*").eq("student_id", id).order("created_at", { ascending: false }),
    ]);
    setProfile(p);
    setSub(s);
    setLogs(l ?? []);
    setComments(c ?? []);
    if (s?.jd_file_path) {
      const { data: signed } = await supabase.storage.from("jd-files").createSignedUrl(s.jd_file_path, 600);
      setJdUrl(signed?.signedUrl ?? null);
    }
  };

  useEffect(() => { load(); }, [id]);

  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setPosting(true);
    try {
      const { error } = await supabase.from("student_comments").insert({
        student_id: id,
        faculty_id: user.id,
        body: body.trim(),
      });
      if (error) throw error;
      setBody("");
      toast.success("Comment posted");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/students" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to students
      </Link>

      <div>
        <h1 className="font-display text-2xl font-semibold">{profile?.full_name || profile?.email}</h1>
        <div className="text-sm text-muted-foreground">{profile?.roll_no} · {profile?.email}</div>
      </div>

      {sub ? (
        <Card className="card-elevated border-border/60">
          <CardHeader>
            <CardTitle className="font-display flex items-center justify-between">
              <span>{sub.company}</span>
              <Badge variant="secondary">{sub.role_title}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">JD</div>
              <p className="whitespace-pre-wrap">{sub.jd_text || "—"}</p>
              {jdUrl && (
                <a href={jdUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                  <FileText className="h-3 w-3" /> View JD file
                </a>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Required</div>
                <div className="flex flex-wrap gap-1.5">
                  {sub.required_tech.map((t: string) => (<Badge key={t} variant="outline">{t}</Badge>))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Used</div>
                <div className="flex flex-wrap gap-1.5">
                  {sub.actual_tech.map((t: string) => (<Badge key={t} className="bg-success/15 text-success hover:bg-success/20">{t}</Badge>))}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Work summary</div>
              <p className="whitespace-pre-wrap">{sub.work_summary}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-elevated border-border/60"><CardContent className="p-5 text-sm text-muted-foreground">Student has not submitted internship details yet.</CardContent></Card>
      )}

      <Card className="card-elevated border-border/60">
        <CardHeader><CardTitle className="font-display text-base">Daily Logs · {logs.length}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {logs.length === 0 && <div className="text-sm text-muted-foreground">No logs yet.</div>}
          {logs.map((l) => (
            <div key={l.id} className="border border-border/60 rounded-lg p-3 bg-card/40">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>{new Date(l.created_at).toLocaleString()}</span>
                {l.sentiment != null && (
                  <Badge variant={l.sentiment >= 3.5 ? "default" : l.sentiment >= 2 ? "secondary" : "destructive"}>
                    {Number(l.sentiment).toFixed(1)}
                  </Badge>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{l.transcript}</p>
              {l.tech_tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {l.tech_tags.map((t: string) => (<Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-elevated border-border/60">
        <CardHeader><CardTitle className="font-display text-base">Mentor Feedback Thread</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={post} className="space-y-2">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Leave feedback for this student..." rows={3} maxLength={2000} />
            <Button type="submit" disabled={posting || !body.trim()}>{posting ? "Posting..." : "Post comment"}</Button>
          </form>
          <div className="space-y-3">
            {comments.length === 0 && <div className="text-sm text-muted-foreground">No comments yet.</div>}
            {comments.map((c) => (
              <div key={c.id} className="border border-border/60 rounded-lg p-3 bg-card/40">
                <div className="text-xs text-muted-foreground mb-1">{new Date(c.created_at).toLocaleString()}</div>
                <p className="text-sm whitespace-pre-wrap">{c.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
