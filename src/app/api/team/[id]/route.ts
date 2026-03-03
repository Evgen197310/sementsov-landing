import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/team/${id}`, "PUT", { name: data.name, slug: data.slug });
    const member = await prisma.teamMember.update({
      where: { id: Number(id) },
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
    logResponse(`/api/team/${id}`, "PUT", 200);
    return NextResponse.json(member);
  } catch (e) {
    logError("/api/team/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/team/${id}`, "DELETE");
    await prisma.teamMember.delete({ where: { id: Number(id) } });
    revalidatePath("/team");
    revalidatePath("/");
    logResponse(`/api/team/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/team/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
