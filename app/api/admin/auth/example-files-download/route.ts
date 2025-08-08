import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketName, s3Client } from "@/types/types-s3-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const archivos = [
    "csv-archivo-valido-ejemplo.csv",
    "xlsx-archivo-valido-ejemplo.xlsx",
  ];
  try {
    const urls = await Promise.all(
      archivos.map(async (archivo) => {
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: `downloadable-files/example-users-register-structure/${archivo}`,
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        return { nombre: archivo, url: signedUrl };
      })
    );

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error al generar URLs firmadas:", error);
    return NextResponse.json({ error: "Error al generar URLs firmadas" });
  }
}
