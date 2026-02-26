import sharp from "sharp";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "uploads", "team");

// Ensure uploads directory exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

interface ImageVariant {
  suffix: string;
  width: number;
  height: number;
}

const VARIANTS: ImageVariant[] = [
  { suffix: "", width: 900, height: 1198 },
  { suffix: "-thumb", width: 160, height: 160 },
];

export async function processTeamPhoto(
  buffer: Buffer,
  memberId: string
): Promise<string> {
  // Remove old files for this member
  removeTeamPhotos(memberId);

  for (const variant of VARIANTS) {
    const filename = `${memberId}${variant.suffix}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    await sharp(buffer)
      .resize(variant.width, variant.height, {
        fit: "cover",
        position: "top",
      })
      .webp({ quality: 82 })
      .toFile(outputPath);
  }

  // Return the main photo path (relative, for DB storage)
  return `/api/uploads/team/${memberId}.webp`;
}

export function removeTeamPhotos(memberId: string): void {
  for (const variant of VARIANTS) {
    const filename = `${memberId}${variant.suffix}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export function getUploadPath(relativePath: string): string | null {
  const uploadsRoot = path.join(process.cwd(), "uploads");
  const fullPath = path.join(uploadsRoot, relativePath);

  // Prevent directory traversal
  if (!fullPath.startsWith(uploadsRoot)) return null;
  if (!fs.existsSync(fullPath)) return null;

  return fullPath;
}
