import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.practiceCategory.findMany({ include: { cases: true } });
  const uncategorized = await prisma.practiceCase.findMany({ where: { categoryId: null } });
  return NextResponse.json({ categories, uncategorized });
}
