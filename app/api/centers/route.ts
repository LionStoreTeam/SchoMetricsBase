import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialCategory = searchParams.get("materialCategory"); // Cambiado de materialId a materialCategory
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const searchTerm = searchParams.get("search") || ""; // Para búsqueda por nombre/descripción
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [], // Usar AND para combinar condiciones
    };

    if (city) where.AND.push({ city: { contains: city, mode: "insensitive" } });
    if (state) where.AND.push({ state: { equals: state } }); // Búsqueda exacta para estado

    if (searchTerm) {
      where.OR = [
        // Buscar en nombre o descripción
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { address: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (materialCategory && materialCategory !== "all") {
      where.AND.push({
        materials: {
          some: {
            material: {
              category: materialCategory,
            },
          },
        },
      });
    }

    // Si where.AND está vacío, quitarlo para no generar un filtro vacío
    if (where.AND.length === 0) delete where.AND;

    const centers = await prisma.recyclingCenter.findMany({
      where,
      include: {
        materials: {
          include: {
            material: true, // Incluir los detalles del material
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: limit,
    });

    const total = await prisma.recyclingCenter.count({ where });

    return NextResponse.json({
      centers: centers.map((center) => ({
        ...center,
        // Prisma devuelve Floats para lat/long, aseguramos que sean numbers
        latitude: Number(center.latitude),
        longitude: Number(center.longitude),
        materials: center.materials.map((cm) => cm.material), // Simplificar la estructura de materiales
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener centros de acopio:", error);
    return NextResponse.json(
      { error: "Error al obtener centros de acopio" },
      { status: 500 }
    );
  }
}
