import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/practice", "GET");
  const categories = await prisma.practiceCategory.findMany({ include: { cases: { orderBy: { createdAt: "desc" } } }, orderBy: { id: "asc" } });
  const uncategorized = await prisma.practiceCase.findMany({ where: { categoryId: null }, orderBy: { createdAt: "desc" } });
  logResponse("/api/practice", "GET", 200, { categories: categories.length, uncategorized: uncategorized.length });
  return NextResponse.json({ categories, uncategorized });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/practice", "POST", { _type: data._type, title: data.title || data.name });
    if (data._type === "category") {
      const cat = await prisma.practiceCategory.create({ data: { name: data.name, slug: data.slug, description: data.description || "", attachments: data.attachments || "" } });
      return NextResponse.json(cat);
    }
    const c = await prisma.practiceCase.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        situation: data.situation || "",
        actions: data.actions || "",
        result: data.result || "",
        tags: data.tags || "",
        attachments: data.attachments || "",
        categoryId: data.categoryId || null,
      },
    });
    logResponse("/api/practice", "POST", 200, { id: c.id });
    return NextResponse.json(c);
  } catch (e) {
    logError("/api/practice", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
