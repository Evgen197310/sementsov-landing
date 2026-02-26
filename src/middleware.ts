import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page and login API
  if (pathname === "/admin/login" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  // Skip public API GETs for content (used by the public site)
  if (request.method === "GET" && pathname.startsWith("/api/uploads/")) {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // Basic JWT structure check (full verification happens in API routes)
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Protect /api/* routes (except auth/login and public GETs)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/login")) {
    // Allow public GET for content APIs
    if (request.method === "GET") {
      const publicGetPaths = ["/api/team", "/api/services", "/api/cases", "/api/about", "/api/contacts", "/api/hero", "/api/advantages"];
      if (publicGetPaths.some(p => pathname === p || pathname.startsWith(p + "/"))) {
        return NextResponse.next();
      }
    }

    const token = request.cookies.get("admin_token")?.value;
    const authHeader = request.headers.get("authorization") || "";
    if (!token && !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
