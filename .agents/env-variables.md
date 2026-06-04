# Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (Supabase) con pgbouncer | ✅ |
| `NEXTAUTH_URL` | URL base de la app (http://localhost:3000 en dev, https://... en prod) | ✅ |
| `NEXTAUTH_SECRET` | Secret para JWT de NextAuth (openssl rand -base64 32) | ✅ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número WhatsApp (ej: 51931869696) — también configurable desde admin | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | ✅ |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | ✅ |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name público de Cloudinary para <Image> | ✅ |
| `QR_IMAGEN_URL` | URL inicial del QR (luego configurable desde admin → Configuración) | ❌ |
| `ADMIN_EMAIL` | Email del admin inicial (usado en seed) | ✅ (seed) |
| `ADMIN_PASSWORD` | Password del admin inicial (usado en seed) | ✅ (seed) |
| `KV_URL` | Vercel KV para rate limiting (opcional, actualmente usa Map en memoria) | ❌ |
| `KV_REST_API_URL` | Vercel KV REST API URL | ❌ |
| `KV_REST_API_TOKEN` | Vercel KV REST API token | ❌ |

**Nota:** `ADMIN_EMAIL` y `ADMIN_PASSWORD` solo se usan en seed. No hay variables de contraseña en runtime — todo se maneja via DB con bcrypt.
