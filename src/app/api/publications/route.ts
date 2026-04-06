import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/publications", "GET");
  const pubs = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });
  logResponse("/api/publications", "GET", 200, { count: pubs.length });
  return NextResponse.json(pubs);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/publications", "POST", { title: data.title });
    const pub = await prisma.publication.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        section: data.section || "kuklin",
        attachments: data.attachments || "",
      },
    });
    logResponse("/api/publications", "POST", 200, { id: pub.id });
    return NextResponse.json(pub);
  } catch (e) {
    logError("/api/publications", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
