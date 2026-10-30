import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_student/student/comments")({
  head: () => ({ meta: [{ title: "Mentor Feedback — SkillAlign" }] }),
  component: CommentsPage,
});

type Comment = Tables<"student_comments">;
type AuthorProfile = Pick<Tables<"profiles">, "id" | "full_name">;

function CommentsPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const [comments, setComments] = useState<Comment[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const { data } = await supabase
        .from("student_comments")
        .select("*")
        .eq("student_id", userId)
        .order("created_at", { ascending: false });
      const list = (data as Comment[]) ?? [];
      setComments(list);
      const ids = Array.from(new Set(list.map((c) => c.faculty_id)));
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", ids);
        const map: Record<string, string> = {};
        ((profs as AuthorProfile[] | null) ?? []).forEach((p) => {
          map[p.id] = p.full_name || "Faculty";
        });
        setAuthors(map);
      }
    })();
  }, [userId]);

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Mentor Feedback</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comments from your faculty mentor appear here.
        </p>
      </div>

      {comments.length === 0 && (
        <Card className="card-elevated border-border/60">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-40" />
            No feedback yet.
          </CardContent>
        </Card>
      )}

      {comments.map((c) => (
        <Card key={c.id} className="card-elevated border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span className="font-medium text-foreground">
                {authors[c.faculty_id] || "Faculty"}
              </span>
              <span>{new Date(c.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{c.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
