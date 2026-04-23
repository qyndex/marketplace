import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const protectedPaths = ["/messages", "/dashboard"];

  if (protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/messages/:path*", "/dashboard/:path*"],
};
