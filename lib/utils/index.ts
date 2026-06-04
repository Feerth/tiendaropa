export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPrice(price: number): string {
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
    message += `${i + 1}. ${item.nombre} - Talla: ${item.talla} x${item.cantidad} = S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
  });

  message += `\nTotal: S/ ${total.toFixed(2)}`;

  if (nombreCliente) {
    message += `\nCliente: ${nombreCliente}`;
  }

  return encodeURIComponent(message);
}

export function getWhatsAppUrl(
  phone: string,
  message: string
): string {
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`;
}
