import Link from "next/link";
import Image from "next/image";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function StoreFooter() {
  return (
    <footer className="bg-bg-secondary border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/logo/NOVASK_logo.png"
              alt="NOVASK"
              width={180}
              height={180}
              className="h-16 w-auto mb-4"
            />
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Tienda online de zapatillas originales. 
              Envíos a todo Perú con las mejores marcas.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/nov4sk_" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://tiktok.com/@novask.pe" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200" aria-label="TikTok">
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="font-medium text-text-primary mb-4 uppercase tracking-[0.08em] text-xs">Tienda</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/productos" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Colecciones
                </Link>
              </li>
              <li>
                <Link href="/productos?enOferta=true" className="text-sm text-accent-secondary hover:text-accent-secondary/80 transition-colors">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="font-medium text-text-primary mb-4 uppercase tracking-[0.08em] text-xs">Información</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/como-comprar" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Cómo comprar
                </Link>
              </li>
              <li>
                <Link href="/pagos" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Pagos con QR
                </Link>
              </li>
              <li>
                <Link href="/cambios" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Cambios y devoluciones
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Envíos a todo Perú
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-medium text-text-primary mb-4 uppercase tracking-[0.08em] text-xs">Contacto</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/60" />
                WhatsApp: +51 931 869 696
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/60" />
                IG: @nov4sk_
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/60" />
                Envío rápido a todo el Perú
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/60" />
                Pago seguro — Yape / Plin / Transferencia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} NOVASK. Todos los derechos reservados.</p>
          <p className="text-text-muted/60">Hecho en Perú 🇵🇪</p>
        </div>
      </div>
    </footer>
  );
}
