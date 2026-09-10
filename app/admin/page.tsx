import { redirect } from "next/navigation";
import AdminDashboardShell from "@/components/AdminDashboardShell";
import { requireAdmin } from "@/lib/admin";

export default async function AdminPage() {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    redirect("/admin/login");
  }

  return <AdminDashboardShell />;
}
