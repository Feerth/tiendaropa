import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { CreateProductoInput, UpdateProductoInput } from "@/lib/validations/producto";

async function generarSlugUnico(nombre: string, idExcluir?: string): Promise<string> {
  let slug = slugify(nombre);
  if (!slug) slug = "producto-" + Date.now();

  let counter = 1;
  while (true) {
    const existing = await prisma.producto.findUnique({ where: { slug } });
    if (!existing || (idExcluir && existing.id === idExcluir)) return slug;
    slug = `${slugify(nombre)}-${counter++}`;
  }
}

function sanitizarVariante(v: { talla: string; color?: string; stock: number; sku?: string }) {
  return {
    talla: v.talla,
    color: v.color || undefined,
    stock: v.stock,
    sku: v.sku || undefined,
  };
}

export const ProductoService = {
  async listar(filtros?: {
    categoria?: string;
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
    if (filtros?.destacado) where.destacado = true;

    if (filtros?.categoria) {
      where.categoria = { slug: filtros.categoria };
    }

    if (filtros?.buscar) {
      where.nombre = { contains: filtros.buscar, mode: "insensitive" };
    }

    if (filtros?.talla) {
      where.variantes = { some: { talla: filtros.talla } };
    }

    if (filtros?.precioMin !== undefined || filtros?.precioMax !== undefined) {
      where.precio = {};
      if (filtros.precioMin !== undefined) where.precio.gte = filtros.precioMin;
      if (filtros.precioMax !== undefined) where.precio.lte = filtros.precioMax;
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
          variantes: { select: { talla: true, stock: true, color: true } },
          imagenes: { select: { url: true }, orderBy: { orden: "asc" } },
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
      imagenes: p.imagenes.map((i) => i.url),
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
        variantes: { select: { talla: true, stock: true, color: true } },
        imagenes: { select: { url: true }, orderBy: { orden: "asc" } },
      },
      take: 4,
    });

    const mappedRelacionados = relacionados.map((r) => ({
      ...r,
      precio: Number(r.precio),
      precioAntes: r.precioAntes ? Number(r.precioAntes) : null,
      imagenes: r.imagenes.map((i) => i.url),
    }));

    return {
      ...producto,
      precio: Number(producto.precio),
      precioAntes: producto.precioAntes ? Number(producto.precioAntes) : null,
      relacionados: mappedRelacionados,
    };
  },

  async crear(data: CreateProductoInput) {
    const slug = await generarSlugUnico(data.nombre);

    const producto = await prisma.producto.create({
      data: {
        nombre: data.nombre,
        slug,
        descripcion: data.descripcion,
        precio: data.precio,
        precioAntes: data.precioAntes,
        categoriaId: data.categoriaId,
        destacado: data.destacado ?? false,
        activo: data.activo ?? true,
        imagenes: {
          create: (data.imagenes ?? []).map((url, i) => ({
            url,
            publicId: url.split("/").pop() || `img-${Date.now()}-${i}`,
            orden: i,
          })),
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
      updateData.nombre = data.nombre;
      updateData.slug = await generarSlugUnico(data.nombre, id);
    }
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.precio !== undefined) updateData.precio = data.precio;
    if (data.precioAntes !== undefined) updateData.precioAntes = data.precioAntes;
    if (data.categoriaId) updateData.categoria = { connect: { id: data.categoriaId } };
    if (data.destacado !== undefined) updateData.destacado = data.destacado;
    if (data.activo !== undefined) updateData.activo = data.activo;

    if (data.imagenes) {
      await prisma.imagen.deleteMany({ where: { productoId: id } });
      await prisma.imagen.createMany({
        data: data.imagenes.map((url, i) => ({
          url,
          publicId: url.split("/").pop() || `img-${Date.now()}-${i}`,
          orden: i,
          productoId: id,
        })),
      });
    }

    if (data.variantes) {
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

    const producto = await prisma.producto.update({
      where: { id },
      data: updateData,
      include: { categoria: true, variantes: true, imagenes: { orderBy: { orden: "asc" } } },
    });

    return producto;
  },

  async eliminar(id: string) {
    try {
      await prisma.variante.deleteMany({ where: { productoId: id } });
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
        destacado: false,
        activo: false,
        imagenes: {
          create: original.imagenes.map((img) => ({
            url: img.url,
            publicId: `${img.publicId}-COPY`,
            orden: img.orden,
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
