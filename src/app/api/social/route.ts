import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/social", "GET");
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  logResponse("/api/social", "GET", 200, { count: links.length });
  return NextResponse.json(links);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/social", "POST", { platform: data.platform });
    const link = await prisma.socialLink.create({
      data: {
        platform: data.platform,
        url: data.url,
        icon: data.icon || "",
        order: data.order ?? 0,
      },
    });
    logResponse("/api/social", "POST", 200, { id: link.id });
    return NextResponse.json(link);
  } catch (e) {
    logError("/api/social", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
