import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FileText, Activity, LineChart, AlertTriangle, Settings, Sparkles, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/jd-tracker", label: "JD Tracker", icon: FileText },
  { to: "/activity", label: "Activity Feed", icon: Activity },
  { to: "/sentiment", label: "Sentiment Analytics", icon: LineChart },
  { to: "/alerts", label: "Alert Panel", icon: AlertTriangle },
  { to: "/setup", label: "Collaborative Setup", icon: Settings },
] as const;

export function AppShell() {
  const location = useLocation();
  const [persona, setPersona] = useState<"faculty" | "admin">("faculty");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-sidebar-foreground leading-tight">SkillAlign</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Monitor</div>
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
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-2">View as</div>
          <div className="flex bg-sidebar-accent rounded-lg p-1 gap-1">
            <button
              onClick={() => setPersona("faculty")}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded-md transition-colors",
                persona === "faculty" ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/70"
              )}
            >
              Faculty
            </button>
            <button
              onClick={() => setPersona("admin")}
              className={cn(
                "flex-1 text-xs font-medium py-1.5 rounded-md transition-colors",
                persona === "admin" ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/70"
              )}
            >
              Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6">
          <div>
            <div className="text-xs text-muted-foreground">Internship Monitoring System</div>
            <div className="text-sm font-medium">
              {persona === "faculty" ? "Faculty Mentor" : "Committee Admin"} workspace
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              SSO · Authenticated
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center font-semibold text-sm text-primary-foreground">
              {persona === "faculty" ? "FM" : "CA"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
