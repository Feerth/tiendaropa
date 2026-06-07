# Reglas de Negocio

## Stock
- El stock nunca baja de 0 (validación en backend con transacciones atómicas y frontend)
- Si stock = 0: badge "AGOTADO", botón de compra deshabilitado
- Si stock > 0 y ≤ 5: badge "ÚLTIMAS UNIDADES" con pulso rojo animado
- Modificar stock requiere sesión admin activa
- La reserva de stock se hace en `prisma.$transaction` con decrement y verificación de negativo
- Si un pedido se cancela, el stock debe restaurarse (TODO)

## Precios
- `precio` es obligatorio y debe ser > 0
- `precioAntes` es opcional; si existe, se muestra tachado junto al precio actual con badge de % descuento
- Todos los precios en Soles (PEN), formateados con Intl.NumberFormat es-PE
- El total del pedido SIEMPRE se calcula en servidor, NUNCA se confía en el precio del cliente

## Estados de Pedido (EstadoPedido)
1. PENDIENTE → recién creado vía checkout
2. CONFIRMADO → admin confirmó pago
3. EN_PREPARACION → preparando para envío
4. ENVIADO → ya salió
5. ENTREGADO → cliente recibió
6. CANCELADO → se cancela

## Estados de Pago (EstadoPago)
1. PENDIENTE → pedido creado, no ha pagado
2. EN_REVISION → cliente dice que pagó, admin debe verificar
3. CONFIRMADO → admin verificó y confirmó el pago
4. RECHAZADO → admin rechazó el pago (con nota obligatoria)

## Flujo de Pago QR
1. Cliente crea pedido vía `/checkout` → estadoPedido: PENDIENTE, estadoPago: PENDIENTE
2. Cliente paga (escanea QR Yape/Plin) y presiona "YA PAGUÉ" → estadoPago: EN_REVISION
3. Admin revisa en `/admin/pedidos/[id]` → modal PaymentConfirmModal
4. Admin CONFIRMA: estadoPago: CONFIRMADO, estadoPedido: CONFIRMADO, confirmadoEn: now()
5. Admin RECHAZA: estadoPago: RECHAZADO, requiere nota obligatoria
6. Badge pulsante amarillo cuando estadoPago = EN_REVISION

## Roles
- Solo existe un rol: ADMIN
- No hay registro público de usuarios
- El admin se crea vía seed con email y contraseña hasheada (bcrypt 12 rounds)
- Rate limiting en login: 5 intentos / 15 min por IP

## Instagram
- Usuario configurable via NEXT_PUBLIC_INSTAGRAM_USERNAME y desde panel admin (Configuración)
- Formato: nombre de usuario sin @ (ej: nov4sk_)
- Botón flotante visible en TODAS las páginas públicas
- Al enviar pedido/consulta: se copia el mensaje al portapapeles y se abre el DM de Instagram
- Mensaje de carrito incluye: producto, talla, cantidad, precio unitario, subtotal, total
- Mensaje de pago incluye: número de pedido, monto, solicitud de confirmación

## QR de Pago
- La imagen QR se administra desde Admin → Configuración
- Se guarda en Cloudinary y URL en tabla Configuracion con clave "qr_imagen_url"
- La página /checkout/pago carga el QR dinámicamente
- Si no hay QR configurado, se muestra mensaje de contacto por Instagram

## Imágenes
- Solo se permiten JPEG, PNG y WebP (validado por magic bytes, no por extensión)
- Tamaño máximo: 5MB por imagen
- Cloudinary como único proveedor de imágenes
- Validación MIME en servidor antes de subir

## Promo 2×1
- Cliente lleva 2 pares de cualquier modelo por S/ 149.90
- El timer es de 16 horas y se reinicia automáticamente (siempre activo)
- Persistencia en localStorage para que no se reinicie al recargar la página
- Banner permanente entre navbar y contenido en todas las páginas de tienda
- Primera versión: el cliente indica los 2 pares en notas del checkout
