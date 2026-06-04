import { prisma } from "@/lib/db";

let cachedNumber: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function getWhatsAppNumber(): Promise<string> {
  const now = Date.now();
  if (cachedNumber && now - cacheTimestamp < CACHE_TTL) {
    return cachedNumber;
  }

  try {
    const config = await prisma.configuracion.findUnique({
      where: { clave: "whatsapp_numero" },
    });
    cachedNumber = config?.valor ?? null;
    cacheTimestamp = now;
  } catch {
    cachedNumber = null;
  }

  return cachedNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51931869696";
}
