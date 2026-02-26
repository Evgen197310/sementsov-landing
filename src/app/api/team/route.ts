import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllTeam, getTeamMember, insertTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { removeTeamPhotos } from "@/lib/images";

export async function GET() {
  const team = getAllTeam();
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const id = data.id || uuidv4();
    insertTeamMember({
      id,
      name: data.name || "",
      role: data.role || "",
      photo: data.photo || null,
      short_bio: data.short_bio || null,
      full_bio: data.full_bio || null,
      link: data.link || null,
    });
    const member = getTeamMember(id);
    return NextResponse.json(member, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    updateTeamMember(data.id, data);
    const member = getTeamMember(data.id);
    return NextResponse.json(member);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    removeTeamPhotos(id);
    deleteTeamMember(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
