import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { logRequest, logResponse, logError } from "@/lib/logger";

const UPLOAD_DIR = "/app/data/uploads/files";
const DEV_DIR = "public/uploads/files";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 5;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/avi",
  "video/x-msvideo",
  "video/mp4",
  "video/quicktime",
]);

function extFromMime(mime: string, originalName: string): string {
  const orig = path.extname(originalName).toLowerCase();
  if (orig) return orig;
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "video/avi": ".avi",
    "video/x-msvideo": ".avi",
    "video/mp4": ".mp4",
    "video/quicktime": ".mov",
  };
  return map[mime] || ".bin";
}

export async function POST(request: Request) {
  try {
    logRequest("/api/upload/files", "POST");
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Файлы не выбраны" }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Максимум ${MAX_FILES} файлов` }, { status: 400 });
    }

    const dir = process.env.NODE_ENV === "production"
      ? UPLOAD_DIR
      : path.join(process.cwd(), DEV_DIR);
    await mkdir(dir, { recursive: true });

    const results: { url: string; originalName: string; size: number }[] = [];

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: `Файл "${file.name}" слишком большой (макс. 50 МБ)` }, { status: 400 });
      }
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json({
          error: `Недопустимый формат файла "${file.name}". Допустимы: png, jpeg, pdf, doc, docx, avi, mp4, mov`,
        }, { status: 400 });
      }

      const ext = extFromMime(file.type, file.name);
      const filename = `${randomUUID()}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(dir, filename), buffer);

      const url = process.env.NODE_ENV === "production"
        ? `/api/uploads/files/${filename}`
        : `/uploads/files/${filename}`;

      results.push({ url, originalName: file.name, size: file.size });
    }

    logResponse("/api/upload/files", "POST", 200, { count: results.length });
    return NextResponse.json(results);
  } catch (e) {
    logError("/api/upload/files", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
