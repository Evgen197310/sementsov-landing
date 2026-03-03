import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_POST_ROUTES = ["/api/auth", "/api/contact"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Allow all GET/HEAD/OPTIONS requests
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return NextResponse.next();
  }

  // Allow public POST routes
  if (PUBLIC_POST_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // All other mutations require admin_token cookie
  const token = request.cookies.get("admin_token");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
