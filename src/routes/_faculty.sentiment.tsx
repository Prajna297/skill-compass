import { createFileRoute } from "@tanstack/react-router";
import { students, weeklyTrend } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/_faculty/sentiment")({
  head: () => ({ meta: [{ title: "Sentiment Analytics — SkillAlign" }] }),
  component: SentimentPage,
});

function SentimentPage() {
  // Build per-student weekly data
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];
  const data = weeks.map((w, i) => {
    const row: Record<string, any> = { week: w };
    students.forEach((s) => { row[s.name] = s.weeklyScores[i]; });
    return row;
  });

  const colors = ["oklch(0.78 0.18 152)", "oklch(0.7 0.15 230)", "oklch(0.82 0.16 80)", "oklch(0.65 0.22 25)", "oklch(0.7 0.18 295)", "oklch(0.78 0.15 200)"];

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-2xl font-display font-bold">Sentiment Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Weekly Fruitfulness Scores derived from sentiment analysis of daily transcripts.</p>
      </div>

      <Card className="card-elevated border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Cohort Trend (1–5 scale)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 250)" />
              <XAxis dataKey="week" stroke="oklch(0.68 0.02 250)" fontSize={12} />
              <YAxis domain={[0, 5]} stroke="oklch(0.68 0.02 250)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.3 0.03 250)", borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="cohort" stroke="oklch(0.78 0.18 152)" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="faculty" stroke="oklch(0.7 0.15 230)" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="admin" stroke="oklch(0.82 0.16 80)" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="card-elevated border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Per-Student Trajectory</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 250)" />
              <XAxis dataKey="week" stroke="oklch(0.68 0.02 250)" fontSize={12} />
              <YAxis domain={[0, 5]} stroke="oklch(0.68 0.02 250)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.22 0.03 250)", border: "1px solid oklch(0.3 0.03 250)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {students.map((s, i) => (
                <Line key={s.id} type="monotone" dataKey={s.name} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
