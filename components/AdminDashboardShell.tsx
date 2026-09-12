"use client";

import { useState } from "react";
import { Calculator, Globe2, LayoutDashboard, Users } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";
import EstimatorAdminPanel from "@/components/EstimatorAdminPanel";
import LocationManager from "@/components/LocationManager";
import TeamAdminHub from "@/components/TeamAdminHub";
import type { UserRole } from "@/lib/admin";

type MainTab = "dashboard" | "locations" | "estimator" | "team";

export default function AdminDashboardShell({ role }: { role: UserRole }) {
  const isAdmin = role === "admin";
  const [tab, setTab] = useState<MainTab>(isAdmin ? "dashboard" : "locations");

  return (
    <main className="admin-dashboard-shell min-h-screen bg-[#f7f5f0] text-[#181817]">
      <div className="border-b border-[#d5d0c7] bg-[#f7f5f0]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4d6b52]">RUMAH ARSITEK</div>
            <div className="mt-1 text-sm font-semibold">{isAdmin ? "Admin Workspace" : "Editor Workspace"}</div>
          </div>

          <nav className="flex flex-wrap justify-end gap-2" aria-label="Workspace sections">
            {isAdmin && (
              <button type="button" onClick={() => setTab("dashboard")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${tab === "dashboard" ? "bg-[#181817] text-white" : "border border-[#d5d0c7] bg-white hover:bg-[#faf9f6]"}`}>
                <LayoutDashboard size={14} /> Dashboard
              </button>
            )}

            <button type="button" onClick={() => setTab("locations")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${tab === "locations" ? "bg-[#181817] text-white" : "border border-[#d5d0c7] bg-white hover:bg-[#faf9f6]"}`}>
              <Globe2 size={14} /> Lokasi & SEO
            </button>

            {isAdmin && (
              <button type="button" onClick={() => setTab("estimator")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${tab === "estimator" ? "bg-[#181817] text-white" : "border border-[#d5d0c7] bg-white hover:bg-[#faf9f6]"}`}>
                <Calculator size={14} /> Estimator
              </button>
            )}

            {isAdmin && (
              <button type="button" onClick={() => setTab("team")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${tab === "team" ? "bg-[#181817] text-white" : "border border-[#d5d0c7] bg-white hover:bg-[#faf9f6]"}`}>
                <Users size={14} /> Team & User
              </button>
            )}
          </nav>
        </div>
      </div>

      {tab === "dashboard" && isAdmin ? (
        <div className="[&>main>header+div>div:first-child>button:nth-child(3)]:hidden">
          <AdminDashboard />
        </div>
      ) : tab === "estimator" && isAdmin ? (
        <EstimatorAdminPanel />
      ) : tab === "team" && isAdmin ? (
        <TeamAdminHub />
      ) : (
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <LocationManager embedded />
        </div>
      )}
    </main>
  );
}
