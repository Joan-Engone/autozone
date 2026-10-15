import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/** Where the photos are stored on the server. Set UPLOAD_DIR in .env to use another folder (or a mounted disk). */
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

export const MAX_IMAGES = 6;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB per photo

export const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Reads the first bytes to find the real image type (a file's declared type can be faked). */
function detectExtension(b: Buffer): "jpg" | "png" | "webp" | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

/** Saves one photo and returns its public address, or null if the file is not a valid image. */
export async function saveImage(file: File): Promise<string | null> {
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = detectExtension(buffer);
  if (!extension) return null;

  const name = `${randomUUID()}.${extension}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), buffer);
  return `/api/uploads/${name}`;
}