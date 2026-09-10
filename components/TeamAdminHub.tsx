"use client";

import { useState } from "react";
import { ShieldCheck, Users } from "lucide-react";
import TeamManager from "@/components/TeamManager";
import TeamUserManager from "@/components/TeamUserManager";

type Tab = "team" | "users";

export default function TeamAdminHub() {
  const [tab, setTab] = useState<Tab>("team");

  return (
    <div>
      <div className="mx-auto max-w-[1500px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="inline-flex rounded-full border border-[#d5d0c7] bg-white p-1">
          <button type="button" onClick={() => setTab("team")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${tab === "team" ? "bg-[#181817] text-white" : "text-black/60 hover:bg-[#faf9f6]"}`}>
            <Users size={14} /> Team Website
          </button>
          <button type="button" onClick={() => setTab("users")} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${tab === "users" ? "bg-[#181817] text-white" : "text-black/60 hover:bg-[#faf9f6]"}`}>
            <ShieldCheck size={14} /> Akses Dashboard
          </button>
        </div>
      </div>

      {tab === "team" ? <TeamManager /> : <TeamUserManager />}
    </div>
  );
}
