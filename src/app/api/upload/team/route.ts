import { NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = "/app/data/uploads/team";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Файл слишком большой (макс. 5 МБ)" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Допустимы только изображения" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resized = await sharp(buffer)
      .resize(500, 600, { fit: "cover", position: "top" })
      .webp({ quality: 85 })
      .toBuffer();

    const filename = `${randomUUID()}.webp`;

    // In dev, save to public/team; in prod, save to data volume
    const dir = process.env.NODE_ENV === "production" ? UPLOAD_DIR : path.join(process.cwd(), "public/team");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), resized);

    const url = process.env.NODE_ENV === "production"
      ? `/api/uploads/team/${filename}`
      : `/team/${filename}`;

    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
