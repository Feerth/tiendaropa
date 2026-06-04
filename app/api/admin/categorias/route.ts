import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const createCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createCategoriaSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const maxOrden = await prisma.categoria.aggregate({ _max: { orden: true } });

    const categoria = await prisma.categoria.create({
      data: {
        ...validation.data,
        orden: (maxOrden._max.orden ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true, data: categoria }, { status: 201 });
  } catch (error) {
    console.error("Error en admin/categorias:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear categoría", code: "CREATE_ERROR" },
      { status: 500 }
    );
  }
}
