import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  logRequest("/api/news", "GET", { section });
  const where = section ? { section } : {};
  const articles = await prisma.newsArticle.findMany({ where, orderBy: { createdAt: "desc" } });
  logResponse("/api/news", "GET", 200, { count: articles.length });
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/news", "POST", { title: data.title, slug: data.slug });
    const article = await prisma.newsArticle.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        section: data.section || "news",
        attachments: data.attachments || "",
      },
    });
    logResponse("/api/news", "POST", 200, { id: article.id });
    return NextResponse.json(article);
  } catch (e) {
    logError("/api/news", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
