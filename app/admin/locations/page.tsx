import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin";
import LocationManager from "@/components/LocationManager";

export default async function AdminLocationsPage() {
  const { authorized } = await requireStaff();
  if (!authorized) redirect("/admin/login");
  return <LocationManager />;
}
