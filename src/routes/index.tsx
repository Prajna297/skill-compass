import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Sparkles, GraduationCap, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillAlign — Internship Monitoring" },
      {
        name: "description",
        content: "AI-powered skill alignment and oversight for student internships.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) {
      navigate({ to: role === "faculty" ? "/dashboard" : "/student" });
    }
  }, [loading, user, role, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center glow">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display font-bold leading-tight">SkillAlign</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
            AI Monitor
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            AI-Driven Skill Alignment Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text leading-tight">
            The Future of Internship Oversight
          </h1>
          <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time skill alignment, sentiment analytics, and AI-powered insight bridging
            students, faculty mentors, and placement committees.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <Link to="/login/student" className="group">
              <div className="card-elevated rounded-2xl border border-border/60 p-6 text-left transition-all hover:border-primary/50 hover:-translate-y-0.5">
                <div className="h-11 w-11 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg">I'm a Student</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Submit your internship JD, log daily work, and read mentor feedback.
                </p>
                <div className="mt-4 text-sm font-medium text-primary">Continue →</div>
              </div>
            </Link>

            <Link to="/login/faculty" className="group">
              <div className="card-elevated rounded-2xl border border-border/60 p-6 text-left transition-all hover:border-primary/50 hover:-translate-y-0.5">
                <div className="h-11 w-11 rounded-xl bg-success/10 text-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <div className="font-display font-semibold text-lg">I'm a Faculty Mentor</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor cohort skill alignment, sentiment, alerts, and leave feedback.
                </p>
                <div className="mt-4 text-sm font-medium text-primary">Continue →</div>
              </div>
            </Link>
          </div>

          <div className="mt-10 text-xs text-muted-foreground">
            Powered by simulated Whisper · Falcon-7B AI pipeline
          </div>
        </div>
      </main>
    </div>
  );
}
