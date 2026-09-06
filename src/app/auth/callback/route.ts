import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  /*
   * Only allow internal paths for the post-auth redirect.
   * This prevents the callback from becoming an open redirect.
   */
  const nextPath =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=confirmation_failed", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "Auth callback error:",
      error.message
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=confirmation_failed",
        requestUrl.origin
      )
    );
  }

  return NextResponse.redirect(
    new URL(nextPath, requestUrl.origin)
  );
}