import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; //
import { getSession } from "@/lib/auth"; //
import { z } from "zod";
import {
  validateVideoFile,
  validateAvatarFile as validateThumbnailFile,
  getPublicS3Url,
  deleteFileFromS3,
  uploadShortVideoFileToS3,
  uploadVideoThumbnailToS3,
} from "@/lib/s3-service"; //
import { UserType, VideoTopic } from "@prisma/client";
import { MAX_SHORT_VIDEO_SIZE } from "@/types/types-s3-service"; //
import { optimizeImage } from "@/lib/image-compress-utils";

// Esquema para actualización, campos opcionales
const updateShortVideoSchema = z
  .object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().max(1000).optional().nullable(),
    topic: z.nativeEnum(VideoTopic).optional(),
    authorName: z.string(),
    authorInstitution: z.string(),
    authorInfo: z.string().max(500).optional().nullable(),
    duration: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => !val || !isNaN(parseInt(val)),
        "Duración debe ser un número."
      )
      .transform((val) => (val ? parseInt(val) : null)),
    videoSourceType: z.enum(["upload", "url", "keep"]).optional(), // 'keep' para no cambiar la fuente actual
    externalVideoUrl: z
      .string()
      .url("URL externa inválida.")
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.videoSourceType === "url" && !data.externalVideoUrl) {
      ctx.addIssue({
        code: "custom",
        message: "URL externa requerida si se selecciona 'url'.",
        path: ["externalVideoUrl"],
      });
    }
  });

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getSession(); //
    if (!session)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const { videoId } = params;

    const svFromDb = await prisma.shortVideo.findUnique({
      where: { id: videoId },
      include: {
        user: { select: { id: true, name: true, userType: true } },
        ratings: { select: { userId: true, liked: true } },
      },
    });

    if (!svFromDb)
      return NextResponse.json(
        { error: "Video no encontrado" },
        { status: 404 }
      );

    const likes = svFromDb.ratings.filter((r) => r.liked).length;
    const dislikes = svFromDb.ratings.filter((r) => !r.liked).length;
    const currentUserRating =
      svFromDb.ratings.find((r) => r.userId === (session.id as string))
        ?.liked ?? null;

    const shortVideo = {
      ...svFromDb,
      videoUrl:
        svFromDb.externalVideoUrl ||
        (svFromDb.videoS3Key ? getPublicS3Url(svFromDb.videoS3Key) : null), //
      thumbnailUrl: svFromDb.thumbnailS3Key
        ? getPublicS3Url(svFromDb.thumbnailS3Key)
        : null, //
      likes,
      dislikes,
      currentUserRating,
      ratings: undefined,
    };
    return NextResponse.json(shortVideo);
  } catch (error) {
    /* ... */ return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getSession(); //
    const { videoId } = params;
    const existingVideo = await prisma.shortVideo.findUnique({
      where: { id: videoId },
    });

    if (!existingVideo)
      return NextResponse.json(
        { error: "Video no encontrado" },
        { status: 404 }
      );
    if (
      !session ||
      session.id !== existingVideo.userId ||
      (session.userType !== UserType.TEACHER &&
        session.userType !== UserType.ADMIN)
    ) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const formData = await request.formData();
    const formValues: Record<string, any> = {};
    const newVideoFile = formData.get("videoFile") as File | null;
    const newThumbnailFile = formData.get("thumbnailFile") as File | null;

    formData.forEach((value, key) => {
      if (key !== "videoFile" && key !== "thumbnailFile")
        formValues[key] = value;
    });

    if (formValues.description === "") formValues.description = null;
    if (formValues.authorInfo === "") formValues.authorInfo = null;
    if (formValues.duration === "") formValues.duration = null;
    if (formValues.externalVideoUrl === "") formValues.externalVideoUrl = null;

    const validationResult = updateShortVideoSchema.safeParse(formValues);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { videoSourceType, externalVideoUrl, ...textData } =
      validationResult.data;
    const dataToUpdate: any = { ...textData };

    const currentUser = await prisma.user.findUnique({
      where: { id: session.id as string },
      include: { profile: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (videoSourceType === "upload" && newVideoFile) {
      const videoValidation = validateVideoFile(
        newVideoFile,
        MAX_SHORT_VIDEO_SIZE / (1024 * 1024)
      ); //
      if (!videoValidation.valid)
        return NextResponse.json(
          { error: videoValidation.error },
          { status: 400 }
        );

      if (existingVideo.videoS3Key)
        await deleteFileFromS3(existingVideo.videoS3Key); //
      if (existingVideo.externalVideoUrl) dataToUpdate.externalVideoUrl = null; // Clear external if uploading S3

      const videoS3Response = await uploadShortVideoFileToS3(
        newVideoFile,
        currentUser.userType,
        currentUser.matricula,
        textData.title as string
      ); //
      dataToUpdate.videoS3Key = videoS3Response.fileKey;
      dataToUpdate.externalVideoUrl = null;
    } else if (videoSourceType === "url" && externalVideoUrl) {
      if (existingVideo.videoS3Key)
        await deleteFileFromS3(existingVideo.videoS3Key); //
      dataToUpdate.videoS3Key = null;
      dataToUpdate.externalVideoUrl = externalVideoUrl;
    }
    // Si videoSourceType es "keep" o no se proporciona, no se cambia la fuente del video principal.

    if (newThumbnailFile) {
      const thumbValidation = validateThumbnailFile(newThumbnailFile); //
      if (!thumbValidation.valid)
        return NextResponse.json(
          { error: thumbValidation.error },
          { status: 400 }
        );
      if (existingVideo.thumbnailS3Key)
        await deleteFileFromS3(existingVideo.thumbnailS3Key); //

      const optimizedBuffer = await optimizeImage(newThumbnailFile);

      const thumbS3Response = await uploadVideoThumbnailToS3(
        optimizedBuffer,
        newThumbnailFile.name,
        "image/jpeg",
        currentUser.userType,
        currentUser.matricula,
        dataToUpdate.title as string
      ); //
      dataToUpdate.thumbnailS3Key = thumbS3Response.fileKey;
    } else if (
      formData.get("deleteThumbnail") === "true" &&
      existingVideo.thumbnailS3Key
    ) {
      await deleteFileFromS3(existingVideo.thumbnailS3Key); //
      dataToUpdate.thumbnailS3Key = null;
    }

    const updatedShortVideo = await prisma.shortVideo.update({
      where: { id: videoId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ...updatedShortVideo,
      videoUrl:
        updatedShortVideo.externalVideoUrl ||
        (updatedShortVideo.videoS3Key
          ? getPublicS3Url(updatedShortVideo.videoS3Key)
          : null), //
      thumbnailUrl: updatedShortVideo.thumbnailS3Key
        ? getPublicS3Url(updatedShortVideo.thumbnailS3Key)
        : null, //
    });
  } catch (error) {
    /* ... */ return NextResponse.json(
      { error: "Error interno." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getSession(); //
    const { videoId } = params;
    const videoToDelete = await prisma.shortVideo.findUnique({
      where: { id: videoId },
    });

    if (!videoToDelete)
      return NextResponse.json(
        { error: "Video no encontrado." },
        { status: 404 }
      );
    if (
      !session ||
      session.id !== videoToDelete.userId ||
      (session.userType !== UserType.TEACHER &&
        session.userType !== UserType.ADMIN)
    ) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    if (videoToDelete.videoS3Key)
      await deleteFileFromS3(videoToDelete.videoS3Key); //
    if (videoToDelete.thumbnailS3Key)
      await deleteFileFromS3(videoToDelete.thumbnailS3Key); //

    await prisma.shortVideo.delete({ where: { id: videoId } });
    return NextResponse.json({ message: "Video corto eliminado." });
  } catch (error) {
    /* ... */ return NextResponse.json(
      { error: "Error interno." },
      { status: 500 }
    );
  }
}
