import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { StudentShell } from "@/components/StudentShell";

export const Route = createFileRoute("/_student")({
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/login/student", search: { redirect: location.href } });
    }
    const { data: r } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle();
    if (r?.role !== "student") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => (
    <StudentShell>
      <Outlet />
    </StudentShell>
  ),
});
