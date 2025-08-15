import prisma from "@/lib/prisma";
import { getPublicS3Url } from "@/lib/s3-service";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    const auth = request.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "No token" }, { status: 401 });

    try {
      const payload = verify(token, JWT_SECRET) as { userId: string };
      if (payload.userId !== params.userId) {
        throw new Error();
      }
    } catch {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    const findUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            badges: true,
          },
        },
      },
    });

    if (!findUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    let publicAvatarDisplayUrl: string | null = null;
    if (findUser.profile?.avatarUrl) {
      // avatarUrl es la fileKey
      publicAvatarDisplayUrl = getPublicS3Url(findUser.profile.avatarUrl);
      if (!publicAvatarDisplayUrl) {
        console.warn(
          "No se pudieron construir las URLs públicas de S3 para el avatar del perfil. Verifica las variables de entorno AWS_BUCKET_NAME y AWS_REGION."
        );
      }
    }

    const response = {
      id: findUser.id,
      name: findUser.name,
      matricula: findUser.matricula,
      role: findUser.role,
      userType: findUser.userType,
      points: findUser.points,
      createdAt: findUser.createdAt.toISOString(),
      profile: findUser.profile
        ? {
            id: findUser.profile.id,
            email: findUser.profile.email,
            bio: findUser.profile.bio,
            city: findUser.profile.city,
            state: findUser.profile.state,
            avatarUrl: findUser.profile.avatarUrl, // Esta es la fileKey
            publicAvatarDisplayUrl: publicAvatarDisplayUrl, // URL pública para el frontend
            badges: findUser.profile.badges || [],
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener el usuario" },
      { status: 500 }
    );
  }
}
