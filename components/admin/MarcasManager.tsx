"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToastStore } from "@/stores/toast";
import type { Marca } from "@prisma/client";

interface Props {
  marcas: Marca[];
}

export function MarcasManager({ marcas }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editImagenUrl, setEditImagenUrl] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          slug: slug.trim() || nombre.toLowerCase().replace(/\s+/g, "-"),
          imagenUrl: imagenUrl || undefined,
        }),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      setNombre("");
      setSlug("");
      setImagenUrl("");
      addToast("Marca creada", "success");
      router.refresh();
    } catch {
      addToast("Error al crear marca", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta marca? Los productos asociados se quedarán sin marca.")) return;

    try {
      const res = await fetch(`/api/admin/marcas/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }
      addToast("Marca eliminada", "success");
      router.refresh();
    } catch {
      addToast("Error al eliminar marca", "error");
    }
  };

  const startEdit = (marca: Marca) => {
    setEditingId(marca.id);
    setEditNombre(marca.nombre);
    setEditSlug(marca.slug);
    setEditImagenUrl(marca.imagenUrl || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNombre("");
    setEditSlug("");
    setEditImagenUrl("");
  };

  const handleEdit = async (id: string) => {
    if (!editNombre.trim()) return;

    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/marcas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editNombre.trim(),
          slug: editSlug.trim() || editNombre.toLowerCase().replace(/\s+/g, "-"),
          imagenUrl: editImagenUrl || undefined,
        }),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      addToast("Marca actualizada", "success");
      cancelEdit();
      router.refresh();
    } catch {
      addToast("Error al actualizar marca", "error");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h2 className="font-display text-lg text-text-primary mb-4">Marcas existentes</h2>
        <div className="space-y-2">
          {marcas.map((marca, index) => (
            <div key={marca.id} className="py-2 px-3 rounded-lg bg-bg-secondary">
              {editingId === marca.id ? (
                <div className="space-y-2">
                  <Input
                    label="Nombre"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    required
                  />
                  <Input
                    label="Slug"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Logo</label>
                    {editImagenUrl ? (
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-secondary border border-border-subtle shrink-0">
                          <Image
                            src={editImagenUrl}
                            alt="Logo"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditImagenUrl("")}
                          className="text-xs text-accent-secondary hover:text-accent-secondary/80 transition-colors"
                        >
                          Eliminar logo
                        </button>
                      </div>
                    ) : null}
                    <ImageUploader
                      value={editImagenUrl ? [editImagenUrl] : []}
                      onChange={(urls) => setEditImagenUrl(urls[0] || "")}
                      maxImages={1}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" loading={editLoading} onClick={() => handleEdit(marca.id)}>
                      GUARDAR
                    </Button>
                    <Button size="sm" variant="secondary" onClick={cancelEdit}>
                      CANCELAR
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {marca.imagenUrl ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-secondary border border-border-subtle shrink-0">
                        <Image
                          src={marca.imagenUrl}
                          alt={marca.nombre}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center shrink-0">
                        <span className="text-xs text-text-muted font-bold">{marca.nombre[0]}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-text-primary">{marca.nombre}</span>
                      <span className="text-xs text-text-muted ml-2">/{marca.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(marca)}
                      className="text-xs text-text-muted hover:text-accent-primary transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(marca.id)}
                      className="text-xs text-text-muted hover:text-accent-secondary transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {marcas.length === 0 && (
            <p className="text-sm text-text-muted text-center py-4">No hay marcas aún</p>
          )}
        </div>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h2 className="font-display text-lg text-text-primary mb-4">Nueva marca</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Nike, Adidas..."
            required
          />
          <Input
            label="Slug (opcional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Se genera automáticamente"
          />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Logo</label>
            <ImageUploader
              value={imagenUrl ? [imagenUrl] : []}
              onChange={(urls) => setImagenUrl(urls[0] || "")}
              maxImages={1}
            />
          </div>
          <Button type="submit" loading={loading}>
            CREAR MARCA
          </Button>
        </form>
      </div>
    </div>
  );
}
