import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.practiceCategory.findMany({ include: { cases: { orderBy: { createdAt: "desc" } } }, orderBy: { id: "asc" } });
  const uncategorized = await prisma.practiceCase.findMany({ where: { categoryId: null }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ categories, uncategorized });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (data._type === "category") {
      const cat = await prisma.practiceCategory.create({ data: { name: data.name, slug: data.slug, description: data.description || "" } });
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
        categoryId: data.categoryId || null,
      },
    });
    return NextResponse.json(c);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
