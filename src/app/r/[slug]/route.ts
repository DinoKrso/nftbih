import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isHttpUrl } from "@/lib/urls";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/nema-linka", request.url));
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data } = await supabase.rpc("track_click", {
    p_slug: slug,
    p_referrer: request.headers.get("referer"),
    p_user_agent: request.headers.get("user-agent"),
  });

  if (typeof data !== "string" || !isHttpUrl(data)) {
    return NextResponse.redirect(new URL("/nema-linka", request.url));
  }

  const response = NextResponse.redirect(data, 302);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
