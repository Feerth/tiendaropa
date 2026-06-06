import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const productos = await prisma.producto.findMany({
    where: { activo: true },
    select: { slug: true, actualizadoEn: true },
  });

  const categorias = await prisma.categoria.findMany({
    where: { activa: true },
    select: { slug: true },
  });

  const productoEntries: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${baseUrl}/productos/${p.slug}`,
    lastModified: p.actualizadoEn,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoriaEntries: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${baseUrl}/productos?categoria=${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/productos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productoEntries,
    ...categoriaEntries,
    {
      url: `${baseUrl}/contacto`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
