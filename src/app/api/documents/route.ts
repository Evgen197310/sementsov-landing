import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/documents", "GET");
  const docs = await prisma.document.findMany();
  logResponse("/api/documents", "GET", 200, { count: docs.length });
  return NextResponse.json(docs);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/documents", "POST", { title: data.title });
    const doc = await prisma.document.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        fileUrl: data.fileUrl || "",
        attachments: data.attachments || "",
      },
    });
    logResponse("/api/documents", "POST", 200, { id: doc.id });
    return NextResponse.json(doc);
  } catch (e) {
    logError("/api/documents", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
