// lib/image-utils.ts
import sharp from "sharp";

export async function optimizeImage(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return sharp(buffer)
    .resize({ width: 512, height: 512, fit: "cover" })
    .jpeg({ quality: 50 }) // Puedes cambiar a .png()
    .toBuffer();
}
