import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import LocationManager from "@/components/LocationManager";

export default async function AdminLocationsPage() {
  const { authorized } = await requireAdmin();
  if (!authorized) redirect("/admin/login");
  return <LocationManager />;
}
