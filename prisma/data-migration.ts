import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const url = new URL(process.env.DATABASE_URL!);
const pool = new pg.Pool({
  host: url.hostname,
  port: Number(url.port),
  user: url.username,
  password: decodeURIComponent(url.password),
  database: url.pathname.replace("/", ""),
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔄 Iniciando migración de datos...");

  // 1. Migrar imagenes String[] → Imagen model
  const productos = await prisma.producto.findMany({
    where: { imagenes: { some: {} } },
    include: { imagenes: true },
  });

  for (const producto of productos) {
    for (let i = 0; i < producto.imagenes.length; i++) {
      const img = producto.imagenes[i];
      const url = img.url;
      const publicId = img.publicId;

      await prisma.imagen.upsert({
        where: { id: img.id },
        update: { orden: i },
        create: {
          id: img.id,
          url,
          publicId,
          orden: i,
          productoId: producto.id,
        },
      });
    }
  }

  console.log(`✅ ${productos.length} productos con imágenes migradas`);

  console.log(`⏭️ Migración Admin ya aplicada`);

  console.log(`⏭️ Migración Categoria ya aplicada`);

  console.log(`⏭️ Migración ItemPedido ya aplicada`);

  await prisma.$disconnect();
  console.log("🎉 Migración de datos completada");
}

main().catch((e) => {
  console.error("❌ Error en migración:", e);
  process.exit(1);
});
