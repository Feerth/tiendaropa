# NOVASK — Tienda Online de Zapatillas

E-commerce de zapatillas con panel de administración, pagos por QR (Yape/Plin), tracking de pedidos, y gestión de inventario.

## Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Base de datos:** PostgreSQL (Supabase)
- **ORM:** Prisma 7 con driver adapter (`@prisma/adapter-pg`)
- **Auth:** NextAuth v5 (credentials, JWT 8h, solo admin)
- **Imágenes:** Cloudinary (validación por magic bytes)
- **Estado:** Zustand + localStorage (carrito)
- **Validación:** Zod v4 (cliente + servidor)
- **Deploy:** Vercel

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y completa con tus credenciales:

```bash
cp .env.example .env
```

Variables requeridas:
- `DATABASE_URL` — Connection string de Supabase PostgreSQL
- `NEXTAUTH_URL` — URL base (`http://localhost:3000` en dev)
- `NEXTAUTH_SECRET` — Generar con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_INSTAGRAM_USERNAME` — Usuario de Instagram (ej: `nov4sk_`)

### 3. Configurar base de datos

```bash
npx prisma migrate dev
```

### 4. Crear admin inicial (seed)

```bash
npx tsx prisma/seed.ts
```

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) para la tienda y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel.

## Estructura

```
app/
├── (store)/          # Tienda pública (home, productos, checkout, etc.)
├── (admin)/          # Panel de administración
├── api/              # API Routes (públicas + admin)
components/
├── store/            # Componentes de la tienda
├── admin/            # Componentes del admin
├── shared/           # Componentes compartidos (Button, Badge, Input, etc.)
lib/
├── services/         # Lógica de negocio (producto, pedido, stock, pago, config)
├── validations/      # Schemas Zod
├── utils/            # Utilidades (formatPrice, slugify, etc.)
stores/               # Zustand stores (carrito, toast)
prisma/               # Schema + migraciones + seed
types/                # TypeScript types compartidos
```

## Deploy en Vercel

1. Importar repo desde GitHub en [vercel.com/new](https://vercel.com/new)
2. Configurar variables de entorno en Vercel Dashboard (mismas que `.env`)
3. Asegurar que `NEXTAUTH_URL` apunte a tu dominio de Vercel
4. La primera vez, ejecutar las migraciones en Supabase y el seed manualmente

## Licencia

Proyecto privado. Todos los derechos reservados.
