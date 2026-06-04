import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tiendaropa.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashedPassword },
    create: { email: adminEmail, passwordHash: hashedPassword },
  });

  console.log(`✅ Admin creado: ${adminEmail}`);

  // Categorías
  const categorias = await Promise.all([
    prisma.categoria.upsert({
      where: { slug: "ropa" },
      update: {},
      create: {
        nombre: "Ropa",
        slug: "ropa",
        imagenUrl: "https://placehold.co/400x300/1a1a2e/E8FF00?text=Ropa",
        orden: 1,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: "zapatillas" },
      update: {},
      create: {
        nombre: "Zapatillas",
        slug: "zapatillas",
        imagenUrl: "https://placehold.co/400x300/1a1a2e/E8FF00?text=Zapatillas",
        orden: 2,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: "accesorios" },
      update: {},
      create: {
        nombre: "Accesorios",
        slug: "accesorios",
        imagenUrl: "https://placehold.co/400x300/1a1a2e/E8FF00?text=Accesorios",
        orden: 3,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: "ofertas" },
      update: {},
      create: {
        nombre: "Ofertas",
        slug: "ofertas",
        orden: 4,
      },
    }),
  ]);

  console.log(`✅ ${categorias.length} categorías creadas`);

  const ropaId = categorias[0].id;
  const zapatillasId = categorias[1].id;
  const accesoriosId = categorias[2].id;
  const ofertasId = categorias[3].id;

  function placeholderImg(name: string, index: number): string {
    const bg = index === 0 ? "1a1a2e" : "2a2a3e";
    return `https://placehold.co/600x750/${bg}/E8FF00?text=${encodeURIComponent(name.split(" ").slice(0, 2).join("+"))}`;
  }

  // Productos
  const productos = [
    {
      nombre: "Hoodie Urban Negra",
      slug: "hoodie-urban-negra",
      descripcion: "Hoodie de algodón premium con corte oversized. Bolsillo canguro frontal, capucha ajustable con cordones. Ideal para el día a día con estilo urbano.",
      precio: 89.90,
      precioAntes: 119.90,
      categoriaId: ropaId,
      destacado: true,
      imagenes: ["hoodie", "hoodie"],
      variantes: [
        { talla: "S", stock: 15 },
        { talla: "M", stock: 20 },
        { talla: "L", stock: 12 },
        { talla: "XL", stock: 8 },
      ],
    },
    {
      nombre: "Camiseta Premium Blanca",
      slug: "camiseta-premium-blanca",
      descripcion: "Camiseta de algodón orgánico 180gsm. Corte regular, cuello redondo reforzado. Básico esencial con acabado premium.",
      precio: 39.90,
      categoriaId: ropaId,
      imagenes: ["camiseta", "camiseta"],
      variantes: [
        { talla: "S", stock: 25 },
        { talla: "M", stock: 30 },
        { talla: "L", stock: 20 },
        { talla: "XL", stock: 10 },
      ],
    },
    {
      nombre: "Nike Air Force 1 White",
      slug: "nike-air-force-1-white",
      descripcion: "Clásicas Nike Air Force 1 en blanco. Icono del streetwear. Suela de goma durable, amortiguación Air-Sole.",
      precio: 329.90,
      precioAntes: 379.90,
      categoriaId: zapatillasId,
      destacado: true,
      imagenes: ["af1", "af1"],
      variantes: [
        { talla: "38", stock: 5 },
        { talla: "39", stock: 8 },
        { talla: "40", stock: 12 },
        { talla: "41", stock: 10 },
        { talla: "42", stock: 6 },
        { talla: "43", stock: 3 },
      ],
    },
    {
      nombre: "Adidas Samba Classic",
      slug: "adidas-samba-classic",
      descripcion: "Las icónicas Adidas Samba. Silueta retro, parte superior de cuero, suela de goma. Un must-have en cualquier colección.",
      precio: 259.90,
      categoriaId: zapatillasId,
      destacado: true,
      imagenes: ["samba", "samba"],
      variantes: [
        { talla: "39", stock: 7 },
        { talla: "40", stock: 9 },
        { talla: "41", stock: 11 },
        { talla: "42", stock: 5 },
        { talla: "43", stock: 4 },
      ],
    },
    {
      nombre: "New Balance 550",
      slug: "new-balance-550",
      descripcion: "New Balance 550 con estilo basketball vintage. Piel y malla, entresuela ligera. Perfectas para el look casual.",
      precio: 289.90,
      categoriaId: zapatillasId,
      imagenes: ["nb550", "nb550"],
      variantes: [
        { talla: "40", stock: 6 },
        { talla: "41", stock: 8 },
        { talla: "42", stock: 4 },
        { talla: "43", stock: 2 },
      ],
    },
    {
      nombre: "Cargo Pants Negro",
      slug: "cargo-pants-negro",
      descripcion: "Pantalón cargo holgado con múltiples bolsillos. Tela de algodón ripstop. Elástico en cintura y tobillos.",
      precio: 79.90,
      categoriaId: ropaId,
      imagenes: ["cargo", "cargo"],
      variantes: [
        { talla: "S", stock: 10 },
        { talla: "M", stock: 15 },
        { talla: "L", stock: 12 },
        { talla: "XL", stock: 7 },
      ],
    },
    {
      nombre: "Gorra Trucker Negra",
      slug: "gorra-trucker-negra",
      descripcion: "Gorra estilo trucker con frente estructurado y malla transpirable. Cierre ajustable. Logotipo bordado.",
      precio: 29.90,
      categoriaId: accesoriosId,
      imagenes: ["gorra"],
      variantes: [
        { talla: "Única", stock: 30 },
      ],
    },
    {
      nombre: "Vans Old Skool Black",
      slug: "vans-old-skool-black",
      descripcion: "Vans Old Skool negras clásicas. Sidestripe icónico, suela de goma waffle. Un básico del skateboarding.",
      precio: 219.90,
      categoriaId: zapatillasId,
      imagenes: ["vans", "vans"],
      variantes: [
        { talla: "38", stock: 4 },
        { talla: "39", stock: 6 },
        { talla: "40", stock: 8 },
        { talla: "41", stock: 10 },
        { talla: "42", stock: 5 },
      ],
    },
    {
      nombre: "Chaqueta Cortavientos",
      slug: "chaqueta-cortavientos",
      descripcion: "Chaqueta cortavientos ligera con capucha. Material impermeable, cierre frontal y bolsillos con cremallera. Ideal para entretiempo.",
      precio: 129.90,
      precioAntes: 159.90,
      categoriaId: ofertasId,
      imagenes: ["chaqueta", "chaqueta"],
      variantes: [
        { talla: "S", stock: 8 },
        { talla: "M", stock: 12 },
        { talla: "L", stock: 10 },
        { talla: "XL", stock: 5 },
      ],
    },
    {
      nombre: "Mochila Urbana Premium",
      slug: "mochila-urbana-premium",
      descripcion: "Mochila de 25L con compartimento para laptop. Material impermeable, espalda acolchada, bolsillo organizador frontal.",
      precio: 69.90,
      categoriaId: accesoriosId,
      imagenes: ["mochila"],
      variantes: [
        { talla: "Única", stock: 20 },
      ],
    },
    {
      nombre: "Jogger Sweatpants Gris",
      slug: "jogger-sweatpants-gris",
      descripcion: "Jogger de algodón French Terry. Corte recto, cintura elástica con cordón, bolsillos laterales. Puños en tobillos.",
      precio: 59.90,
      categoriaId: ropaId,
      imagenes: ["jogger", "jogger"],
      variantes: [
        { talla: "S", stock: 12 },
        { talla: "M", stock: 18 },
        { talla: "L", stock: 14 },
        { talla: "XL", stock: 9 },
      ],
    },
    {
      nombre: "Converse Chuck 70 High",
      slug: "converse-chuck-70-high",
      descripcion: "Converse Chuck Taylor All Star 70 caña alta. Lona premium, suela de goma vulcanizada, más durable que las clásicas.",
      precio: 239.90,
      categoriaId: zapatillasId,
      destacado: true,
      imagenes: ["converse", "converse"],
      variantes: [
        { talla: "38", stock: 3 },
        { talla: "39", stock: 0 },
        { talla: "40", stock: 7 },
        { talla: "41", stock: 9 },
        { talla: "42", stock: 6 },
        { talla: "43", stock: 0 },
      ],
    },
  ];

  for (const p of productos) {
    const { variantes, imagenes, ...productoData } = p;
    await prisma.producto.upsert({
      where: { slug: productoData.slug },
      update: {},
      create: {
        ...productoData,
        activo: true,
        imagenes: {
          create: imagenes.map((name, i) => ({
            url: placeholderImg(name, i),
            publicId: `seed-${productoData.slug}-${i}`,
            orden: i,
          })),
        },
        variantes: {
          create: variantes,
        },
      },
    });
  }

  console.log(`✅ ${productos.length} productos creados con variantes`);
  console.log("🎉 Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
