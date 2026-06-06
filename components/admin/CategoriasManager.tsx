"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useToastStore } from "@/stores/toast";
import type { Categoria } from "@prisma/client";

interface Props {
  categorias: Categoria[];
}

export function CategoriasManager({ categorias }: Props) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), slug: slug.trim() || nombre.toLowerCase().replace(/\s+/g, "-") }),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      setNombre("");
      setSlug("");
      addToast("Categoría creada", "success");
      router.refresh();
    } catch {
      addToast("Error al crear categoría", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los productos se quedarán sin categoría.")) return;

    try {
      const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }
      addToast("Categoría eliminada", "success");
      router.refresh();
    } catch {
      addToast("Error al eliminar categoría", "error");
    }
  };

  const startEdit = (cat: Categoria) => {
    setEditingId(cat.id);
    setEditNombre(cat.nombre);
    setEditSlug(cat.slug);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNombre("");
    setEditSlug("");
  };

  const handleEdit = async (id: string) => {
    if (!editNombre.trim()) return;

    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: editNombre.trim(), slug: editSlug.trim() || editNombre.toLowerCase().replace(/\s+/g, "-") }),
      });

      const result = await res.json();
      if (!result.success) {
        addToast(result.error, "error");
        return;
      }

      addToast("Categoría actualizada", "success");
      cancelEdit();
      router.refresh();
    } catch {
      addToast("Error al actualizar categoría", "error");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Lista */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h2 className="font-display text-lg text-text-primary mb-4">Categorías existentes</h2>
        <div className="space-y-2">
          {categorias.map((cat, index) => (
            <div key={cat.id} className="py-2 px-3 rounded-lg bg-bg-secondary">
              {editingId === cat.id ? (
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
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" loading={editLoading} onClick={() => handleEdit(cat.id)}>
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
                    <span className="text-xs text-text-muted font-mono">{index + 1}</span>
                    <span className="text-sm text-text-primary">{cat.nombre}</span>
                    <span className="text-xs text-text-muted">/{cat.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-xs text-text-muted hover:text-accent-primary transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs text-text-muted hover:text-accent-secondary transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {categorias.length === 0 && (
            <p className="text-sm text-text-muted text-center py-4">No hay categorías aún</p>
          )}
        </div>
      </div>

      {/* Crear */}
      <div className="bg-bg-card border border-border-subtle rounded-xl p-6">
        <h2 className="font-display text-lg text-text-primary mb-4">Nueva categoría</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Clásicas, Running..."
            required
          />
          <Input
            label="Slug (opcional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Se genera automáticamente"
          />
          <Button type="submit" loading={loading}>
            CREAR CATEGORÍA
          </Button>
        </form>
      </div>
    </div>
  );
}
