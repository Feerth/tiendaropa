export function calcularTotalConPromo(
  items: Array<{ precio: number; cantidad: number }>
): { subtotal: number; total: number; descuento: number } {
  // Expandir todas las unidades individuales con su precio
  const allPrices: number[] = [];
  for (const item of items) {
    for (let i = 0; i < item.cantidad; i++) {
      allPrices.push(item.precio);
    }
  }

  // Ordenar de mayor a menor precio para agrupar los más caros en la promo
  allPrices.sort((a, b) => b - a);

  let subtotal = 0;
  let total = 0;

  for (let i = 0; i < allPrices.length; i += 2) {
    const precio1 = allPrices[i];
    subtotal += precio1;

    if (i + 1 < allPrices.length) {
      const precio2 = allPrices[i + 1];
      subtotal += precio2;
      
      // Si los 2 pares suman más de 149.90, aplicamos la promo
      const sumaPar = precio1 + precio2;
      total += Math.min(sumaPar, 149.90);
    } else {
      // Un par impar, se cobra precio normal
      total += precio1;
    }
  }

  return {
    subtotal,
    total,
    descuento: subtotal - total,
  };
}
