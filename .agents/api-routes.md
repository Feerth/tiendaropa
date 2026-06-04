# API Routes

## Rutas Públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos` | Lista paginada con filtros (categoria, activo, destacado, buscar, ordenar, page, limit) |
| GET | `/api/productos/[slug]` | Detalle de producto con variantes y relacionados |
| GET | `/api/categorias` | Lista de categorías |
| POST | `/api/checkout` | Crear pedido con transacción atómica de stock. Recalcula precios en servidor. Body: { nombreCliente, telefono, email?, direccion?, notas?, items[] } |
| POST | `/api/pedidos` | Crear pedido (legacy, desde WhatsApp flow) |

## Rutas Admin (requieren sesión)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/productos` | Lista completa para admin |
| POST | `/api/admin/productos` | Crear producto |
| PUT | `/api/admin/productos/[id]` | Actualizar producto |
| DELETE | `/api/admin/productos/[id]` | Eliminar producto |
| GET/POST | `/api/admin/categorias` | Listar/crear categorías |
| DELETE | `/api/admin/categorias/[id]` | Eliminar categoría |
| GET | `/api/admin/stock` | Vista de inventario |
| PATCH | `/api/admin/stock/[varianteId]` | Actualizar stock puntual |
| GET | `/api/admin/pedidos` | Lista de pedidos |
| PATCH | `/api/admin/pedidos/[id]` | Actualizar estado y/o estadoPago del pedido |
| PATCH | `/api/admin/pedidos/[id]/confirmar-pago` | Confirmar (CONFIRMAR) o rechazar (RECHAZAR) pago. Transacción atómica |
| GET | `/api/admin/dashboard` | Métricas del dashboard |
| GET/PUT | `/api/admin/configuracion` | Obtener/actualizar configuración (QR, WhatsApp, nombre negocio) |
| POST | `/api/admin/upload` | Subir imagen a Cloudinary con validación de magic bytes |

## Formato de respuesta
```typescript
// Éxito
{ success: true, data: {...} }

// Error
{ success: false, error: "Mensaje", code: "ERROR_CODE" }
```
