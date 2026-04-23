import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/messages", "/dashboard", "/orders", "/listings/new"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect specific paths
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for Supabase auth token in cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    // If Supabase is not configured, allow access (dev convenience)
    return NextResponse.next();
  }

  // Look for the access token in cookies
  // Supabase stores auth in sb-<ref>-auth-token cookie
  let hasSession = false;
  for (const [name] of request.cookies) {
    if (name.includes("auth-token")) {
      hasSession = true;
      break;
    }
  }

  // Also check the Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    hasSession = true;
  }

  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/messages/:path*", "/dashboard/:path*", "/orders/:path*", "/listings/new"],
};
