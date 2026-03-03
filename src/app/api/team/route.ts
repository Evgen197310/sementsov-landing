import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { revalidatePath } from "next/cache";

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
        website: sanitizeUrl(data.website),
        order: data.order ?? 0,
      },
    });
    revalidatePath("/team");
    revalidatePath("/");
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
