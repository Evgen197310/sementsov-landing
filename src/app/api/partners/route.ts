import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/partners", "GET");
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  logResponse("/api/partners", "GET", 200, { count: partners.length });
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/partners", "POST", { name: data.name });
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        description: data.description || "",
        website: sanitizeUrl(data.website),
        email: data.email || "",
        attachments: data.attachments || "",
        order: data.order ?? 0,
      },
    });
    logResponse("/api/partners", "POST", 200, { id: partner.id });
    return NextResponse.json(partner);
  } catch (e) {
    logError("/api/partners", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
