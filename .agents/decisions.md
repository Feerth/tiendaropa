# Decisiones Arquitectónicas (ADR simplificado)

## ADR-001: Flujo de compras vía WhatsApp (reemplazado por ADR-005)
**Contexto:** Sin pasarela de pago integrada. Negocio pequeño/mediano.
**Decisión original:** El checkout envía un mensaje detallado vía WhatsApp. Pedidos solo para tracking.
**Estado:** Reemplazado por ADR-005 (flujo checkout completo con QR).

## ADR-002: Dos layouts separados
**Contexto:** Tienda pública y admin tienen diseños, headers y footer completamente diferentes.
**Decisión:** Usar Route Groups: `(store)` para la tienda pública, `(admin)` para el panel admin. Cada grupo tiene su propio layout.
**Consecuencia:** Separación limpia de estilos y componentes. El middleware protege solo las rutas `/(admin)/*`.

## ADR-003: Productos agotados siempre visibles
**Contexto:** Los productos sin stock no deben ocultarse del catálogo (SEO, experiencia de usuario).
**Decisión:** Se muestran con badge "SOLD OUT" y no se pueden agregar al carrito. El botón de compra se deshabilita.
**Consecuencia:** Mejor SEO, transparencia con el cliente.

## ADR-004: Supabase sobre Neon.tech
**Decisión:** Supabase por ecosistema más completo (auth, storage, SQL editor web), mejor plan gratuito.

## ADR-005: Flujo checkout completo con QR (2026-06-03)
**Contexto:** Necesidad de un flujo de compra más estructurado que solo WhatsApp.
**Decisión:** Implementar checkout con formulario → creación de pedido en DB → página de pago con QR → admin confirma/rechaza.
**Componentes nuevos:** `/checkout`, `/checkout/pago`, `/pedido/[numero]`, admin config + confirmación.
**Consecuencia:** Mayor control sobre pedidos, trazabilidad completa. El carrito sigue siendo frontend (Zustand), pero el pedido se persiste en DB con transacción atómica de stock.

## ADR-006: Transacciones atómicas para stock (2026-06-03)
**Contexto:** Race conditions en stock cuando múltiples usuarios compran el mismo producto.
**Decisión:** Toda operación que modifica stock usa `prisma.$transaction`. El código verifica stock >= cantidad antes de decrementar, y si queda negativo revierte la transacción.
**Consecuencia:** Stock siempre consistente, sin sobreventa.

## ADR-007: Proxy.ts (Next.js 16) sobre middleware.ts
**Contexto:** Next.js 16 ya no soporta middleware.ts tradicional para auth.
**Decisión:** Usar `proxy.ts` con NextAuth wrapper para proteger rutas admin.
**Consecuencia:** Sigue el patrón recomendado por Next.js 16. Matcher protege `/admin/:path*` y `/login`.

## ADR-008: Precios siempre del servidor
**Contexto:** El precio del producto podría ser manipulado por el cliente.
**Decisión:** El checkout ignora precios enviados por el cliente. Siempre busca el precio actual del producto en DB y recalcula el total.
**Consecuencia:** Seguridad de precios. El cliente no puede comprar a precio incorrecto ni siquiera accidentalmente.

## ADR-009: Magic bytes sobre extensión de archivo
**Contexto:** Validación de tipo de imagen por extensión es fácil de falsear.
**Decisión:** Validar los primeros bytes del archivo (magic bytes: 0xFFD8 para JPEG, 0x8950 para PNG, 0x52494646 para WebP).
**Consecuencia:** Protección contra subida de archivos maliciosos disfrazados de imágenes.
