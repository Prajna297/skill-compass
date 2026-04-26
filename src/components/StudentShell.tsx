import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Sparkles, FileUp, NotebookPen, MessageSquare, LogOut } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthProvider";

const navItems = [
  { to: "/student" as const, label: "My Internship", icon: FileUp, exact: true },
  { to: "/student/logs" as const, label: "Daily Logs", icon: NotebookPen, exact: false },
  { to: "/student/comments" as const, label: "Mentor Feedback", icon: MessageSquare, exact: false },
];

export function StudentShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = (profile?.full_name || "ST").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-sidebar-foreground leading-tight">SkillAlign</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Student Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground/70">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6">
          <div>
            <div className="text-xs text-muted-foreground">Internship Monitoring System</div>
            <div className="text-sm font-medium">Welcome, {profile?.full_name || "Student"}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2 font-mono">
              {profile?.roll_no || profile?.email}
            </div>
            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center font-semibold text-sm text-primary-foreground">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
