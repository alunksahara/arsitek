import{NextResponse}from"next/server";import{createServerSupabase}from"@/lib/supabase-server";import{requireAdmin}from"@/lib/admin";import{jsonError}from"@/lib/security";
export async function GET() {
  try {
    const { authorized, supabase } = await requireAdmin();

    // Admin boleh melihat seluruh portfolio,
    // termasuk yang belum published.
    if (authorized) {
      const {
        data,
        error,
      } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[PORTFOLIO GET ADMIN]", error);
        return jsonError(
          "Gagal mengambil portfolio.",
          500
        );
      }

      return NextResponse.json({
        projects: data || [],
      });
    }

    // Public hanya boleh melihat portfolio yang published.
    const publicSupabase = await createServerSupabase();

    const {
      data,
      error,
    } = await publicSupabase
      .from("portfolio_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[PORTFOLIO GET PUBLIC]", error);
      return jsonError(
        "Gagal mengambil portfolio.",
        500
      );
    }

    return NextResponse.json({
      projects: data || [],
    });
  } catch (error) {
    console.error("[PORTFOLIO GET FATAL]", error);
    return jsonError(
      "Terjadi kesalahan server.",
      500
    );
  }
}
export async function POST(r:Request){const{authorized,supabase,user}=await requireAdmin();if(!authorized)return jsonError("Unauthorized",401);try{const b=await r.json();if(!b.title||!b.slug||!b.image_url)return jsonError("Title, slug, dan image wajib diisi.");const{data,error}=await supabase.from("portfolio_projects").insert({title:b.title,slug:b.slug,location:b.location||null,category:b.category||null,image_url:b.image_url,description:b.description||null,featured:!!b.featured,published:b.published!==false,sort_order:Number(b.sort_order)||0}).select().single();if(error)return jsonError(error.message,400);await supabase.from("audit_logs").insert({actor_id:user!.id,action:"portfolio.create",entity_type:"portfolio",entity_id:data.id,details:{title:data.title}});return NextResponse.json({project:data})}catch{return jsonError("Invalid request.")}}
