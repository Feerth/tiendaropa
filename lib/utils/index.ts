export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "producto";
}

export function formatPrice(price: number): string {
  if (!Number.isFinite(price)) return "S/ 0.00";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateWhatsAppMessage(
  items: { nombre: string; talla: string; cantidad: number; precio: number }[],
  total: number,
  nombreCliente?: string
): string {
  let message = "¡Hola! Quiero hacer el siguiente pedido:\n\n";

  items.forEach((item, i) => {
    const subtotal = Number.isFinite(item.precio)
      ? (item.precio * item.cantidad).toFixed(2)
      : "0.00";
    message += `${i + 1}. ${item.nombre} - Talla: ${item.talla} x${item.cantidad} = S/ ${subtotal}\n`;
  });

  const totalStr = Number.isFinite(total) ? total.toFixed(2) : "0.00";
  message += `\nTotal: S/ ${totalStr}`;

  if (nombreCliente) {
    message += `\nCliente: ${nombreCliente}`;
  }

  return encodeURIComponent(message);
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}?text=${message}`;
}
