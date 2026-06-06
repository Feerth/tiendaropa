"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductoSchema, type CreateProductoInput } from "@/lib/validations/producto";
import { colorToHex } from "@/lib/colors";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MatrixVariants, flattenMatrix, inflateToMatrix } from "@/components/admin/MatrixVariants";
import type { ColorRow } from "@/components/admin/MatrixVariants";
import { useToastStore } from "@/stores/toast";
import type { Categoria, Marca } from "@prisma/client";

type ImagenField = { url: string; colorKey: string | null };

interface Props {
  categorias: Categoria[];
  marcas?: Marca[];
  initialData?: (CreateProductoInput & { id?: string });
}

const DEFAULT_IMAGENES: ImagenField[] = [];

export function ProductoForm({ categorias, marcas, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const matrixInit = useMemo(() => {
    if (initialData?.variantes?.length) {
      return inflateToMatrix(initialData.variantes);
    }
    return { tallas: [] as string[], colorRows: [] as ColorRow[] };
  }, []);

  const [matrixTallas, setMatrixTallas] = useState<string[]>(matrixInit.tallas);
  const [matrixColorRows, setMatrixColorRows] = useState<ColorRow[]>(matrixInit.colorRows);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductoInput>({
    resolver: zodResolver(createProductoSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      precio: undefined,
      precioAntes: undefined,
      categoriaId: "",
      marcaId: "",
      imagenes: DEFAULT_IMAGENES,
      destacado: false,
      activo: true,
      variantes: [],
    },
  });

  const coloresEnVariantes = useMemo(
    () => matrixColorRows.map((r) => r.color),
    [matrixColorRows]
  );

  const imagenes = watch("imagenes") as ImagenField[] | undefined;

  const getImagenesPorColor = (colorKey: string | null): string[] => {
    return (imagenes || [])
      .filter((img) => img.colorKey === colorKey)
      .map((img) => img.url);
  };

  const countImagenes = (colorKey: string | null): number => {
    return getImagenesPorColor(colorKey).length;
  };

  const setImagenesPorColor = (colorKey: string | null, urls: string[]) => {
    const other = (imagenes || []).filter((img) => img.colorKey !== colorKey);
    const nuevas: ImagenField[] = [
      ...other,
      ...urls.map((url) => ({ url, colorKey })),
    ];
    setValue("imagenes", nuevas, { shouldValidate: true });
  };

  const handleMatrixChange = (tallas: string[], colorRows: ColorRow[]) => {
    setMatrixTallas(tallas);
    setMatrixColorRows(colorRows);
  };

  const onSubmit = async (data: CreateProductoInput) => {
    setLoading(true);
    try {
      const url = initialData?.id
        ? `/api/admin/productos/${initialData.id}`
        : "/api/admin/productos";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      addToast(initialData ? "Producto actualizado" : "Producto creado", "success");
      router.push("/admin/productos");
      router.refresh();
    } catch {
      addToast("Error al guardar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const variantes = flattenMatrix(matrixTallas, matrixColorRows);
    if (variantes.length === 0) {
      addToast("Agrega al menos una variante", "error");
      return;
    }
    setValue("variantes", variantes);
    await handleSubmit(onSubmit)(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {/* Información básica */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
        <h2 className="font-display text-xl text-text-primary">Información básica</h2>

        <Input
          label="Nombre del producto"
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Descripción</label>
          <textarea
            {...register("descripcion")}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-default text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio (S/)"
            type="number"
            step="0.01"
            error={errors.precio?.message}
            {...register("precio", { valueAsNumber: true })}
          />
          <Input
            label="Precio anterior (S/)"
            type="number"
            step="0.01"
            {...register("precioAntes", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Categoría</label>
          <select
            {...register("categoriaId")}
            className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-default text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          {errors.categoriaId && (
            <p className="mt-1 text-xs text-accent-secondary">{errors.categoriaId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Marca</label>
          <select
            {...register("marcaId")}
            className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border-default text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary"
          >
            <option value="">Sin marca</option>
            {(marcas || []).map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("destacado")} className="w-4 h-4 rounded border-border-default bg-bg-secondary accent-accent-primary" />
            <span className="text-sm text-text-secondary">Destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("activo")} className="w-4 h-4 rounded border-border-default bg-bg-secondary accent-accent-primary" />
            <span className="text-sm text-text-secondary">Activo</span>
          </label>
        </div>
      </div>

      {/* Imágenes por color */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-6">
        <h2 className="font-display text-xl text-text-primary">Imágenes</h2>

        {/* General (sin color) */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
            <span>General</span>
            {coloresEnVariantes.length > 0 && (
              <span className="text-[10px] text-text-muted font-normal">(fallback si no hay del color)</span>
            )}
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${countImagenes(null) > 0 ? "bg-accent-primary/10 text-accent-primary" : "bg-accent-secondary/10 text-accent-secondary"}`}>
              {countImagenes(null)}/4
            </span>
          </h3>
          <ImageUploader
            value={getImagenesPorColor(null)}
            onChange={(urls) => setImagenesPorColor(null, urls)}
            maxImages={4}
          />
        </div>

        {/* Por color */}
        {coloresEnVariantes.map((color) => (
          <div key={color}>
            <h3 className="text-sm font-medium text-accent-primary mb-3 uppercase tracking-wider flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-border-default inline-block"
                style={{ backgroundColor: colorToHex(color) }}
              />
              <span>Color: {color}</span>
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${countImagenes(color) > 0 ? "bg-accent-primary/10 text-accent-primary" : "bg-accent-secondary/10 text-accent-secondary"}`}>
                {countImagenes(color)}/4
              </span>
            </h3>
            <ImageUploader
              value={getImagenesPorColor(color)}
              onChange={(urls) => setImagenesPorColor(color, urls)}
              maxImages={4}
            />
          </div>
        ))}
      </div>

      {/* Variantes — Matriz */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h2 className="font-display text-xl text-text-primary mb-6">Variantes</h2>
        <MatrixVariants
          initialTallas={matrixInit.tallas}
          initialColorRows={matrixInit.colorRows}
          onChange={handleMatrixChange}
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <Button type="submit" loading={loading}>
          {initialData ? "GUARDAR CAMBIOS" : "CREAR PRODUCTO"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          CANCELAR
        </Button>
      </div>
    </form>
  );
}


