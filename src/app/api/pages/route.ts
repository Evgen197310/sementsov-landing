import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const pages = await prisma.page.findMany();
  return NextResponse.json(pages);
}
