import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (request.nextUrl.pathname.startsWith("/app")) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);
  const path = request.nextUrl.pathname;

  if (!isSignedIn && path.startsWith("/app")) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    return copyAuthResponse(supabaseResponse, NextResponse.redirect(login));
  }

  if (isSignedIn && path === "/login") {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = "/app";
    return copyAuthResponse(supabaseResponse, NextResponse.redirect(appUrl));
  }

  return supabaseResponse;
}

function copyAuthResponse(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }
  return target;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|r/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
