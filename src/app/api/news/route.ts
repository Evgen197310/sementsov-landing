import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  const where = section ? { section } : {};
  const articles = await prisma.newsArticle.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
    return NextResponse.json(article);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
