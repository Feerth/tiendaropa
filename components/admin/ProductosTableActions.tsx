"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { useToastStore } from "@/stores/toast";

interface Props {
  productoId: string;
  activo: boolean;
}

export function ProductosTableActions({ productoId, activo }: Props) {
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  const handleDuplicate = async () => {
    try {
      const res = await fetch(`/api/admin/productos/${productoId}/duplicar`, { method: "POST" });
      const result = await res.json();
      if (!result.success) { addToast(result.error, "error"); return; }
      addToast("Producto duplicado", "success");
      router.refresh();
    } catch {
      addToast("Error al duplicar producto", "error");
    }
  };

  const handleToggle = async () => {
    try {
      const res = await fetch(`/api/admin/productos/${productoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !activo }),
      });
      const result = await res.json();
      if (!result.success) { addToast(result.error, "error"); return; }
      addToast(activo ? "Producto desactivado" : "Producto activado", "success");
      router.refresh();
    } catch {
      addToast("Error al cambiar estado", "error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este producto definitivamente?")) return;
    try {
      const res = await fetch(`/api/admin/productos/${productoId}`, { method: "DELETE" });
      const result = await res.json();
      if (!result.success) { addToast(result.error, "error"); return; }
      addToast("Producto eliminado", "success");
      router.refresh();
    } catch {
      addToast("Error al eliminar producto", "error");
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/productos/${productoId}/editar`}>
        <Button variant="ghost" size="sm">Editar</Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleDuplicate}>Duplicar</Button>
      <Button variant="ghost" size="sm" onClick={handleToggle}>
        {activo ? "Desactivar" : "Activar"}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete} className="text-accent-secondary hover:text-accent-secondary">
        Eliminar
      </Button>
    </div>
  );
}
