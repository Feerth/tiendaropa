import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { createMarcaSchema } from "@/lib/validations/marca";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const marcas = await prisma.marca.findMany({ orderBy: { nombre: "asc" } });
    return NextResponse.json({ success: true, data: marcas });
  } catch (error) {
    console.error("Error en admin/marcas (GET):", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener marcas", code: "FETCH_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createMarcaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const marca = await prisma.marca.create({ data: validation.data });

    return NextResponse.json({ success: true, data: marca }, { status: 201 });
  } catch (error) {
    console.error("Error en admin/marcas:", error);
    if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Ya existe una marca con ese nombre o slug", code: "DUPLICATE" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Error al crear marca", code: "CREATE_ERROR" },
      { status: 500 }
    );
  }
}
