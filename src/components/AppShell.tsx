import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Activity, LineChart, AlertTriangle, Settings, Sparkles, Bell, LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { ReactNode } from "react";

const navItems = [
  { to: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/students" as const, label: "Students", icon: Users, exact: false },
  { to: "/jd-tracker" as const, label: "JD Tracker", icon: FileText, exact: false },
  { to: "/activity" as const, label: "Activity Feed", icon: Activity, exact: false },
  { to: "/sentiment" as const, label: "Sentiment Analytics", icon: LineChart, exact: false },
  { to: "/alerts" as const, label: "Alert Panel", icon: AlertTriangle, exact: false },
  { to: "/setup" as const, label: "Collaborative Setup", icon: Settings, exact: false },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = (profile?.full_name || "FM").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

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
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Faculty Console</div>
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
            <div className="text-sm font-medium">Faculty Mentor workspace</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              {profile?.email}
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
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
