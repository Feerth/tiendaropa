"use client";

import { useState } from "react";
import Image from "next/image";
import { useToastStore } from "@/stores/toast";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ value, onChange, maxImages = 4 }: Props) {
  const [uploading, setUploading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        onChange([...value, result.data.url]);
        addToast("Imagen subida correctamente", "success");
      } else {
        addToast(result.error, "error");
      }
    } catch {
      addToast("Error al subir imagen", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {value.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden bg-bg-secondary border border-border-subtle group"
          >
            <Image
              src={url}
              alt={`Imagen ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 120px"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-secondary"
              aria-label={`Eliminar imagen ${index + 1}`}
            >
              ✕
            </button>
          </div>
        ))}

        {value.length < maxImages && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-border-default hover:border-accent-primary hover:bg-bg-elevated transition-all cursor-pointer flex items-center justify-center bg-bg-secondary/50 group">
            {uploading ? (
              <span className="text-xs text-text-muted animate-pulse">Subiendo...</span>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl text-text-muted group-hover:text-accent-primary transition-colors">+</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Subir</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        )}
      </div>
    </div>
  );
}
