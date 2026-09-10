import { redirect } from "next/navigation";
import TeamAdminHub from "@/components/TeamAdminHub";
import { requireAdmin } from "@/lib/admin";

export default async function AdminTeamPage() {
  const { authorized } = await requireAdmin();
  if (!authorized) redirect("/admin/login");
  return <TeamAdminHub />;
}
