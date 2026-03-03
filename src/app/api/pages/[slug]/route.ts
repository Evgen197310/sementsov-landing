import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await request.json();
    logRequest(`/api/pages/${slug}`, "PUT", { title: data.title });
    const page = await prisma.page.update({ where: { slug }, data: { title: data.title, content: data.content } });
    logResponse(`/api/pages/${slug}`, "PUT", 200);
    return NextResponse.json(page);
  } catch (e) {
    logError("/api/pages/[slug]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
