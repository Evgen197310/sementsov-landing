import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/media", "GET");
  const categories = await prisma.mediaCategory.findMany({ include: { articles: { orderBy: { createdAt: "desc" } } }, orderBy: { id: "asc" } });
  const uncategorized = await prisma.mediaArticle.findMany({ where: { categoryId: null }, orderBy: { createdAt: "desc" } });
  logResponse("/api/media", "GET", 200, { categories: categories.length, uncategorized: uncategorized.length });
  return NextResponse.json({ categories, uncategorized });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/media", "POST", { _type: data._type, title: data.title || data.name });
    if (data._type === "category") {
      const cat = await prisma.mediaCategory.create({ data: { name: data.name, slug: data.slug, description: data.description || "" } });
      return NextResponse.json(cat);
    }
    const article = await prisma.mediaArticle.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        source: sanitizeUrl(data.source),
        tags: data.tags || "",
        categoryId: data.categoryId || null,
      },
    });
    logResponse("/api/media", "POST", 200, { id: article.id });
    return NextResponse.json(article);
  } catch (e) {
    logError("/api/media", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
