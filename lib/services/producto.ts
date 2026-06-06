import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { CreateProductoInput, UpdateProductoInput } from "@/lib/validations/producto";

function toDecimal(num: number): Prisma.Decimal {
  return new Prisma.Decimal(num.toFixed(2));
}

async function generarSlugUnico(nombre: string, idExcluir?: string): Promise<string> {
  const base = slugify(nombre);
  let slug = base;

  let counter = 1;
  const MAX_ATTEMPTS = 100;

  while (counter <= MAX_ATTEMPTS) {
    const existing = await prisma.producto.findUnique({ where: { slug } });
    if (!existing || (idExcluir && existing.id === idExcluir)) return slug;
    slug = `${base}-${counter++}`;
  }

  return `${base}-${Date.now()}`;
}

function sanitizarVariante(v: { talla: string; color?: string; stock: number; sku?: string }) {
  return {
    talla: v.talla.trim(),
    color: (v.color || "").trim() || undefined,
    stock: v.stock,
    sku: v.sku?.trim() || undefined,
  };
}

type ImagenInput = string | { url: string; colorKey?: string | null };
function normalizarImagen(img: ImagenInput, i: number) {
  const url = typeof img === "string" ? img : img.url;
  const colorKey = typeof img === "string" ? null : (img.colorKey ?? null);
  return {
    url,
    publicId: url.split("/").pop() || `img-${Date.now()}-${i}`,
    orden: i,
    colorKey: colorKey?.toLowerCase().trim() ?? null,
  };
}

export const ProductoService = {
  async listar(filtros?: {
    categoria?: string;
    marca?: string;
    activo?: boolean;
    destacado?: boolean;
    buscar?: string;
    talla?: string;
    precioMin?: number;
    precioMax?: number;
    ordenar?: "precio_asc" | "precio_desc" | "nuevos" | "destacados";
    page?: number;
    limit?: number;
  }) {
    const page = filtros?.page ?? 1;
    const limit = filtros?.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductoWhereInput = {};

    if (filtros?.activo !== undefined) where.activo = filtros.activo;
    if (filtros?.destacado !== undefined) where.destacado = filtros.destacado;

    if (filtros?.categoria) {
      where.categoria = { slug: filtros.categoria };
    }

    if (filtros?.marca) {
      where.marca = { slug: filtros.marca };
    }

    if (filtros?.buscar) {
      where.nombre = { contains: filtros.buscar, mode: "insensitive" };
    }

    if (filtros?.talla) {
      where.variantes = { some: { talla: filtros.talla } };
    }

    if (filtros?.precioMin !== undefined && Number.isFinite(filtros.precioMin)) {
      where.precio = { ...(where.precio as object || {}), gte: filtros.precioMin };
    }
    if (filtros?.precioMax !== undefined && Number.isFinite(filtros.precioMax)) {
      where.precio = { ...(where.precio as object || {}), lte: filtros.precioMax };
    }

    let orderBy: Prisma.ProductoOrderByWithRelationInput = { creadoEn: "desc" };
    if (filtros?.ordenar === "precio_asc") orderBy = { precio: "asc" };
    if (filtros?.ordenar === "precio_desc") orderBy = { precio: "desc" };
    if (filtros?.ordenar === "destacados") orderBy = { destacado: "desc" };

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          categoria: { select: { nombre: true, slug: true } },
          marca: { select: { nombre: true, slug: true } },
          variantes: { select: { talla: true, stock: true, color: true } },
          imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.producto.count({ where }),
    ]);

    const mapped = productos.map((p) => ({
      ...p,
      precio: Number(p.precio),
      precioAntes: p.precioAntes ? Number(p.precioAntes) : null,
      imagenes: p.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
    }));

    return {
      productos: mapped,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async obtenerPorSlug(slug: string) {
    const producto = await prisma.producto.findUnique({
      where: { slug },
      include: {
        categoria: true,
        marca: true,
        variantes: {
          select: { id: true, talla: true, color: true, stock: true, sku: true },
        },
        imagenes: { orderBy: { orden: "asc" } },
      },
    });

    if (!producto) return null;

    const relacionados = await prisma.producto.findMany({
      where: {
        categoriaId: producto.categoriaId,
        id: { not: producto.id },
        activo: true,
      },
      include: {
        categoria: { select: { nombre: true, slug: true } },
        marca: { select: { nombre: true, slug: true } },
        variantes: { select: { talla: true, stock: true, color: true } },
        imagenes: { select: { url: true, colorKey: true }, orderBy: { orden: "asc" } },
      },
      take: 4,
    });

    const mappedRelacionados = relacionados.map((r) => ({
      ...r,
      precio: Number(r.precio),
      precioAntes: r.precioAntes ? Number(r.precioAntes) : null,
      imagenes: r.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
    }));

    return {
      ...producto,
      precio: Number(producto.precio),
      precioAntes: producto.precioAntes ? Number(producto.precioAntes) : null,
      imagenes: producto.imagenes.map((i) => ({ url: i.url, colorKey: i.colorKey })),
      relacionados: mappedRelacionados,
    };
  },

  async crear(data: CreateProductoInput) {
    const slug = await generarSlugUnico(data.nombre);

    const producto = await prisma.producto.create({
      data: {
        nombre: data.nombre.trim(),
        slug,
        descripcion: data.descripcion?.trim(),
        precio: toDecimal(data.precio),
        precioAntes: data.precioAntes != null ? toDecimal(data.precioAntes) : undefined,
        categoriaId: data.categoriaId,
        marcaId: data.marcaId || undefined,
        destacado: data.destacado ?? false,
        activo: data.activo ?? true,
        imagenes: {
          create: (data.imagenes ?? []).map((img, i) => normalizarImagen(img, i)),
        },
        variantes: {
          create: data.variantes.map(sanitizarVariante),
        },
      },
      include: {
        categoria: true,
        variantes: true,
      },
    });

    return producto;
  },

  async actualizar(id: string, data: UpdateProductoInput) {
    const existing = await prisma.producto.findUnique({
      where: { id },
      include: { variantes: true, imagenes: true },
    });

    if (!existing) throw new Error("Producto no encontrado");

    const updateData: Prisma.ProductoUpdateInput = {};

    if (data.nombre !== undefined) {
      updateData.nombre = data.nombre.trim();
      updateData.slug = await generarSlugUnico(data.nombre, id);
    }
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion?.trim() ?? null;
    if (data.precio !== undefined) updateData.precio = toDecimal(data.precio);
    if (data.precioAntes !== undefined) {
      updateData.precioAntes = data.precioAntes != null ? toDecimal(data.precioAntes) : null;
    }
    if (data.categoriaId !== undefined) {
      updateData.categoria = { connect: { id: data.categoriaId } };
    }
    if (data.marcaId !== undefined) {
      updateData.marca = data.marcaId
        ? { connect: { id: data.marcaId } }
        : { disconnect: true };
    }
    if (data.destacado !== undefined) updateData.destacado = data.destacado;
    if (data.activo !== undefined) updateData.activo = data.activo;

    if (data.imagenes !== undefined) {
      await prisma.$transaction([
        prisma.imagen.deleteMany({ where: { productoId: id } }),
        prisma.imagen.createMany({
          data: data.imagenes.map((img, i) => ({
            ...normalizarImagen(img, i),
            productoId: id,
          })),
        }),
      ]);
    }

    if (data.variantes !== undefined) {
      await prisma.$transaction([
        prisma.variante.deleteMany({ where: { productoId: id } }),
        prisma.variante.createMany({
          data: data.variantes.map((v) => ({
            productoId: id,
            ...sanitizarVariante(v),
          })),
        }),
      ]);
    }

    if (Object.keys(updateData).length > 0) {
      const producto = await prisma.producto.update({
        where: { id },
        data: updateData,
        include: { categoria: true, marca: true, variantes: true, imagenes: { orderBy: { orden: "asc" } } },
      });
      return producto;
    }

    return prisma.producto.findUnique({
      where: { id },
      include: { categoria: true, marca: true, variantes: true, imagenes: { orderBy: { orden: "asc" } } },
    });
  },

  async eliminar(id: string) {
    try {
      await prisma.producto.delete({ where: { id } });
    } catch {
      throw new Error("No se pudo eliminar el producto. Puede tener pedidos asociados.");
    }
  },

  async duplicar(id: string) {
    const original = await prisma.producto.findUnique({
      where: { id },
      include: { variantes: true, imagenes: true },
    });

    if (!original) throw new Error("Producto no encontrado");

    const slug = await generarSlugUnico(`${original.nombre} Copia`);
    const producto = await prisma.producto.create({
      data: {
        nombre: `${original.nombre} (Copia)`,
        slug,
        descripcion: original.descripcion,
        precio: original.precio,
        precioAntes: original.precioAntes,
        categoriaId: original.categoriaId,
        marcaId: original.marcaId,
        destacado: false,
        activo: false,
        imagenes: {
          create: original.imagenes.map((img) => ({
            url: img.url,
            publicId: `${img.publicId}-COPY`,
            orden: img.orden,
            colorKey: img.colorKey,
          })),
        },
        variantes: {
          create: original.variantes.map((v) => ({
            talla: v.talla,
            color: v.color,
            stock: 0,
            sku: v.sku ? `${v.sku}-COPY` : undefined,
          })),
        },
      },
      include: { variantes: true, imagenes: true },
    });

    return producto;
  },

  async toggleActivo(id: string, activo?: boolean) {
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new Error("Producto no encontrado");

    return prisma.producto.update({
      where: { id },
      data: { activo: activo !== undefined ? activo : !producto.activo },
    });
  },
};
