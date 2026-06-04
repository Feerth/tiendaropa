# Known Issues & Technical Debt

## Issues conocidos

1. **Sin magic bytes validation** — El upload de imágenes solo verifica extensión, no contenido real (MIME spoofing posible). Pendiente implementar en lib/cloudinary.ts.

2. **Sin flujo QR completo** — El carrito envía directo a WhatsApp. No hay página de checkout, pago QR, ni timeline de pedido. Pendiente implementar: /checkout, /checkout/pago, /pedido/[numero].

3. **Admin sin página de configuración** — La tabla Configuracion existe en DB pero no hay UI para gestionar QR, WhatsApp number, nombre del negocio.

4. **Sin confirmación de pago admin** — Los pedidos con estadoPago EN_REVISION no tienen modal de confirmación/rechazo.

5. **AdminSidebar sin link a Configuración** — El sidebar tiene Dashboard, Productos, Inventario, Pedidos, Categorías pero falta Configuración.

6. **Home no sigue diseño v3.0** — Hero es centrado simple, falta layout split, categorías sin imagen, faltan secciones editoriales (STYLE-STACK, Más Recomendados).

7. **ProductCard sin botones duales** — Actualmente es un solo link, no tiene "AGREGAR" + "VER" al estilo Converse.

8. **Sin vercel.json** — Los security headers CSP están parcialmente en next.config.ts pero falta configuración completa.

9. **Sin empty states en admin** — Las tablas de productos, pedidos y categorías no muestran estado vacío informativo.

## TODOs técnicos

- [ ] Implementar magic bytes validation en upload de imágenes
- [ ] Crear página /checkout con formulario y validación Zod
- [ ] Crear página /checkout/pago con QR dinámico
- [ ] Crear página /pedido/[numero] con timeline de estados
- [ ] Crear admin /configuracion con QR upload
- [ ] Crear modal de confirmación de pago
- [ ] Agregar link Configuración al AdminSidebar
- [ ] Rediseñar home con las 6 secciones del v3.0
- [ ] Rediseñar ProductCard con dos botones
- [ ] Agregar vercel.json con CSP headers completos
- [ ] Agregar empty states en admin tables
- [ ] Deploy a Vercel

## Deuda técnica

- El estado de carrito usa localStorage (Zustand persist) — no hay sincronización con servidor
- Los precios se calculan en frontend para el carrito, pero el servidor los recalcula al crear pedido
- No hay testing automatizado (ni unit, ni e2e)
- Las imágenes de Cloudinary no tienen transformaciones de tamaño configuradas
