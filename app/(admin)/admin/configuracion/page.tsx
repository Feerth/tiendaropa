"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useToastStore } from "@/stores/toast";

type ConfigMap = Record<string, string>;

export default function ConfiguracionPage() {
  const router = useRouter();
  const [config, setConfig] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetch("/api/admin/configuracion")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setConfig(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const result = await res.json();
      if (result.success) {
        addToast("Configuración guardada", "success");
        router.refresh();
      } else {
        addToast(result.error, "error");
      }
    } catch {
      addToast("Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setConfig((prev) => ({
          ...prev,
          qr_imagen_url: result.data.url,
        }));
        addToast("QR subido correctamente", "success");
      } else {
        addToast(result.error, "error");
      }
    } catch {
      addToast("Error al subir QR", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-text-muted">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-3xl text-text-primary">Configuración</h1>

      {/* QR de pago */}
      <section className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg text-text-primary">QR de pago</h2>
        <p className="text-xs text-text-muted">
          Esta imagen QR (Yape, Plin, transferencia) se mostrará en la pantalla de pago de los clientes.
        </p>

        <div className="flex items-center gap-6">
          <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle flex items-center justify-center">
            {config.qr_imagen_url ? (
              <img
                src={config.qr_imagen_url}
                alt="QR de pago"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-xs text-text-muted text-center px-2">
                Sin QR configurado
              </span>
            )}
          </div>

          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleQRUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0"
            />
            <div className="px-4 py-2 border border-border-default rounded-lg text-sm text-text-secondary hover:bg-bg-elevated transition-colors">
              {uploading ? "Subiendo..." : "Subir QR"}
            </div>
          </label>

          {config.qr_imagen_url && (
            <button
              onClick={() =>
                setConfig((prev) => {
                  const next = { ...prev };
                  delete next.qr_imagen_url;
                  return next;
                })
              }
              className="text-xs text-accent-secondary hover:underline"
            >
              Eliminar
            </button>
          )}
        </div>
      </section>

      {/* WhatsApp */}
      <section className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg text-text-primary">WhatsApp</h2>
        <Input
          label="Número de WhatsApp"
          value={config.whatsapp_numero ?? ""}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, whatsapp_numero: e.target.value }))
          }
          placeholder="51931869696"
          helperText="Código de país + número, sin + ni espacios"
        />
      </section>

      {/* Nombre del negocio */}
      <section className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg text-text-primary">Nombre del negocio</h2>
        <Input
          label="Nombre"
          value={config.nombre_negocio ?? ""}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, nombre_negocio: e.target.value }))
          }
          placeholder="ADNSTORE"
        />
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          GUARDAR CAMBIOS
        </Button>
      </div>
    </div>
  );
}
