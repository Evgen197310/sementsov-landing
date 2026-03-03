import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "/app/data/uploads/team";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Sanitize filename — only allow alphanumeric, hyphens, dots
    if (!/^[a-zA-Z0-9_-]+\.webp$/.test(filename)) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, filename);
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
