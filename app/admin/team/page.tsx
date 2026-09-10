import { redirect } from "next/navigation";
import TeamUserManager from "@/components/TeamUserManager";
import { requireAdmin } from "@/lib/admin";

export default async function AdminTeamPage() {
  const { authorized } = await requireAdmin();
  if (!authorized) redirect("/admin/login");
  return <TeamUserManager />;
}
