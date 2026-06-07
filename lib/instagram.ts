import { prisma } from "@/lib/db";

let cachedUsername: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function getInstagramUsername(): Promise<string> {
  const now = Date.now();
  if (cachedUsername && now - cacheTimestamp < CACHE_TTL) {
    return cachedUsername;
  }

  try {
    const config = await prisma.configuracion.findUnique({
      where: { clave: "instagram_usuario" },
    });
    cachedUsername = config?.valor ?? null;
    cacheTimestamp = now;
  } catch {
    cachedUsername = null;
  }

  return cachedUsername || process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "nov4sk_";
}
