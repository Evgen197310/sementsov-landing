import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
        website: data.website || "",
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
