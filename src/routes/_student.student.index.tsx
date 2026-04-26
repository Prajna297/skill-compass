import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lock, Upload, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_student/student/")({
  head: () => ({ meta: [{ title: "My Internship — SkillAlign" }] }),
  component: StudentHome,
});

interface Submission {
  id: string;
  company: string;
  role_title: string;
  jd_text: string | null;
  jd_file_path: string | null;
  required_tech: string[];
  work_summary: string;
  actual_tech: string[];
  submitted_at: string;
}

function StudentHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);

  // Form state
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [requiredTech, setRequiredTech] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [actualTech, setActualTech] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("internship_submissions")
      .select("*")
      .eq("student_id", user.id)
      .maybeSingle();
    setSubmission((data as Submission) ?? null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let jdPath: string | null = null;
      if (jdFile) {
        const ext = jdFile.name.split(".").pop();
        const path = `${user.id}/jd-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("jd-files").upload(path, jdFile);
        if (upErr) throw upErr;
        jdPath = path;
      }
      const { error } = await supabase.from("internship_submissions").insert({
        student_id: user.id,
        company: company.trim(),
        role_title: roleTitle.trim(),
        jd_text: jdText.trim() || null,
        jd_file_path: jdPath,
        required_tech: requiredTech.split(",").map((s) => s.trim()).filter(Boolean),
        work_summary: workSummary.trim(),
        actual_tech: actualTech.split(",").map((s) => s.trim()).filter(Boolean),
      });
      if (error) throw error;
      toast.success("Internship submitted — locked for editing");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  if (submission) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-success">
          <Lock className="h-4 w-4" /> Your internship details are submitted and locked.
        </div>

        <Card className="card-elevated border-border/60">
          <CardHeader>
            <CardTitle className="font-display flex items-center justify-between">
              <span>{submission.company}</span>
              <Badge variant="secondary">{submission.role_title}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Job Description</div>
              <p className="whitespace-pre-wrap">{submission.jd_text || "—"}</p>
              {submission.jd_file_path && (
                <div className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" /> JD file attached
                </div>
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Required Tech</div>
              <div className="flex flex-wrap gap-1.5">
                {submission.required_tech.map((t) => (<Badge key={t} variant="outline">{t}</Badge>))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Tech You Used</div>
              <div className="flex flex-wrap gap-1.5">
                {submission.actual_tech.map((t) => (<Badge key={t} className="bg-success/15 text-success hover:bg-success/20">{t}</Badge>))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Work Summary</div>
              <p className="whitespace-pre-wrap">{submission.work_summary}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated border-border/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="font-medium">Keep adding daily logs</div>
              <p className="text-sm text-muted-foreground">Your daily activity feeds the mentor dashboards in real time.</p>
            </div>
            <Link to="/student/logs"><Button>Add a log</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Submit your Internship
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          You can submit this <strong>only once</strong>. Make sure everything is accurate before saving.
        </p>
      </div>

      <Card className="card-elevated border-border/60">
        <CardContent className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required maxLength={120} />
              </div>
              <div>
                <Label htmlFor="role">Role / Title</Label>
                <Input id="role" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} required maxLength={120} />
              </div>
            </div>

            <div>
              <Label htmlFor="jd">Job Description (paste text)</Label>
              <Textarea id="jd" rows={5} value={jdText} onChange={(e) => setJdText(e.target.value)} maxLength={8000} />
            </div>

            <div>
              <Label htmlFor="jdfile" className="flex items-center gap-2"><Upload className="h-3.5 w-3.5" /> JD file (optional, PDF/DOC)</Label>
              <Input id="jdfile" type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setJdFile(e.target.files?.[0] ?? null)} />
            </div>

            <div>
              <Label htmlFor="req">Required Tech (comma-separated)</Label>
              <Input id="req" placeholder="e.g. SQL, Python, Power BI" value={requiredTech} onChange={(e) => setRequiredTech(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="actual">Tech You Actually Used (comma-separated)</Label>
              <Input id="actual" placeholder="e.g. SQL, Excel, Power BI" value={actualTech} onChange={(e) => setActualTech(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="work">Work Summary</Label>
              <Textarea id="work" rows={5} value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} required maxLength={5000} placeholder="Describe what you did during the internship..." />
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Submitting..." : "Submit (locks after save)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
