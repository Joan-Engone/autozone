import { readFile } from "node:fs/promises";
import path from "node:path";
import { MIME, UPLOAD_DIR } from "@/lib/uploads";

export const runtime = "nodejs";

// Serves the photos sellers upload
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  // Only the names we generate ourselves are allowed (no folders, no tricks)
  const match = /^[a-f0-9-]{36}\.(jpg|png|webp)$/.exec(name);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(path.join(UPLOAD_DIR, name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}