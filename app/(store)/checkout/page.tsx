"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const [form, setForm] = useState({
    nombreCliente: "",
    telefono: "",
    email: "",
    direccion: "",
    notas: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-5xl text-text-primary mb-4">CARRITO VACÍO</h1>
        <p className="text-text-secondary mb-8">Agrega productos antes de comprar.</p>
        <Link href="/productos">
          <Button size="lg">VER PRODUCTOS</Button>
        </Link>
      </div>
    );
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "nombreCliente":
        return value.trim().length < 2 ? "Mínimo 2 caracteres" : "";
      case "telefono":
        return !/^[0-9]{9,15}$/.test(value.replace(/\s/g, ""))
          ? "Teléfono inválido (9 dígitos)"
          : "";
      case "email":
        return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Email inválido"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const newErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(form)) {
      if (key === "email") continue;
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    }

    if (!form.telefono.replace(/\s/g, "")) {
      newErrors.telefono = "El teléfono es requerido";
    }
    if (!form.nombreCliente.trim()) {
      newErrors.nombreCliente = "El nombre es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCliente: form.nombreCliente.trim(),
          telefono: form.telefono.replace(/\s/g, ""),
          email: form.email.trim() || undefined,
          direccion: form.direccion.trim() || undefined,
          notas: form.notas.trim() || undefined,
          items: items.map((i) => ({
            varianteId: i.varianteId,
            cantidad: i.cantidad,
          })),
        }),
      });

      const result = await res.json();

      if (!result.success) {
        if (result.code === "INSUFFICIENT_STOCK") {
          setServerError(
            `Stock insuficiente. Actualiza tu carrito e intenta de nuevo.`
          );
        } else {
          setServerError(result.error || "Error al procesar el pedido");
        }
        return;
      }

      clearCart();
      router.push(`/checkout/pago?numero=${result.data.numero}&id=${result.data.id}&total=${result.data.total}`);
    } catch {
      setServerError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-5xl text-text-primary mb-8">CHECKOUT</h1>

      {serverError && (
        <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-xl p-4 mb-6">
          <p className="text-sm text-accent-secondary">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4">
            <h2 className="font-display text-xl text-text-primary">Tus datos</h2>

            <Input
              label="Nombre completo *"
              value={form.nombreCliente}
              onChange={(e) => handleChange("nombreCliente", e.target.value)}
              placeholder="Ej: Juan Pérez"
              error={errors.nombreCliente}
              required
            />

            <Input
              label="Teléfono *"
              value={form.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              placeholder="Ej: 999888777"
              error={errors.telefono}
              helperText="Válido para contacto y WhatsApp"
              required
            />

            <Input
              label="Email (opcional)"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="ejemplo@correo.com"
              error={errors.email}
            />

            <Input
              label="Dirección (opcional)"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              placeholder="Av. Siempre Viva 123"
              error={errors.direccion}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">
                Notas adicionales
              </label>
              <textarea
                value={form.notas}
                onChange={(e) => handleChange("notas", e.target.value)}
                rows={3}
                className="w-full bg-bg-input border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary resize-none"
                placeholder="¿Alguna indicación especial?"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-6 space-y-4 sticky top-24">
            <h2 className="font-display text-xl text-text-primary">Resumen</h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.varianteId} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg-secondary shrink-0">
                    {item.imagen ? (
                      <Image src={item.imagen} alt={item.nombre} fill className="object-cover" sizes="50px" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-text-muted">ADN</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{item.nombre}</p>
                    <p className="text-xs text-text-muted">
                      Talla: {item.talla} x{item.cantidad}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-text-primary">
                    {formatPrice(item.precio * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border-subtle pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-primary">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-text-primary">Total</span>
                <span className="font-mono text-accent-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <p className="text-xs text-text-muted text-center">
              El total se confirma al procesar el pedido
            </p>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              CONFIRMAR PEDIDO
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
