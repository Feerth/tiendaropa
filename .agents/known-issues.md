# Known Issues & Technical Debt

## Issues conocidos (pre-producción audit — 20/6/2026 ✅)

### Resueltos en Fase 10

- ~~SOLD OUT en inglés~~ → "AGOTADO" (ProductCard)
- ~~LAST UNITS en inglés~~ → "ÚLTIMAS UNIDADES" (ProductCard)
- ~~Footer /categorias roto~~ → Página /categorías creada con grid de colecciones
- ~~Logo no usado~~ → Integrado en Header, Footer, y favicon
- ~~formatPrice inconsistente en /checkout/pago~~ → Usa formatPrice() ahora
- ~~Metadata faltante~~ → Agregada a home, contacto, pedido/[numero]
- ~~Dashboard sin pagos pendientes/ventas hoy~~ → Cards agregadas
- ~~Ruta categorias/[categoria] vacía~~ → Implementada con filtros
- ~~Sin favicon~~ → Configurado en root layout

### Pendientes

1. **Sin sincronización de carrito con servidor** — Estado en localStorage no persiste entre dispositivos
2. **Precios calculados en frontend** — El servidor recalcula al crear pedido, pero el carrito muestra precios locales
3. **Sin testing automatizado** — No hay unit tests ni e2e
4. **Cloudinary sin transformaciones** — Las imágenes no tienen sizes/quality optimizados
5. **Empty states en admin** — Tablas sin datos muestran texto plano
6. **Cart drawer mobile** — No hay slide-over panel para carrito en móvil
7. **Paginación de admin** — Tablas largas no tienen paginación (productos, pedidos)

## TODOs técnicos

- [ ] Agregar sincronización de carrito con API
- [ ] Configurar Cloudinary transforms automáticos
- [ ] Implementar tests unitarios con Vitest
- [ ] Implementar tests e2e con Playwright
- [ ] Agregar paginación en admin tables
- [ ] Crear cart drawer responsive para mobile
- [ ] Deploy a Vercel

## Deuda técnica

- Las imágenes de Cloudinary no tienen transformaciones de tamaño configuradas
- No hay testing automatizado (ni unit, ni e2e)
- El estado de carrito usa localStorage (Zustand persist) — no hay sync con servidor
