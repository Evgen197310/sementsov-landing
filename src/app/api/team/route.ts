import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET() {
  logRequest("/api/team", "GET");
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  logResponse("/api/team", "GET", 200, { count: team.length });
  return NextResponse.json(team, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/team", "POST", { name: data.name, slug: data.slug });
    if (!data.slug) {
      return NextResponse.json({ error: "Slug не может быть пустым" }, { status: 400 });
    }
    const existing = await prisma.teamMember.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${data.slug}" уже занят` }, { status: 409 });
    }
    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        slug: data.slug,
        position: data.position || "",
        specialization: data.specialization || "",
        bio: data.bio || "",
        education: data.education || "",
        experience: data.experience || "",
        photo: data.photo || "",
        website: sanitizeUrl(data.website),
        order: data.order ?? 0,
      },
    });
    revalidatePath("/team");
    revalidatePath("/");
    logResponse("/api/team", "POST", 200, { id: member.id });
    return NextResponse.json(member);
  } catch (e) {
    logError("/api/team", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
