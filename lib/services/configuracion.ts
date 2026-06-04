import { prisma } from "@/lib/db";

let cache: Record<string, string> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 2 * 60 * 1000;

export const ConfiguracionService = {
  async obtenerTodas(): Promise<Record<string, string>> {
    const now = Date.now();
    if (cache && now - cacheTimestamp < CACHE_TTL) {
      return cache;
    }

    const configs = await prisma.configuracion.findMany();
    const map: Record<string, string> = {};
    for (const c of configs) {
      map[c.clave] = c.valor;
    }

    cache = map;
    cacheTimestamp = now;
    return map;
  },

  async obtener(clave: string): Promise<string | null> {
    const todas = await this.obtenerTodas();
    return todas[clave] ?? null;
  },

  async actualizar(entradas: Record<string, string>): Promise<void> {
    for (const [clave, valor] of Object.entries(entradas)) {
      await prisma.configuracion.upsert({
        where: { clave },
        update: { valor },
        create: { clave, valor },
      });
    }
    cache = null;
  },

  invalidateCache(): void {
    cache = null;
  },
};
