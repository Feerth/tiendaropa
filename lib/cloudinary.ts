import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAGIC_BYTES: Record<string, number[]> = {
  jpeg: [0xFF, 0xD8],
  png: [0x89, 0x50],
  webp: [0x52, 0x49, 0x46, 0x46],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function validateImage(file: File): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("La imagen no puede superar los 5MB")
  }

  const buffer = new Uint8Array(await file.slice(0, 4).arrayBuffer())

  const isValid = Object.values(MAGIC_BYTES).some((bytes) =>
    bytes.every((byte, i) => buffer[i] === byte)
  )

  if (!isValid) {
    throw new Error("Solo se permiten imágenes JPEG, PNG o WebP")
  }
}

export async function uploadImage(
  file: File,
  folder = "tiendaropa"
): Promise<{ url: string; publicId: string }> {
  await validateImage(file)

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? "Error al subir imagen"))
          return
        }
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )

    uploadStream.end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export async function uploadBuffer(
  buffer: Buffer,
  folder = "tiendaropa",
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? "Error al subir imagen"))
          return
        }
        resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )

    uploadStream.end(buffer)
  })
}
