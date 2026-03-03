import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.mediaCategory.findMany({ include: { articles: true } });
  const uncategorized = await prisma.mediaArticle.findMany({ where: { categoryId: null }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ categories, uncategorized });
}
