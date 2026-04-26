import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileDown, Plus, FileText } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/setup")({
  head: () => ({ meta: [{ title: "Collaborative Setup — SkillAlign" }] }),
  component: SetupPage,
});

function SetupPage() {
  const [keywords, setKeywords] = useState<string[]>(["SQL", "Python", "AWS", "React", "Power BI", "Docker", "TensorFlow", "Spring Boot"]);
  const [newKeyword, setNewKeyword] = useState("");

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Collaborative Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure JD repository, keyword registries, and reporting exports for NAAC compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileDown className="h-4 w-4 mr-2" /> Export CSV</Button>
          <Button className="gradient-primary text-primary-foreground"><FileDown className="h-4 w-4 mr-2" /> Export PDF (NAAC)</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-elevated border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">Upload Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <div className="text-sm font-medium">Drop JD file or click to browse</div>
              <div className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT · max 5MB</div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Or paste raw JD</label>
              <Textarea placeholder="Paste the job description here…" className="mt-2 min-h-32 font-mono text-xs" />
            </div>
            <div className="flex gap-2">
              <Input placeholder="Company name" />
              <Input placeholder="Role title" />
            </div>
            <Button className="w-full">Parse & Add to Registry</Button>
          </CardContent>
        </Card>

        <Card className="card-elevated border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">Keyword Registry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add a skill (e.g. Kubernetes)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newKeyword.trim()) {
                    setKeywords([...keywords, newKeyword.trim()]);
                    setNewKeyword("");
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (newKeyword.trim()) {
                    setKeywords([...keywords, newKeyword.trim()]);
                    setNewKeyword("");
                  }
                }}
              ><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <Badge
                  key={k}
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/5 cursor-pointer hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors"
                  onClick={() => setKeywords(keywords.filter((x) => x !== k))}
                >
                  {k} ×
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {keywords.length} keywords tracked · click to remove
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-elevated border-border/60">
        <CardHeader>
          <CardTitle className="font-display text-base">Active JD Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { c: "Infosys", r: "Data Analyst Intern", k: 5, d: "Apr 12" },
              { c: "TCS", r: "Software Engineer Intern", k: 6, d: "Apr 10" },
              { c: "Deloitte", r: "Business Analyst Intern", k: 4, d: "Apr 08" },
              { c: "Accenture", r: "ML Engineer Intern", k: 5, d: "Apr 05" },
            ].map((j) => (
              <div key={j.c} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{j.c} — {j.r}</div>
                  <div className="text-xs text-muted-foreground">{j.k} keywords · uploaded {j.d}</div>
                </div>
                <Badge variant="outline" className="text-xs">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
