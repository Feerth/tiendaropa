# TiendaRopa — E-commerce de Ropa y Zapatillas (Dark Editorial Bold)
**Nombre del negocio:** NOVASK (configurable desde admin)

## Stack
- **Frontend:** Next.js 16 (App Router) + TypeScript strict
- **Estilos:** Tailwind CSS v4 + CSS custom properties (tokens dark)
- **Base de datos:** PostgreSQL via Supabase
- **ORM:** Prisma 7 con transacciones atómicas en escrituras críticas
- **Autenticación:** NextAuth v5 (credentials, solo admin, JWT 8h)
- **Imágenes:** Cloudinary + validación MIME por magic bytes
- **Estado global:** Zustand + persist middleware (localStorage)
- **Validación:** Zod v4 — cliente y servidor (nunca confiar en cliente)
- **Forms:** React Hook Form
- **Deploy:** Vercel (proxy.ts para protección /admin)
- **Utilidades:** date-fns, nanoid (planeado)

## Decisiones arquitectónicas
- Dos layouts separados: (store) público y (admin) protegido
- Route Groups: `(store)` para tienda, `(admin)` para panel
- API routes con patrón { success, data } / { success, error, code }
- Lógica de negocio en servicios (SRP: Producto, Stock, Pedido, Pago, Configuracion)
- Precios siempre recalculados en servidor — NUNCA del cliente
- Stock con transacciones atómicas (race condition seguro)
- Flujo de compra: checkout → QR payment → admin confirma → timeline tracking
- Productos agotados visibles pero no comprables (SEO + transparencia)
- Carrito solo frontend (Zustand + localStorage), pedidos en DB
- Edge Middleware (proxy.ts) para protección /admin
- 9 modelos Prisma: Producto, Imagen, Variante, Marca, Categoria, Pedido, ItemPedido, Configuracion, Admin
