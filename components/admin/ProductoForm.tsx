"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductoSchema, type CreateProductoInput } from "@/lib/validations/producto";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToastStore } from "@/stores/toast";
import type { Categoria } from "@prisma/client";

interface Props {
  categorias: Categoria[];
  initialData?: CreateProductoInput & { id?: string };
}

export function ProductoForm({ categorias, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const {
    register,
    control,
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
      imagenes: [],
      destacado: false,
      activo: true,
      variantes: [{ talla: "", color: "", stock: 0, sku: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variantes",
  });

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

      {/* Imágenes */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <ImageUploader
          value={watch("imagenes") || []}
          onChange={(urls) => setValue("imagenes", urls, { shouldValidate: true })}
        />
      </div>

      {/* Variantes */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-text-primary">Variantes</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ talla: "", color: "", stock: 0, sku: "" })}
          >
            + AGREGAR
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-5 gap-3 items-end">
              <Input
                label="Talla"
                error={errors.variantes?.[index]?.talla?.message}
                {...register(`variantes.${index}.talla`)}
              />
              <Input
                label="Color"
                {...register(`variantes.${index}.color`)}
              />
              <Input
                label="Stock"
                type="number"
                error={errors.variantes?.[index]?.stock?.message}
                {...register(`variantes.${index}.stock`, { valueAsNumber: true })}
              />
              <Input
                label="SKU"
                {...register(`variantes.${index}.sku`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="h-[42px] px-3 text-xs text-accent-secondary hover:text-accent-secondary/80 transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
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
