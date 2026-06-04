import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No se recibió archivo", code: "NO_FILE" }, { status: 400 });
    }

    const { url } = await uploadImage(file, "adnstore");

    return NextResponse.json({ success: true, data: { url } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al subir imagen";
    return NextResponse.json({ success: false, error: message, code: "UPLOAD_ERROR" }, { status: 400 });
  }
}
