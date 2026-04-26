import { createFileRoute } from "@tanstack/react-router";
import { students, weeklyTrend, skillDistribution } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Target,
  AlertOctagon,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_faculty/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SkillAlign" },
      {
        name: "description",
        content: "Real-time skill alignment outcomes across the internship cohort.",
      },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  tone: "success" | "warning" | "destructive" | "info";
}) {
  const toneClass = {
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
    info: "text-info bg-info/10",
  }[tone];
  return (
    <Card className="card-elevated border-border/60 overflow-hidden relative">
      <div
        className="absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--gradient-primary)" }}
      />
      <CardContent className="p-5 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> {delta}
          </span>
        </div>
        <div className="font-display text-3xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const avgMatch = Math.round(students.reduce((s, x) => s + x.matchPercent, 0) / students.length);
  const onTrack = students.filter((s) => s.status === "on-track").length;
  const critical = students.filter((s) => s.status === "critical").length;
  const avgScore = (
    students.reduce((s, x) => s + x.fruitfulnessScore, 0) / students.length
  ).toFixed(1);

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Hero */}
      <div className="rounded-2xl border border-border/60 card-elevated p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary bg-primary/5">
              <Sparkles className="h-3 w-3 mr-1" /> Skill Alignment Outcome
            </Badge>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Cohort readiness is <span className="gradient-text">{avgMatch}%</span> aligned with JD
              targets
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              AI-driven insights from {students.length} active internships · Falcon-7B + Whisper
              transcript pipeline analyzed {students.length * 14} daily logs this fortnight.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-success/15 text-success border-success/30 border">
              {onTrack} On track
            </Badge>
            <Badge className="bg-destructive/15 text-destructive border-destructive/30 border">
              {critical} Critical
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Avg keyword match"
          value={`${avgMatch}%`}
          delta="+4.2%"
          tone="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Fruitfulness score"
          value={avgScore}
          delta="+0.3"
          tone="info"
        />
        <StatCard
          icon={Users}
          label="Active interns"
          value={String(students.length)}
          delta="+2"
          tone="warning"
        />
        <StatCard
          icon={AlertOctagon}
          label="Critical alerts"
          value={String(critical)}
          delta="2 new"
          tone="destructive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="card-elevated border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-base">Weekly Fruitfulness Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="cohortGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.78 0.18 152)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="oklch(0.78 0.18 152)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 250)" />
                <XAxis dataKey="week" stroke="oklch(0.68 0.02 250)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={12} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.03 250)",
                    border: "1px solid oklch(0.3 0.03 250)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cohort"
                  stroke="oklch(0.78 0.18 152)"
                  strokeWidth={2.5}
                  fill="url(#cohortGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-elevated border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">JD Required vs Used</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={skillDistribution} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 250)" />
                <XAxis type="number" stroke="oklch(0.68 0.02 250)" fontSize={11} />
                <YAxis
                  dataKey="skill"
                  type="category"
                  stroke="oklch(0.68 0.02 250)"
                  fontSize={11}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.03 250)",
                    border: "1px solid oklch(0.3 0.03 250)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="required" fill="oklch(0.7 0.15 230)" radius={4} />
                <Bar dataKey="used" fill="oklch(0.78 0.18 152)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skill gauges */}
      <Card className="card-elevated border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center justify-between">
            Student Skill-Gap Overview
            <Badge variant="outline" className="text-xs font-mono">
              Live · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {students.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border/40 last:border-0"
            >
              <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center font-semibold text-sm"
                  style={{ background: s.avatarColor, color: "oklch(0.18 0.04 250)" }}
                >
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.company} · {s.role}
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="flex items-center gap-3">
                  <Progress value={s.matchPercent} className="h-2 flex-1" />
                  <span className="font-mono text-sm w-12 text-right tabular-nums">
                    {s.matchPercent}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 truncate">
                  Used: {s.actualUsed.slice(0, 4).join(" · ")}
                </div>
              </div>
              <div className="col-span-12 md:col-span-3 flex justify-end gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  ⚡ {s.fruitfulnessScore}
                </Badge>
                <Badge
                  className={
                    s.status === "on-track"
                      ? "bg-success/15 text-success border-success/30 border"
                      : s.status === "at-risk"
                        ? "bg-warning/15 text-warning border-warning/30 border"
                        : "bg-destructive/15 text-destructive border-destructive/30 border"
                  }
                >
                  {s.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insight */}
      <Card className="card-elevated border-primary/30 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "var(--gradient-glow)" }}
        />
        <CardContent className="p-6 relative">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center glow shrink-0">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">
                Managerial AI Insight
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                Cohort outcome readiness: <span className="text-success">High</span> for analytics,{" "}
                <span className="text-destructive">Low</span> for ML/Cloud-native roles
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Falcon-7B analysis of {students.length * 14} transcripts shows strong SQL/Power BI
                exposure (95% saturation) but a 60% gap in containerization and MLOps practice.{" "}
                <span className="text-foreground font-medium">Recommend</span> assigning Sneha Iyer
                and Anjali Reddy to peer-mentor pods within 48h to recover trajectory.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline" className="border-success/30 text-success">
                  Predicted placement-ready: 67%
                </Badge>
                <Badge variant="outline" className="border-warning/30 text-warning">
                  Intervention needed: 33%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
