import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin";
import { createAdminSupabase } from "@/lib/supabase-admin";
import { jsonError } from "@/lib/security";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  const { authorized, user } = await requireStaff();
  if (!authorized || !user) return jsonError("Unauthorized", 401);

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("File foto wajib dipilih.", 400);
    if (!allowed.has(file.type)) return jsonError("Format foto harus JPG, PNG, WebP, atau AVIF.", 400);
    if (file.size > 5 * 1024 * 1024) return jsonError("Ukuran foto maksimal 5 MB.", 400);

    const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const admin = createAdminSupabase();
    const { error } = await admin.storage.from("team").upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });

    if (error) {
      console.error("[TEAM PHOTO UPLOAD]", error);
      return jsonError("Gagal mengunggah foto.", 400);
    }

    const { data } = admin.storage.from("team").getPublicUrl(path);
    return NextResponse.json({ photo_url: data.publicUrl });
  } catch (error) {
    console.error("[TEAM PHOTO UPLOAD FATAL]", error);
    return jsonError("Upload foto tidak valid.", 400);
  }
}
