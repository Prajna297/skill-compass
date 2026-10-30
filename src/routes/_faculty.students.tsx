import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_faculty/students")({
  head: () => ({ meta: [{ title: "Students — SkillAlign" }] }),
  component: StudentsRoute,
});

type StudentProfile = Pick<Tables<"profiles">, "id" | "full_name" | "roll_no" | "email">;
type SubmissionSummary = Pick<
  Tables<"internship_submissions">,
  "student_id" | "company" | "role_title"
>;

interface Row extends StudentProfile {
  company?: string;
  role_title?: string;
}

function StudentsRoute() {
  const location = useLocation();

  if (location.pathname !== "/students") return <Outlet />;

  return <StudentsList />;
}

function StudentsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "student");
      const ids = (roles ?? []).map((r) => r.user_id);
      if (ids.length === 0) {
        setRows([]);
        return;
      }
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, roll_no, email")
        .in("id", ids);
      const { data: subs } = await supabase
        .from("internship_submissions")
        .select("student_id, company, role_title")
        .in("student_id", ids);
      const subMap = new Map<string, SubmissionSummary>(
        ((subs as SubmissionSummary[] | null) ?? []).map((s) => [s.student_id, s]),
      );
      setRows(
        ((profs as StudentProfile[] | null) ?? []).map((p) => ({
          ...p,
          company: subMap.get(p.id)?.company,
          role_title: subMap.get(p.id)?.role_title,
        })),
      );
    })();
  }, []);

  const filtered = rows.filter(
    (r) =>
      !q ||
      (r.full_name + " " + r.roll_no + " " + r.email + " " + (r.company || ""))
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl font-semibold">Students</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live roster of registered student interns. Click a student to view logs and leave
          feedback.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, roll, company..."
          className="pl-9"
        />
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="text-sm text-muted-foreground">No students yet.</div>
        )}
        {filtered.map((s) => (
          <Link key={s.id} to="/students/$id" params={{ id: s.id }}>
            <Card className="card-elevated border-border/60 hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.full_name || s.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.roll_no} · {s.email}
                  </div>
                </div>
                <div className="text-right">
                  {s.company ? (
                    <>
                      <div className="text-sm font-medium">{s.company}</div>
                      <Badge variant="outline" className="text-[10px]">
                        {s.role_title}
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="secondary">No submission yet</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
