"use client";

import { useState } from "react";
import { Globe2, LayoutDashboard } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";
import LocationManager from "@/components/LocationManager";
import type { UserRole } from "@/lib/admin";

type MainTab = "dashboard" | "locations";

export default function AdminDashboardShell({ role }: { role: UserRole }) {
  const isAdmin = role === "admin";
  const [tab, setTab] = useState<MainTab>(isAdmin ? "dashboard" : "locations");

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#181817]">
      <div className="border-b border-[#d5d0c7] bg-[#f7f5f0]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4d6b52]">RUMAH ARSITEK</div>
            <div className="mt-1 text-sm font-semibold">{isAdmin ? "Admin Workspace" : "Editor Workspace"}</div>
          </div>

          <nav className="flex gap-2" aria-label="Workspace sections">
            {isAdmin && (
              <button type="button" onClick={() => setTab("dashboard")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${tab === "dashboard" ? "bg-[#181817] text-white" : "border border-[#d5d0c7] bg-white hover:bg-[#faf9f6]"}`}>
                <LayoutDashboard size={14} />
                Dashboard
              </button>
            )}

            <button type="button" onClick={() => setTab("locations")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${tab === "locations" ? "bg-[#181817] text-white" : "border border-[#d5d0c7] bg-white hover:bg-[#faf9f6]"}`}>
              <Globe2 size={14} />
              Lokasi & SEO
            </button>
          </nav>
        </div>
      </div>

      {tab === "dashboard" && isAdmin ? (
        <AdminDashboard />
      ) : (
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <LocationManager embedded />
        </div>
      )}
    </main>
  );
}
