# Esquema de Base de Datos

## Modelos (8 modelos)

### Producto
- `id` String (cuid) PK
- `nombre` String
- `slug` String @unique
- `descripcion` String?
- `precio` Decimal(10,2)
- `precioAntes` Decimal(10,2)? — para descuento
- `categoriaId` String FK → Categoria
- `destacado` Boolean default false
- `activo` Boolean default true
- `creadoEn` DateTime
- `actualizadoEn` DateTime
- Indexes: [categoriaId], [activo, destacado], [slug]

### Imagen
- `id` String (cuid) PK
- `url` String
- `publicId` String — ID en Cloudinary
- `orden` Int default 0
- `productoId` String FK → Producto (cascade)
- Index: [productoId]

### Variante
- `id` String (cuid) PK
- `productoId` String FK → Producto (cascade)
- `talla` String (S, M, L, XL, 38, 39, etc.)
- `color` String?
- `stock` Int default 0
- `sku` String?
- Unique: [productoId, talla, color]
- Index: [productoId]

### Categoria
- `id` String (cuid) PK
- `nombre` String @unique
- `slug` String @unique
- `imagenUrl` String?
- `orden` Int default 0
- `activa` Boolean default true
- Index: [slug]

### Pedido
- `id` String (cuid) PK
- `numero` Int @unique @default(autoincrement)
- `estado` EstadoPedido enum (default PENDIENTE)
- `estadoPago` EstadoPago enum (default PENDIENTE)
- `nombreCliente` String
- `telefono` String
- `email` String?
- `direccion` String?
- `total` Decimal(10,2) — SIEMPRE calculado en servidor
- `notas` String?
- `notasAdmin` String?
- `comprobante` String? — URL de captura de pago (opcional)
- `creadoEn` DateTime
- `actualizadoEn` DateTime
- `confirmadoEn` DateTime?
- Indexes: [estado, estadoPago], [creadoEn]

### ItemPedido
- `id` String (cuid) PK
- `pedidoId` String FK → Pedido (cascade)
- `varianteId` String FK → Variante
- `cantidad` Int
- `precioUnit` Decimal(10,2) — snapshot al momento de compra
- `nombreProducto` String — snapshot
- `imagenUrl` String? — snapshot
- `talla` String — snapshot
- `color` String? — snapshot
- `sku` String? — snapshot
- Index: [pedidoId]

### Configuracion
- `id` String (cuid) PK
- `clave` String @unique (ej: "qr_imagen_url", "whatsapp_numero", "nombre_negocio")
- `valor` String
- `descripcion` String?
- `actualizadoEn` DateTime

### Admin
- `id` String (cuid) PK
- `email` String @unique
- `passwordHash` String? (bcrypt 12 rounds)
- `nombre` String?
- `creadoEn` DateTime
- `ultimoAcceso` DateTime?

## Enums

### EstadoPedido
PENDIENTE | CONFIRMADO | EN_PREPARACION | ENVIADO | ENTREGADO | CANCELADO

### EstadoPago
PENDIENTE | EN_REVISION | CONFIRMADO | RECHAZADO
