"use client";

import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LatestLead = {
  id: string;
  name?: string | null;
  project_type?: string | null;
  created_at?: string | null;
};

const POLL_MS = 15000;

export default function AdminLeadNotification() {
  const [notice, setNotice] = useState<LatestLead | null>(null);
  const baselineId = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    let active = true;

    async function checkLatestLead() {
      try {
        const response = await fetch(
          "/api/leads?page=1&pageSize=1&status=all",
          { cache: "no-store" }
        );
        if (!response.ok) return;

        const result = await response.json();
        const latest = result?.data?.[0] as LatestLead | undefined;
        if (!active || !latest?.id) return;

        if (!initialized.current) {
          baselineId.current = latest.id;
          initialized.current = true;
          return;
        }

        if (baselineId.current && latest.id !== baselineId.current) {
          baselineId.current = latest.id;
          setNotice(latest);

          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Lead baru — RUMAH ARSITEK", {
              body: `${latest.name || "Calon klien"}${latest.project_type ? ` · ${latest.project_type}` : ""}`,
            });
          }
        }
      } catch (error) {
        console.error("[ADMIN LEAD NOTIFICATION]", error);
      }
    }

    checkLatestLead();
    const timer = window.setInterval(checkLatestLead, POLL_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (!notice) return null;

  return (
    <div className="fixed right-4 top-4 z-[100] w-[min(92vw,380px)] rounded-2xl border border-[#cfc9be] bg-white p-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#e9f1eb] text-[#24563b]">
          <Bell size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#24563b]">Lead baru</p>
          <p className="mt-1 text-sm font-semibold text-[#181817]">{notice.name || "Calon klien baru"}</p>
          <p className="mt-1 text-xs leading-5 text-[#77736c]">
            {notice.project_type || "Ceritakan Rencana"} berhasil masuk ke database lead.
          </p>
          <a href="#leads" className="mt-3 inline-flex text-xs font-bold text-[#24563b] underline underline-offset-4">
            Buka daftar lead
          </a>
        </div>
        <button
          type="button"
          onClick={() => setNotice(null)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-[#f4f1eb]"
          aria-label="Tutup notifikasi"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
