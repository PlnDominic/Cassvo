import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./client";

const PUBLIC_PATHS = ["/"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Refreshes the Supabase auth cookie on every request (required by
 * @supabase/ssr) and gates every non-auth page behind a signed-in,
 * *active-admin* session.
 *
 * Having a Supabase Auth session is not enough on its own — anyone who
 * signed up on the Cassvo customer app has one. Dashboard access is only
 * granted to a session whose user also has a matching, active row in
 * `admin_users`, which is exactly what `is_admin()` checks (and what its
 * RLS policies key off) — see supabase/proposed/001_admin_users.sql.
 * A session that fails this check gets signed out here rather than just
 * redirected, so it can't keep retrying protected pages with the same
 * cookie.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("admin_users")
      .select("id")
      .eq("auth_user_id", user.id)
      .eq("active", true)
      .maybeSingle();
    isAdmin = Boolean(data);
  }

  if (user && !isAdmin) {
    // A real Cassvo account, but not a dashboard admin (or no longer an
    // active one) — don't leave the session sitting around to retry with.
    await supabase.auth.signOut();
    if (!isPublicPath(pathname)) {
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("error", "not-admin");
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  if (!isAdmin && !isPublicPath(pathname)) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdmin && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
