import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse } from "@/lib/logger";

export async function GET() {
  logRequest("/api/pages", "GET");
  const pages = await prisma.page.findMany();
  logResponse("/api/pages", "GET", 200, { count: pages.length });
  return NextResponse.json(pages);
}
