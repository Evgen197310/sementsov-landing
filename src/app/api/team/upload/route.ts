import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { processTeamPhoto } from "@/lib/images";
import { updateTeamMember } from "@/lib/db";

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const memberId = formData.get("memberId") as string | null;

    if (!file || !memberId) {
      return NextResponse.json({ error: "file and memberId required" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл слишком большой (макс. 10MB)" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Допустимые форматы: JPG, PNG, WebP" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const photoPath = await processTeamPhoto(buffer, memberId);

    updateTeamMember(memberId, { photo: photoPath });

    return NextResponse.json({ photo: photoPath });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
