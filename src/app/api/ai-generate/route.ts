import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { generateFromPdf, generateFromImage, generateFromDocx } from "@/lib/ai-client";
import { PRACTICE_CASE_PROMPT } from "@/lib/ai-defaults";

const MAX_FILE_SIZE = 120 * 1024 * 1024; // 120MB

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  if (!token) return false;
  const session = await prisma.adminSession.findUnique({ where: { token: token.value } });
  return !!session && session.expiresAt > new Date();
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Файл слишком большой (макс. ${MAX_FILE_SIZE / 1024 / 1024}MB)` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();

    let result;

    if (fileName.endsWith(".pdf")) {
      result = await generateFromPdf(buffer, PRACTICE_CASE_PROMPT);
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const docxResult = await generateFromDocx(buffer, PRACTICE_CASE_PROMPT);
      // If AI didn't generate content, use the extracted HTML
      if (!docxResult.data.content && docxResult.html) {
        docxResult.data.content = docxResult.html;
      }
      result = docxResult;
    } else if (fileName.match(/\.(jpg|jpeg|png|webp)$/)) {
      const mimeMap: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
      };
      const ext = "." + fileName.split(".").pop();
      const mediaType = mimeMap[ext] || "image/jpeg";
      result = await generateFromImage(buffer, mediaType, PRACTICE_CASE_PROMPT);
    } else {
      return NextResponse.json(
        { error: "Поддерживаются только PDF, DOCX, JPG, PNG файлы" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: result.data,
      provider: result.provider,
    });
  } catch (e) {
    console.error("[AI Generate] Error:", e);
    return NextResponse.json(
      { error: (e as Error).message || "Ошибка генерации" },
      { status: 500 },
    );
  }
}
