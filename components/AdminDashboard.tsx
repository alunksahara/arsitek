"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LogOut,
  Search,
  X,
  Save,
  Trash2,
  MessageCircle,
  Download,
  Plus,
  Edit3,
  ShieldCheck,
  History,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Settings2,
  RefreshCw,
} from "lucide-react";

import { createBrowserSupabase } from "@/lib/supabase";

/* ======================================================
   TYPES
====================================================== */

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  project_type: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  category: string | null;
  image_url: string;
  description: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

type Log = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
};

type Profile = {
  id: string;
  email: string | null;
  role: "admin" | "editor";
  active: boolean;
  created_at: string;
  updated_at?: string;
};

/* ======================================================
   ESTIMATOR CONFIG
====================================================== */

type EstimatorConfig = {
  essentialRate: number;
  signatureRate: number;
  premiumRate: number;

  rumahBaruMultiplier: number;
  renovasiMultiplier: number;
  villaMultiplier: number;
  commercialMultiplier: number;

  minimumArea: number;
  minimumMargin: number;
  maximumMargin: number;
};

const DEFAULT_ESTIMATOR_CONFIG: EstimatorConfig = {
  essentialRate: 180000,
  signatureRate: 300000,
  premiumRate: 450000,

  rumahBaruMultiplier: 1,
  renovasiMultiplier: 1.15,
  villaMultiplier: 1.2,
  commercialMultiplier: 1.3,

  minimumArea: 20,
  minimumMargin: 0.85,
  maximumMargin: 1.25,
};

const statuses = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
];

const estimatorStorageKey =
  "atelier-estimator-config-v1";

/* ======================================================
   HELPERS
====================================================== */

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(
    value
  );
}

/* ======================================================
   PAGER
====================================================== */

function Pager({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#d5d0c7] px-4 py-3 text-xs">
      <span>
        Page {page} / {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="border border-[#d5d0c7] px-3 py-2 disabled:opacity-30"
        >
          <ChevronLeft size={15} />
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="border border-[#d5d0c7] px-3 py-2 disabled:opacity-30"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ======================================================
   MAIN DASHBOARD
====================================================== */

export default function AdminDashboard() {
  const [tab, setTab] = useState<
    "leads" | "portfolio" | "audit" | "team" | "estimator"
  >("leads");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(
    []
  );

  const [selected, setSelected] =
    useState<Lead | null>(null);

  const [project, setProject] =
    useState<Project | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [auditPage, setAuditPage] = useState(1);
  const [auditPages, setAuditPages] = useState(1);

  const [confirm, setConfirm] = useState<{
    kind: "lead" | "project";
    id: string;
  } | null>(null);

  const [toast, setToast] = useState("");

  const [stats, setStats] = useState<
    Record<string, number>
  >({
    all: 0,
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    won: 0,
    lost: 0,
    conversion_rate: 0,
  });

  /* ======================================================
     ESTIMATOR STATE
  ====================================================== */

  const [estimator, setEstimator] =
    useState<EstimatorConfig>(
      DEFAULT_ESTIMATOR_CONFIG
    );

  const [previewType, setPreviewType] =
    useState("Rumah Baru");

  const [previewArea, setPreviewArea] =
    useState(120);

  const [previewLevel, setPreviewLevel] =
    useState<
      "Essential" | "Signature" | "Premium"
    >("Signature");

  /* ======================================================
     NOTIFY
  ====================================================== */

  const notify = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2600);
  };

  /* ======================================================
     LOAD ESTIMATOR CONFIG
  ====================================================== */

  useEffect(() => {
    try {
      const saved =
        window.localStorage.getItem(
          estimatorStorageKey
        );

      if (!saved) return;

      const parsed = JSON.parse(saved);

      setEstimator({
        ...DEFAULT_ESTIMATOR_CONFIG,
        ...parsed,
      });
    } catch (error) {
      console.error(
        "[LOAD ESTIMATOR CONFIG]",
        error
      );
    }
  }, []);

  /* ======================================================
     SAVE ESTIMATOR CONFIG
  ====================================================== */

  function saveEstimatorConfig() {
    try {
      window.localStorage.setItem(
        estimatorStorageKey,
        JSON.stringify(estimator)
      );

      notify(
        "Konfigurasi estimator berhasil disimpan"
      );
    } catch (error) {
      console.error(
        "[SAVE ESTIMATOR CONFIG]",
        error
      );

      notify(
        "Gagal menyimpan konfigurasi estimator"
      );
    }
  }

  /* ======================================================
     RESET ESTIMATOR
  ====================================================== */

  function resetEstimatorConfig() {
    setEstimator(
      DEFAULT_ESTIMATOR_CONFIG
    );

    try {
      window.localStorage.setItem(
        estimatorStorageKey,
        JSON.stringify(
          DEFAULT_ESTIMATOR_CONFIG
        )
      );
    } catch {}

    notify(
      "Estimator dikembalikan ke nilai awal"
    );
  }

  /* ======================================================
     UPDATE ESTIMATOR NUMBER
  ====================================================== */

  function updateEstimatorNumber(
    key: keyof EstimatorConfig,
    value: string
  ) {
    const number = Number(value);

    setEstimator((current) => ({
      ...current,
      [key]: Number.isFinite(number)
        ? number
        : 0,
    }));
  }

  /* ======================================================
     ESTIMATOR PREVIEW
  ====================================================== */

  const previewEstimate = useMemo(() => {
    const area = Math.max(
      estimator.minimumArea,
      Number(previewArea) || estimator.minimumArea
    );

    let rate = estimator.signatureRate;

    if (previewLevel === "Essential") {
      rate = estimator.essentialRate;
    }

    if (previewLevel === "Premium") {
      rate = estimator.premiumRate;
    }

    let multiplier =
      estimator.rumahBaruMultiplier;

    if (previewType === "Renovasi") {
      multiplier =
        estimator.renovasiMultiplier;
    }

    if (previewType === "Villa") {
      multiplier =
        estimator.villaMultiplier;
    }

    if (previewType === "Commercial") {
      multiplier =
        estimator.commercialMultiplier;
    }

    const base =
      area *
      rate *
      multiplier;

    return {
      area,
      rate,
      multiplier,
      base,
      min:
        base *
        estimator.minimumMargin,
      max:
        base *
        estimator.maximumMargin,
    };
  }, [
    estimator,
    previewType,
    previewArea,
    previewLevel,
  ]);

  /* ======================================================
     LEADS
  ====================================================== */

  async function loadLeads() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/leads?page=${page}&pageSize=10&q=${encodeURIComponent(
          q
        )}&status=${status}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal mengambil data leads"
        );

        return;
      }

      setLeads(data.data || data.leads || []);

setPages(
  data.pagination?.totalPages ||
    data.totalPages ||
    1
);

// Sinkronkan total lead dari endpoint /api/leads
setStats((current) => ({
  ...current,
  total:
    data.pagination?.total ??
    data.total ??
    current.total ??
    0,
}));
     
    } catch (error) {
      console.error(
        "[DASHBOARD LOAD LEADS]",
        error
      );

      notify(
        "Tidak dapat terhubung ke server"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const response = await fetch(
        "/api/leads/stats",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal mengambil statistik"
        );

        return;
      }

      const statsData = data.data || data;

setStats((current) => ({
  ...current,
  ...statsData,

  // Total keseluruhan lead tetap berasal dari pagination
  // endpoint /api/leads dan tidak boleh hilang.
  total:
    statsData.total ??
    statsData.all ??
    statsData.total_count ??
    current.total ??
    0,
}));
    } catch (error) {
      console.error(
        "[DASHBOARD LOAD STATS]",
        error
      );
    }
  }

  /* ======================================================
     PORTFOLIO
  ====================================================== */

  async function loadProjects() {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/portfolio",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal mengambil portfolio"
        );

        return;
      }

      setProjects(data.projects || []);
    } catch (error) {
      console.error(
        "[DASHBOARD LOAD PORTFOLIO]",
        error
      );

      notify(
        "Tidak dapat terhubung ke server"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     TEAM
  ====================================================== */

  async function loadProfiles() {
    try {
      const response = await fetch(
        "/api/admin/profiles",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal mengambil data team"
        );

        return;
      }

      setProfiles(data.profiles || []);
    } catch (error) {
      console.error(
        "[DASHBOARD LOAD PROFILES]",
        error
      );

      notify(
        "Gagal mengambil data team"
      );
    }
  }

  /* ======================================================
     AUDIT
  ====================================================== */

  async function loadAudit() {
    try {
      const response = await fetch(
        `/api/audit?page=${auditPage}&pageSize=12`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal mengambil audit log"
        );

        return;
      }

      setLogs(data.logs || []);
      setAuditPages(data.totalPages || 1);
    } catch (error) {
      console.error(
        "[DASHBOARD LOAD AUDIT]",
        error
      );

      notify(
        "Gagal mengambil audit log"
      );
    }
  }

  /* ======================================================
     DATA LOADER
  ====================================================== */

  useEffect(() => {
    if (tab === "leads") {
      loadLeads();
      loadStats();
    }

    if (tab === "portfolio") {
      loadProjects();
    }

    if (tab === "audit") {
      loadAudit();
    }

    if (tab === "team") {
      loadProfiles();
    }
  }, [
    tab,
    page,
    status,
    q,
    auditPage,
  ]);

  /* ======================================================
     STATUS COUNTS
  ====================================================== */

  const counts = useMemo(
    () =>
      statuses.reduce(
        (
          result,
          currentStatus
        ) => {
          result[currentStatus] =
            stats[currentStatus] || 0;

          return result;
        },
        {} as Record<string, number>
      ),
    [stats]
  );

  /* ======================================================
     LEAD SAVE
  ====================================================== */

  async function saveLead() {
    if (!selected) return;

    setSaving(true);

    try {
      const response = await fetch(
        "/api/leads",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id: selected.id,
            status: selected.status,
            notes: selected.notes || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal menyimpan lead"
        );

        return;
      }

      setSelected(data.data || data.lead || selected);

      await loadLeads();
      await loadStats();

      notify(
        "Lead berhasil diperbarui"
      );
    } catch (error) {
      console.error(
        "[SAVE LEAD]",
        error
      );

      notify(
        "Tidak dapat terhubung ke server"
      );
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     PORTFOLIO IMAGE UPLOAD
  ====================================================== */

  async function uploadPortfolioImage(
    file: File
  ) {
    if (!project) return;

    if (!file.type.startsWith("image/")) {
      notify(
        "File harus berupa gambar"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify(
        "Ukuran gambar maksimal 5 MB"
      );
      return;
    }

    setSaving(true);

    try {
      const supabase =
        createBrowserSupabase();

      const extension = (
        file.name.split(".").pop() ||
        "jpg"
      ).toLowerCase();

      const safeSlug =
        (project.slug || "project")
          .toLowerCase()
          .replace(
            /[^a-z0-9-]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          ) || "project";

      const user =
        await supabase.auth.getUser();

      const userId =
        user.data.user?.id ||
        "staff";

      const path =
        `${userId}/${Date.now()}-${safeSlug}.${extension}`;

      const upload =
        await supabase.storage
          .from("portfolio")
          .upload(
            path,
            file,
            {
              cacheControl:
                "31536000",
              upsert: false,
              contentType:
                file.type,
            }
          );

      if (upload.error) {
        console.error(
          "[PORTFOLIO UPLOAD]",
          upload.error
        );

        notify(
          upload.error.message
        );

        return;
      }

      const publicUrl =
        supabase.storage
          .from("portfolio")
          .getPublicUrl(path)
          .data.publicUrl;

      setProject({
        ...project,
        image_url: publicUrl,
      });

      notify(
        "Gambar berhasil diupload"
      );
    } catch (error) {
      console.error(
        "[PORTFOLIO UPLOAD FATAL]",
        error
      );

      notify(
        "Gagal mengupload gambar"
      );
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     PORTFOLIO SAVE
  ====================================================== */

  async function saveProject() {
    if (!project) return;

    setSaving(true);

    try {
      const isNew =
        project.id === "new";

      const response = await fetch(
        isNew
          ? "/api/portfolio"
          : `/api/portfolio/${project.id}`,
        {
          method: isNew
            ? "POST"
            : "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            project
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal menyimpan portfolio"
        );

        return;
      }

      setProject(null);

      await loadProjects();

      notify(
        isNew
          ? "Portfolio ditambahkan"
          : "Portfolio diperbarui"
      );
    } catch (error) {
      console.error(
        "[SAVE PORTFOLIO]",
        error
      );

      notify(
        "Tidak dapat terhubung ke server"
      );
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     DELETE
  ====================================================== */

  async function executeDelete() {
    if (!confirm) return;

    try {
      const endpoint =
        confirm.kind === "lead"
          ? "/api/leads"
          : `/api/portfolio/${confirm.id}`;

      const response = await fetch(
        endpoint,
        {
          method: "DELETE",
          ...(confirm.kind === "lead"
            ? {
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  id: confirm.id,
                }),
              }
            : {}),
        }
      );

      const data =
        await response.json().catch(
          () => ({})
        );

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal menghapus data"
        );

        return;
      }

      if (confirm.kind === "lead") {
        setSelected(null);
        await loadLeads();
        await loadStats();
      } else {
        setProject(null);
        await loadProjects();
      }

      setConfirm(null);

      notify(
        "Data berhasil dihapus"
      );
    } catch (error) {
      console.error(
        "[DELETE DATA]",
        error
      );

      notify(
        "Tidak dapat terhubung ke server"
      );
    }
  }

  /* ======================================================
     TEAM UPDATE
  ====================================================== */

  async function updateProfile(
    profile: Profile,
    changes: Partial<Profile>
  ) {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/profiles/${profile.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            changes
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            "Gagal memperbarui team"
        );

        return;
      }

      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id
            ? data.profile
            : item
        )
      );

      notify(
        "Data team berhasil diperbarui"
      );
    } catch (error) {
      console.error(
        "[UPDATE PROFILE]",
        error
      );

      notify(
        "Gagal memperbarui team"
      );
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     EXPORT
  ====================================================== */

  async function exportData(
    kind: "csv" | "xlsx"
  ) {
    try {
      const XLSX =
        await import("xlsx");

      let rows: any[] = [];

      if (tab === "leads") {
        const response =
          await fetch(
            `/api/leads?page=1&pageSize=50&q=${encodeURIComponent(
              q
            )}&status=${status}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        rows = (data.data || data.leads || []).map(
          (lead: Lead) => ({
            Nama: lead.name,
            WhatsApp: lead.phone,
            Email:
              lead.email || "",
            Proyek:
              lead.project_type ||
              "",
            Budget:
              lead.budget || "",
            Status: lead.status,
            Catatan:
              lead.notes || "",
            Dibuat:
              new Date(
                lead.created_at
              ).toLocaleString(
                "id-ID"
              ),
          })
        );
      } else {
        rows = projects.map(
          (item) => ({
            Judul: item.title,
            Slug: item.slug,
            Lokasi:
              item.location || "",
            Kategori:
              item.category || "",
            Published:
              item.published
                ? "Ya"
                : "Tidak",
            Featured:
              item.featured
                ? "Ya"
                : "Tidak",
            Urutan:
              item.sort_order,
          })
        );
      }

      const worksheet =
        XLSX.utils.json_to_sheet(
          rows
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Data"
      );

      XLSX.writeFile(
        workbook,
        `atelier-${tab}-${new Date()
          .toISOString()
          .slice(0, 10)}.${kind}`
      );

      notify(
        "Export selesai"
      );
    } catch (error) {
      console.error(
        "[EXPORT]",
        error
      );

      notify(
        "Export gagal"
      );
    }
  }

  /* ======================================================
     LOGOUT
  ====================================================== */

  async function logout() {
    await createBrowserSupabase()
      .auth
      .signOut();

    window.location.href =
      "/admin/login";
  }

  /* ======================================================
     HELPERS
  ====================================================== */

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function whatsappUrl(
    phone: string
  ) {
    const cleaned =
      phone.replace(
        /\D/g,
        ""
      );

    const normalized =
      cleaned.startsWith("0")
        ? `62${cleaned.slice(1)}`
        : cleaned;

    return `https://wa.me/${normalized}`;
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#181817]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#d5d0c7] bg-[#f7f5f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 md:px-6">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.25em] text-[#4d6b52]">
              ATELIER
            </div>

            <h1 className="mt-1 text-xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 border border-[#cfc9bf] px-3 py-2 text-xs font-medium transition hover:bg-white"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6">

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="mb-6 flex flex-wrap gap-2 border-b border-[#d5d0c7] pb-4">

          <button
            onClick={() => {
              setTab("leads");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              tab === "leads"
                ? "bg-[#181817] text-white"
                : "border border-[#d5d0c7] bg-white"
            }`}
          >
            <MessageCircle size={15} />
            Leads
          </button>

          <button
            onClick={() => {
              setTab("portfolio");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              tab === "portfolio"
                ? "bg-[#181817] text-white"
                : "border border-[#d5d0c7] bg-white"
            }`}
          >
            <FolderKanban size={15} />
            Portfolio CMS
          </button>

          <button
            onClick={() => {
              setTab("estimator");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              tab === "estimator"
                ? "bg-[#181817] text-white"
                : "border border-[#d5d0c7] bg-white"
            }`}
          >
            <Calculator size={15} />
            Estimator
          </button>

          <button
            onClick={() => {
              setTab("team");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              tab === "team"
                ? "bg-[#181817] text-white"
                : "border border-[#d5d0c7] bg-white"
            }`}
          >
            <ShieldCheck size={15} />
            Team
          </button>

          <button
            onClick={() => {
              setTab("audit");
              setAuditPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              tab === "audit"
                ? "bg-[#181817] text-white"
                : "border border-[#d5d0c7] bg-white"
            }`}
          >
            <History size={15} />
            Audit Log
          </button>
        </div>

        {/* ==================================================
            TOAST
        ================================================== */}

        {toast && (
          <div className="fixed bottom-5 right-5 z-[100] max-w-sm border border-[#b8b1a7] bg-[#181817] px-5 py-3 text-sm text-white shadow-xl">
            {toast}
          </div>
        )}

        {/* ==================================================
            LEADS
        ================================================== */}

        {tab === "leads" && (
          <section>

            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#4d6b52]">
                  CRM
                </p>

                <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                  Project inquiries
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68645e]">
                  Kelola inquiry calon klien,
                  status proyek, catatan,
                  dan follow-up.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    exportData("xlsx")
                  }
                  className="flex items-center gap-2 border border-[#cfc9bf] bg-white px-3 py-2 text-xs"
                >
                  <Download size={14} />
                  Excel
                </button>

                <button
                  onClick={() =>
                    exportData("csv")
                  }
                  className="flex items-center gap-2 border border-[#cfc9bf] bg-white px-3 py-2 text-xs"
                >
                  <Download size={14} />
                  CSV
                </button>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-7">

              <button
                onClick={() => {
                  setStatus("all");
                  setPage(1);
                }}
                className={`border p-4 text-left ${
                  status === "all"
                    ? "border-[#181817] bg-[#181817] text-white"
                    : "border-[#d5d0c7] bg-white"
                }`}
              >
                <div className="text-xs opacity-70">
                  Total Leads
                </div>

                <div className="mt-1 text-2xl font-semibold">
                  {stats.total ?? stats.all ?? stats.total_count ?? 0}
                </div>
              </button>

              {statuses.map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setStatus(item);
                      setPage(1);
                    }}
                    className={`border p-4 text-left ${
                      status === item
                        ? "border-[#181817] bg-[#181817] text-white"
                        : "border-[#d5d0c7] bg-white"
                    }`}
                  >
                    <div className="text-xs capitalize opacity-70">
                      {item.replace(
                        "_",
                        " "
                      )}
                    </div>

                    <div className="mt-1 text-2xl font-semibold">
                      {counts[item] ||
                        0}
                    </div>
                  </button>
                )
              )}

              <div className="border border-[#d5d0c7] bg-white p-4 text-left">
                <div className="text-xs text-[#777]">
                  Conversion Rate
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {Number(stats.conversion_rate ?? 0).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 border border-[#d5d0c7] bg-white px-3 py-2">
              <Search
                size={16}
                className="text-[#777]"
              />

              <input
                value={q}
                onChange={(event) => {
                  setQ(
                    event.target.value
                  );
                  setPage(1);
                }}
                placeholder="Cari nama, WhatsApp, email..."
                className="w-full bg-transparent text-sm outline-none"
              />

              {q && (
                <button
                  onClick={() =>
                    setQ("")
                  }
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="overflow-hidden border border-[#d5d0c7] bg-white">

              {loading ? (
                <div className="p-10 text-center text-sm text-[#777]">
                  Loading...
                </div>
              ) : leads.length ===
                0 ? (
                <div className="p-10 text-center text-sm text-[#777]">
                  Belum ada lead.
                </div>
              ) : (
                <>
                  <div className="divide-y divide-[#e4dfd7]">
                    {leads.map(
                      (lead) => (
                        <button
                          key={lead.id}
                          onClick={() =>
                            setSelected(
                              lead
                            )
                          }
                          className="block w-full p-4 text-left transition hover:bg-[#faf9f6]"
                        >
                          <div className="flex flex-col justify-between gap-3 md:flex-row">

                            <div>
                              <div className="font-semibold">
                                {
                                  lead.name
                                }
                              </div>

                              <div className="mt-1 text-xs text-[#777]">
                                {
                                  lead.phone
                                }

                                {lead.email &&
                                  ` · ${lead.email}`}
                              </div>

                              <div className="mt-2 text-sm text-[#555]">
                                {lead.project_type ||
                                  "Project inquiry"}
                              </div>
                            </div>

                            <div className="text-left md:text-right">

                              <div className="inline-block border border-[#d5d0c7] px-2 py-1 text-[10px] uppercase tracking-wider">
                                {lead.status.replace(
                                  "_",
                                  " "
                                )}
                              </div>

                              <div className="mt-2 text-xs text-[#888]">
                                {formatDate(
                                  lead.created_at
                                )}
                              </div>

                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  <Pager
                    page={page}
                    totalPages={pages}
                    onChange={setPage}
                  />
                </>
              )}

            </div>
          </section>
        )}

        {/* ==================================================
            PORTFOLIO
        ================================================== */}

        {tab === "portfolio" && (
          <section>

            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#4d6b52]">
                  CMS
                </p>

                <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                  Portfolio
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#68645e]">
                  Kelola project arsitektur
                  yang tampil di website.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={() =>
                    exportData("xlsx")
                  }
                  className="flex items-center gap-2 border border-[#cfc9bf] bg-white px-3 py-2 text-xs"
                >
                  <Download size={14} />
                  Excel
                </button>

                <button
                  onClick={() =>
                    setProject({
                      id: "new",
                      title: "",
                      slug: "",
                      location: "",
                      category: "",
                      image_url: "",
                      description: "",
                      featured: false,
                      published: true,
                      sort_order:
                        projects.length + 1,
                    })
                  }
                  className="flex items-center gap-2 bg-[#181817] px-4 py-2 text-xs text-white"
                >
                  <Plus size={14} />
                  Tambah
                </button>

              </div>
            </div>

            {loading ? (
              <div className="border border-[#d5d0c7] bg-white p-10 text-center text-sm text-[#777]">
                Loading portfolio...
              </div>
            ) : projects.length ===
              0 ? (
              <div className="border border-[#d5d0c7] bg-white p-10 text-center">

                <div className="text-lg font-semibold">
                  Belum ada project
                </div>

                <p className="mt-2 text-sm text-[#777]">
                  Tambahkan portfolio pertama
                  Anda.
                </p>

              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                {projects.map(
                  (item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden border border-[#d5d0c7] bg-white"
                    >

                      <div className="aspect-[16/10] overflow-hidden bg-[#ebe8e2]">

                        {item.image_url ? (
                          <img
                            src={
                              item.image_url
                            }
                            alt={
                              item.title
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#777]">
                            No image
                          </div>
                        )}

                      </div>

                      <div className="p-4">

                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <h3 className="font-semibold">
                              {
                                item.title
                              }
                            </h3>

                            <p className="mt-1 text-xs text-[#777]">
                              {item.category ||
                                "Uncategorized"}

                              {item.location &&
                                ` · ${item.location}`}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1 text-right">

                            {item.featured && (
                              <span className="text-[9px] uppercase tracking-wider text-[#a65f42]">
                                Featured
                              </span>
                            )}

                            <span
                              className={`text-[9px] uppercase tracking-wider ${
                                item.published
                                  ? "text-[#4d6b52]"
                                  : "text-[#999]"
                              }`}
                            >
                              {item.published
                                ? "Published"
                                : "Draft"}
                            </span>

                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">

                          <button
                            onClick={() =>
                              setProject(
                                item
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-2 border border-[#cfc9bf] px-3 py-2 text-xs"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              setConfirm({
                                kind: "project",
                                id: item.id,
                              })
                            }
                            className="flex items-center justify-center border border-[#d9c4ba] px-3 py-2 text-xs text-[#8d4932]"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>
                      </div>
                    </article>
                  )
                )}

              </div>
            )}
          </section>
        )}

        {/* ==================================================
            ESTIMATOR
        ================================================== */}

        {tab === "estimator" && (
          <section>

            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

              <div>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#4d6b52]">
                  CONFIGURATION
                </p>

                <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                  Project Estimator
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68645e]">
                  Atur rate, multiplier proyek,
                  luas minimum, dan batas
                  estimasi langsung dari
                  dashboard.
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={
                    resetEstimatorConfig
                  }
                  className="flex items-center gap-2 border border-[#cfc9bf] bg-white px-4 py-2 text-xs"
                >
                  <RefreshCw size={14} />
                  Reset
                </button>

                <button
                  onClick={
                    saveEstimatorConfig
                  }
                  className="flex items-center gap-2 bg-[#181817] px-4 py-2 text-xs text-white"
                >
                  <Save size={14} />
                  Simpan konfigurasi
                </button>

              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">

              {/* RATE */}

              <div className="border border-[#d5d0c7] bg-white p-5">

                <div className="flex items-center gap-2 border-b border-[#e4dfd7] pb-4">
                  <Calculator size={18} />

                  <div>
                    <h3 className="font-semibold">
                      Design Rate
                    </h3>

                    <p className="text-xs text-[#777]">
                      Harga dasar per m²
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-5">

                  <label className="block text-xs">
                    <span className="mb-2 block font-medium text-[#555]">
                      Essential
                    </span>

                    <div className="flex items-center border border-[#cfc9bf] bg-[#faf9f6]">

                      <span className="px-3 text-xs text-[#777]">
                        Rp
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          estimator.essentialRate
                        }
                        onChange={(event) =>
                          updateEstimatorNumber(
                            "essentialRate",
                            event.target.value
                          )
                        }
                        className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                      />

                      <span className="px-3 text-xs text-[#777]">
                        /m²
                      </span>

                    </div>
                  </label>

                  <label className="block text-xs">
                    <span className="mb-2 block font-medium text-[#555]">
                      Signature
                    </span>

                    <div className="flex items-center border border-[#cfc9bf] bg-[#faf9f6]">

                      <span className="px-3 text-xs text-[#777]">
                        Rp
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          estimator.signatureRate
                        }
                        onChange={(event) =>
                          updateEstimatorNumber(
                            "signatureRate",
                            event.target.value
                          )
                        }
                        className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                      />

                      <span className="px-3 text-xs text-[#777]">
                        /m²
                      </span>

                    </div>
                  </label>

                  <label className="block text-xs">
                    <span className="mb-2 block font-medium text-[#555]">
                      Premium
                    </span>

                    <div className="flex items-center border border-[#cfc9bf] bg-[#faf9f6]">

                      <span className="px-3 text-xs text-[#777]">
                        Rp
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          estimator.premiumRate
                        }
                        onChange={(event) =>
                          updateEstimatorNumber(
                            "premiumRate",
                            event.target.value
                          )
                        }
                        className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                      />

                      <span className="px-3 text-xs text-[#777]">
                        /m²
                      </span>

                    </div>
                  </label>

                </div>
              </div>

              {/* MULTIPLIER */}

              <div className="border border-[#d5d0c7] bg-white p-5">

                <div className="flex items-center gap-2 border-b border-[#e4dfd7] pb-4">
                  <Settings2 size={18} />

                  <div>
                    <h3 className="font-semibold">
                      Project Multiplier
                    </h3>

                    <p className="text-xs text-[#777]">
                      Faktor berdasarkan tipe
                      proyek
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">

                  {[
                    [
                      "Rumah Baru",
                      "rumahBaruMultiplier",
                    ],
                    [
                      "Renovasi",
                      "renovasiMultiplier",
                    ],
                    [
                      "Villa",
                      "villaMultiplier",
                    ],
                    [
                      "Commercial",
                      "commercialMultiplier",
                    ],
                  ].map(
                    ([label, key]) => (
                      <label
                        key={key}
                        className="flex items-center justify-between gap-4 text-xs"
                      >

                        <span className="font-medium text-[#555]">
                          {label}
                        </span>

                        <div className="flex items-center border border-[#cfc9bf] bg-[#faf9f6]">

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              estimator[
                                key as keyof EstimatorConfig
                              ] as number
                            }
                            onChange={(event) =>
                              updateEstimatorNumber(
                                key as keyof EstimatorConfig,
                                event.target.value
                              )
                            }
                            className="w-24 bg-transparent px-3 py-3 text-right text-sm outline-none"
                          />

                          <span className="px-3 text-xs text-[#777]">
                            ×
                          </span>

                        </div>

                      </label>
                    )
                  )}

                </div>
              </div>

              {/* RANGE */}

              <div className="border border-[#d5d0c7] bg-white p-5">

                <div className="border-b border-[#e4dfd7] pb-4">
                  <h3 className="font-semibold">
                    Estimation Range
                  </h3>

                  <p className="mt-1 text-xs text-[#777]">
                    Mengatur batas bawah dan
                    atas hasil estimator.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <label className="text-xs">
                    <span className="mb-2 block font-medium">
                      Luas minimum
                    </span>

                    <div className="flex items-center border border-[#cfc9bf]">

                      <input
                        type="number"
                        min="1"
                        value={
                          estimator.minimumArea
                        }
                        onChange={(event) =>
                          updateEstimatorNumber(
                            "minimumArea",
                            event.target.value
                          )
                        }
                        className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                      />

                      <span className="px-3 text-[#777]">
                        m²
                      </span>

                    </div>
                  </label>

                  <label className="text-xs">
                    <span className="mb-2 block font-medium">
                      Margin minimum
                    </span>

                    <div className="flex items-center border border-[#cfc9bf]">

                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={
                          estimator.minimumMargin
                        }
                        onChange={(event) =>
                          updateEstimatorNumber(
                            "minimumMargin",
                            event.target.value
                          )
                        }
                        className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                      />

                      <span className="px-3 text-[#777]">
                        ×
                      </span>

                    </div>
                  </label>

                  <label className="text-xs">
                    <span className="mb-2 block font-medium">
                      Margin maksimum
                    </span>

                    <div className="flex items-center border border-[#cfc9bf]">

                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={
                          estimator.maximumMargin
                        }
                        onChange={(event) =>
                          updateEstimatorNumber(
                            "maximumMargin",
                            event.target.value
                          )
                        }
                        className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                      />

                      <span className="px-3 text-[#777]">
                        ×
                      </span>

                    </div>
                  </label>

                </div>
              </div>

              {/* PREVIEW */}

              <div className="border border-[#d5d0c7] bg-[#26241f] p-5 text-white">

                <div className="flex items-center gap-2 border-b border-white/10 pb-4">

                  <Calculator size={18} />

                  <div>
                    <h3 className="font-semibold">
                      Live Preview
                    </h3>

                    <p className="text-xs text-white/55">
                      Simulasi rumus estimator
                    </p>
                  </div>

                </div>

                <div className="mt-5 grid gap-4">

                  <label className="text-xs">
                    <span className="mb-2 block text-white/60">
                      Jenis proyek
                    </span>

                    <select
                      value={
                        previewType
                      }
                      onChange={(event) =>
                        setPreviewType(
                          event.target.value
                        )
                      }
                      className="w-full border border-white/15 bg-[#302e29] px-3 py-3 text-sm text-white outline-none"
                    >
                      <option value="Rumah Baru">
                        Rumah Baru
                      </option>

                      <option value="Renovasi">
                        Renovasi
                      </option>

                      <option value="Villa">
                        Villa
                      </option>

                      <option value="Commercial">
                        Commercial
                      </option>
                    </select>
                  </label>

                  <label className="text-xs">
                    <span className="mb-2 block text-white/60">
                      Luas bangunan
                    </span>

                    <div className="flex items-center border border-white/15">

                      <input
                        type="number"
                        min={
                          estimator.minimumArea
                        }
                        value={
                          previewArea
                        }
                        onChange={(event) =>
                          setPreviewArea(
                            Number(
                              event.target.value
                            )
                          )
                        }
                        className="w-full bg-transparent px-3 py-3 text-xl text-white outline-none"
                      />

                      <span className="px-3 text-white/50">
                        m²
                      </span>

                    </div>
                  </label>

                  <div>
                    <span className="mb-2 block text-xs text-white/60">
                      Paket desain
                    </span>

                    <div className="grid grid-cols-3 gap-2">

                      {[
                        "Essential",
                        "Signature",
                        "Premium",
                      ].map(
                        (level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setPreviewLevel(
                                level as
                                  | "Essential"
                                  | "Signature"
                                  | "Premium"
                              )
                            }
                            className={`border px-3 py-3 text-xs ${
                              previewLevel ===
                              level
                                ? "border-[#c6a77a] bg-[#c6a77a]/15 text-[#e8d7bb]"
                                : "border-white/15 text-white/70"
                            }`}
                          >
                            {level}
                          </button>
                        )
                      )}

                    </div>
                  </div>

                  <div className="mt-3 border-t border-white/10 pt-5">

                    <div className="grid grid-cols-3 gap-3 text-xs">

                      <div>
                        <div className="text-white/40">
                          Rate
                        </div>

                        <div className="mt-1 font-medium">
                          {formatRupiah(
                            previewEstimate.rate
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-white/40">
                          Multiplier
                        </div>

                        <div className="mt-1 font-medium">
                          {previewEstimate.multiplier.toFixed(
                            2
                          )}
                          ×
                        </div>
                      </div>

                      <div>
                        <div className="text-white/40">
                          Luas
                        </div>

                        <div className="mt-1 font-medium">
                          {formatNumber(
                            previewEstimate.area
                          )}{" "}
                          m²
                        </div>
                      </div>

                    </div>

                    <div className="mt-6">

                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Estimasi awal
                      </div>

                      <div className="mt-2 font-display text-3xl text-[#f0dcb9]">
                        {formatRupiah(
                          previewEstimate.min
                        )}
                      </div>

                      <div className="my-1 text-xs text-white/40">
                        sampai
                      </div>

                      <div className="font-display text-3xl text-[#f0dcb9]">
                        {formatRupiah(
                          previewEstimate.max
                        )}
                      </div>

                    </div>

                    <div className="mt-5 border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-white/60">
                      Rumus:
                      <br />

                      <strong className="text-white/80">
                        luas × rate × multiplier
                      </strong>

                      <br />

                      kemudian hasil dikalikan
                      dengan batas minimum
                      dan maksimum.
                    </div>

                  </div>

                </div>
              </div>
            </div>

            <div className="mt-6 border border-[#d5d0c7] bg-white p-5">

              <div className="flex items-start gap-3">

                <Calculator
                  size={18}
                  className="mt-0.5 text-[#4d6b52]"
                />

                <div>

                  <h3 className="font-semibold">
                    Struktur Rumus Saat Ini
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#68645e]">
                    Estimator menggunakan rumus
                    dinamis sehingga admin tidak
                    perlu mengubah kode ketika
                    harga jasa atau faktor proyek
                    berubah.
                  </p>

                  <div className="mt-4 overflow-x-auto border border-[#e4dfd7] bg-[#faf9f6] p-4 font-mono text-xs leading-6">

                    Base =
                    Luas × Rate Paket ×
                    Multiplier Proyek

                    <br />

                    Minimum =
                    Base ×{" "}
                    {estimator.minimumMargin}

                    <br />

                    Maximum =
                    Base ×{" "}
                    {estimator.maximumMargin}

                  </div>

                </div>
              </div>
            </div>

          </section>
        )}

        {/* ==================================================
            TEAM
        ================================================== */}

        {tab === "team" && (
          <section>

            <div className="mb-6">

              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#4d6b52]">
                ACCESS
              </p>

              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Team
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68645e]">
                Kelola role dan status
                anggota dashboard.
              </p>

            </div>

            <div className="overflow-hidden border border-[#d5d0c7] bg-white">

              {profiles.length ===
              0 ? (
                <div className="p-10 text-center text-sm text-[#777]">
                  Belum ada anggota
                  team.
                </div>
              ) : (
                <div className="divide-y divide-[#e4dfd7]">

                  {profiles.map(
                    (profile) => (
                      <div
                        key={
                          profile.id
                        }
                        className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                      >

                        <div>

                          <div className="font-semibold">
                            {
                              profile.email
                            }
                          </div>

                          <div className="mt-1 text-xs text-[#888]">
                            Dibuat{" "}
                            {formatDate(
                              profile.created_at
                            )}
                          </div>

                          {profile.id ===
                            profiles[0]
                              ?.id && (
                            <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#4d6b52]">
                              <ShieldCheck
                                size={
                                  12
                                }
                              />
                              Account
                              access
                            </div>
                          )}

                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          <select
                            value={
                              profile.role
                            }
                            onChange={(
                              event
                            ) =>
                              updateProfile(
                                profile,
                                {
                                  role:
                                    event
                                      .target
                                      .value as
                                      | "admin"
                                      | "editor",
                                }
                              )
                            }
                            disabled={
                              saving
                            }
                            className="border border-[#cfc9bf] bg-white px-3 py-2 text-sm"
                          >
                            <option value="admin">
                              Admin
                            </option>

                            <option value="editor">
                              Editor
                            </option>
                          </select>

                          <label className="flex items-center gap-2 text-sm">

                            <input
                              type="checkbox"
                              checked={
                                profile.active
                              }
                              disabled={
                                saving
                              }
                              onChange={(
                                event
                              ) =>
                                updateProfile(
                                  profile,
                                  {
                                    active:
                                      event
                                        .target
                                        .checked,
                                  }
                                )
                              }
                            />

                            Active

                          </label>

                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </section>
        )}

        {/* ==================================================
            AUDIT
        ================================================== */}

        {tab === "audit" && (
          <section>

            <div className="mb-6">

              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#4d6b52]">
                SECURITY
              </p>

              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Audit Log
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68645e]">
                Riwayat aktivitas penting
                yang dilakukan melalui
                dashboard.
              </p>

            </div>

            <div className="overflow-hidden border border-[#d5d0c7] bg-white">

              {logs.length === 0 ? (
                <div className="p-10 text-center text-sm text-[#777]">
                  Belum ada audit log.
                </div>
              ) : (
                <>

                  <div className="divide-y divide-[#e4dfd7]">

                    {logs.map(
                      (log) => (
                        <div
                          key={
                            log.id
                          }
                          className="p-4"
                        >

                          <div className="flex flex-col justify-between gap-3 md:flex-row">

                            <div>

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="font-semibold">
                                  {
                                    log.action
                                  }
                                </span>

                                <span className="border border-[#d5d0c7] px-2 py-1 text-[10px] uppercase tracking-wider text-[#777]">
                                  {
                                    log.entity_type
                                  }
                                </span>

                              </div>

                              <div className="mt-2 text-xs text-[#777]">
                                Actor:{" "}
                                {log.actor_id ||
                                  "system"}
                              </div>

                              {log.entity_id && (
                                <div className="mt-1 break-all text-xs text-[#999]">
                                  Entity:{" "}
                                  {
                                    log.entity_id
                                  }
                                </div>
                              )}

                            </div>

                            <div className="text-xs text-[#888]">
                              {formatDate(
                                log.created_at
                              )}
                            </div>

                          </div>

                          {log.details && (
                            <pre className="mt-3 overflow-auto bg-[#f7f5f0] p-3 text-[11px] leading-5 text-[#555]">
                              {JSON.stringify(
                                log.details,
                                null,
                                2
                              )}
                            </pre>
                          )}

                        </div>
                      )
                    )}

                  </div>

                  <Pager
                    page={
                      auditPage
                    }
                    totalPages={
                      auditPages
                    }
                    onChange={
                      setAuditPage
                    }
                  />

                </>
              )}

            </div>
          </section>
        )}
      </div>

      {/* ====================================================
          LEAD MODAL
      ==================================================== */}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto bg-[#f7f5f0] shadow-2xl">

            <div className="sticky top-0 flex items-center justify-between border-b border-[#d5d0c7] bg-[#f7f5f0] px-5 py-4">

              <div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4d6b52]">
                  Lead detail
                </div>

                <h3 className="mt-1 text-xl font-semibold">
                  {selected.name}
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="border border-[#d5d0c7] p-2"
              >
                <X size={16} />
              </button>

            </div>

            <div className="space-y-4 p-5">

              <div className="grid gap-4 md:grid-cols-2">

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Nama
                  </span>

                  <input
                    value={
                      selected.name
                    }
                    onChange={(
                      event
                    ) =>
                      setSelected({
                        ...selected,
                        name: event
                          .target
                          .value,
                      })
                    }
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    WhatsApp
                  </span>

                  <input
                    value={
                      selected.phone
                    }
                    onChange={(
                      event
                    ) =>
                      setSelected({
                        ...selected,
                        phone: event
                          .target
                          .value,
                      })
                    }
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Email
                  </span>

                  <input
                    value={
                      selected.email ||
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      setSelected({
                        ...selected,
                        email:
                          event
                            .target
                            .value ||
                          null,
                      })
                    }
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Status
                  </span>

                  <select
                    value={
                      selected.status
                    }
                    onChange={(
                      event
                    ) =>
                      setSelected({
                        ...selected,
                        status:
                          event
                            .target
                            .value,
                      })
                    }
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  >
                    {statuses.map(
                      (item) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {item.replace(
                            "_",
                            " "
                          )}
                        </option>
                      )
                    )}
                  </select>
                </label>

              </div>

              <label className="block text-xs">

                <span className="mb-1 block text-[#777]">
                  Project type
                </span>

                <input
                  value={
                    selected.project_type ||
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setSelected({
                      ...selected,
                      project_type:
                        event
                          .target
                          .value ||
                        null,
                    })
                  }
                  className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                />

              </label>

              <label className="block text-xs">

                <span className="mb-1 block text-[#777]">
                  Budget
                </span>

                <input
                  value={
                    selected.budget ||
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setSelected({
                      ...selected,
                      budget:
                        event
                          .target
                          .value ||
                        null,
                    })
                  }
                  className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                />

              </label>

              <label className="block text-xs">

                <span className="mb-1 block text-[#777]">
                  Message
                </span>

                <textarea
                  value={
                    selected.message ||
                    ""
                  }
                  readOnly
                  rows={4}
                  className="w-full resize-none border border-[#cfc9bf] bg-[#f0eee9] px-3 py-2 text-sm"
                />

              </label>

              <label className="block text-xs">

                <span className="mb-1 block text-[#777]">
                  Catatan internal
                </span>

                <textarea
                  value={
                    selected.notes ||
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setSelected({
                      ...selected,
                      notes:
                        event
                          .target
                          .value ||
                        null,
                    })
                  }
                  rows={5}
                  className="w-full resize-y border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                />

              </label>

              <div className="flex flex-col gap-2 border-t border-[#d5d0c7] pt-4 sm:flex-row">

                <a
                  href={whatsappUrl(
                    selected.phone
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 border border-[#cfc9bf] bg-white px-4 py-3 text-xs font-medium"
                >
                  <MessageCircle
                    size={15}
                  />
                  WhatsApp
                </a>

                <button
                  onClick={
                    saveLead
                  }
                  disabled={
                    saving
                  }
                  className="flex flex-1 items-center justify-center gap-2 bg-[#181817] px-4 py-3 text-xs font-medium text-white disabled:opacity-50"
                >
                  <Save size={15} />

                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </button>

                <button
                  onClick={() =>
                    setConfirm({
                      kind: "lead",
                      id: selected.id,
                    })
                  }
                  className="flex items-center justify-center border border-[#d9c4ba] px-4 py-3 text-xs text-[#8d4932]"
                >
                  <Trash2
                    size={15}
                  />
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          PORTFOLIO MODAL
      ==================================================== */}

      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto bg-[#f7f5f0] shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d5d0c7] bg-[#f7f5f0] px-5 py-4">

              <div>

                <div className="text-[10px] uppercase tracking-[0.2em] text-[#4d6b52]">
                  Portfolio CMS
                </div>

                <h3 className="mt-1 text-xl font-semibold">
                  {project.id ===
                  "new"
                    ? "Tambah project"
                    : "Edit project"}
                </h3>

              </div>

              <button
                onClick={() =>
                  setProject(null)
                }
                className="border border-[#d5d0c7] p-2"
              >
                <X size={16} />
              </button>

            </div>

            <div className="space-y-4 p-5">

              <div className="grid gap-4 md:grid-cols-2">

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Judul
                  </span>

                  <input
                    value={
                      project.title
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        title:
                          event
                            .target
                            .value,
                      })
                    }
                    placeholder="Tropical Courtyard House"
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Slug
                  </span>

                  <input
                    value={
                      project.slug
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        slug:
                          event
                            .target
                            .value,
                      })
                    }
                    placeholder="tropical-courtyard-house"
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Lokasi
                  </span>

                  <input
                    value={
                      project.location ||
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        location:
                          event
                            .target
                            .value ||
                          null,
                      })
                    }
                    placeholder="Kediri, Jawa Timur"
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

                <label className="text-xs">
                  <span className="mb-1 block text-[#777]">
                    Kategori
                  </span>

                  <input
                    value={
                      project.category ||
                      ""
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        category:
                          event
                            .target
                            .value ||
                          null,
                      })
                    }
                    placeholder="Residential"
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />
                </label>

              </div>

              <label className="block text-xs">

                <span className="mb-1 block text-[#777]">
                  Image URL
                </span>

                <input
                  value={
                    project.image_url
                  }
                  onChange={(
                    event
                  ) =>
                    setProject({
                      ...project,
                      image_url:
                        event
                          .target
                          .value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                />

              </label>

              <div className="border border-dashed border-[#cfc9bf] bg-white p-4">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="text-sm font-semibold">
                      Upload gambar
                    </div>

                    <div className="mt-1 text-xs text-[#888]">
                      Upload ke Supabase
                      Storage bucket
                      <strong>
                        {" "}
                        portfolio
                      </strong>
                    </div>

                  </div>

                  <label className="cursor-pointer bg-[#181817] px-4 py-2 text-xs text-white">

                    Pilih gambar

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={
                        saving
                      }
                      onChange={(
                        event
                      ) => {

                        const file =
                          event
                            .target
                            .files?.[0];

                        if (file) {
                          uploadPortfolioImage(
                            file
                          );
                        }

                        event.target.value =
                          "";

                      }}
                    />

                  </label>

                </div>

                {project.image_url && (
                  <div className="mt-4 overflow-hidden border border-[#ddd7ce]">

                    <img
                      src={
                        project.image_url
                      }
                      alt={
                        project.title ||
                        "Portfolio"
                      }
                      className="max-h-[300px] w-full object-cover"
                    />

                  </div>
                )}

              </div>

              <label className="block text-xs">

                <span className="mb-1 block text-[#777]">
                  Deskripsi
                </span>

                <textarea
                  value={
                    project.description ||
                    ""
                  }
                  onChange={(
                    event
                  ) =>
                    setProject({
                      ...project,
                      description:
                        event
                          .target
                          .value ||
                        null,
                    })
                  }
                  rows={6}
                  placeholder="Deskripsi project..."
                  className="w-full resize-y border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                />

              </label>

              <div className="grid gap-4 md:grid-cols-3">

                <label className="text-xs">

                  <span className="mb-1 block text-[#777]">
                    Urutan
                  </span>

                  <input
                    type="number"
                    value={
                      project.sort_order
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        sort_order:
                          Number(
                            event
                              .target
                              .value
                          ) || 0,
                      })
                    }
                    className="w-full border border-[#cfc9bf] bg-white px-3 py-2 text-sm outline-none"
                  />

                </label>

                <label className="flex items-center gap-2 self-end border border-[#d5d0c7] bg-white px-3 py-3 text-xs">

                  <input
                    type="checkbox"
                    checked={
                      project.featured
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        featured:
                          event
                            .target
                            .checked,
                      })
                    }
                  />

                  Featured

                </label>

                <label className="flex items-center gap-2 self-end border border-[#d5d0c7] bg-white px-3 py-3 text-xs">

                  <input
                    type="checkbox"
                    checked={
                      project.published
                    }
                    onChange={(
                      event
                    ) =>
                      setProject({
                        ...project,
                        published:
                          event
                            .target
                            .checked,
                      })
                    }
                  />

                  Published

                </label>

              </div>

              <div className="flex flex-col gap-2 border-t border-[#d5d0c7] pt-4 sm:flex-row sm:justify-end">

                <button
                  onClick={() =>
                    setProject(null)
                  }
                  className="border border-[#cfc9bf] bg-white px-5 py-3 text-xs"
                >
                  Batal
                </button>

                <button
                  onClick={
                    saveProject
                  }
                  disabled={
                    saving
                  }
                  className="flex items-center justify-center gap-2 bg-[#181817] px-5 py-3 text-xs text-white disabled:opacity-50"
                >
                  <Save size={14} />

                  {saving
                    ? "Saving..."
                    : "Save project"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          DELETE CONFIRM
      ==================================================== */}

      {confirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md bg-[#f7f5f0] p-6 shadow-2xl">

            <div className="text-[10px] uppercase tracking-[0.2em] text-[#8d4932]">
              Confirmation
            </div>

            <h3 className="mt-2 text-xl font-semibold">
              Hapus data?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#66615b]">
              Data yang dihapus tidak
              dapat dikembalikan. Pastikan
              Anda benar-benar ingin
              melanjutkan.
            </p>

            <div className="mt-6 flex gap-2">

              <button
                onClick={() =>
                  setConfirm(null)
                }
                className="flex-1 border border-[#cfc9bf] bg-white px-4 py-3 text-xs"
              >
                Batal
              </button>

              <button
                onClick={
                  executeDelete
                }
                className="flex-1 bg-[#8d4932] px-4 py-3 text-xs text-white"
              >
                Ya, hapus
              </button>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}