import { redirect } from "next/navigation";
import AdminDashboardShell from "@/components/AdminDashboardShell";
import { requireStaff } from "@/lib/admin";

export default async function AdminPage() {
  const { authorized, role } = await requireStaff();

  if (!authorized || !role) {
    redirect("/admin/login");
  }

  return <AdminDashboardShell role={role} />;
}
