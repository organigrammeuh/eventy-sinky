import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const MIME_TO_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

async function ensureUploadsDir() {
    if (!existsSync(UPLOADS_DIR)) {
        await mkdir(UPLOADS_DIR, { recursive: true });
    }
}

export async function saveImage(file: File): Promise<string> {
    await ensureUploadsDir();
    const ext = MIME_TO_EXT[file.type] || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOADS_DIR, filename), buffer);
    return `/uploads/${filename}`;
}

export async function deleteImage(url: string | null) {
    if (!url || !url.startsWith("/uploads/")) return;
    const filePath = path.join(process.cwd(), "public", url);
    try {
        await unlink(filePath);
    } catch {
        // file may not exist
    }
}
