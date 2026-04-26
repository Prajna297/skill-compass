import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login/student")({
  head: () => ({ meta: [{ title: "Student Login — SkillAlign" }] }),
  component: StudentLogin,
});

function StudentLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/student`,
            data: { full_name: fullName, roll_no: rollNo, role: "student" },
          },
        });
        if (error) throw error;
        toast.success("Account created");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/student" });
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 text-sm text-muted-foreground hover:text-foreground">
          <Sparkles className="h-4 w-4" /> SkillAlign
        </Link>
        <Card className="card-elevated p-8 border-border/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-info/10 text-info flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-xl">Student {mode === "signin" ? "Sign in" : "Sign up"}</h1>
              <p className="text-xs text-muted-foreground">Submit your internship details and daily logs</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={120} />
                </div>
                <div>
                  <Label htmlFor="roll">Roll number</Label>
                  <Input id="roll" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required maxLength={40} />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>No account? <button type="button" className="text-primary hover:underline" onClick={() => setMode("signup")}>Sign up</button></>
            ) : (
              <>Already registered? <button type="button" className="text-primary hover:underline" onClick={() => setMode("signin")}>Sign in</button></>
            )}
          </div>
          <div className="mt-3 text-center text-xs text-muted-foreground">
            Faculty? <Link to="/login/faculty" className="text-primary hover:underline">Use the faculty login</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
