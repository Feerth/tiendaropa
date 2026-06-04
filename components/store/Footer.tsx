import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="bg-bg-secondary border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl text-accent-primary mb-4">
              ADNSTORE
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tu tienda de ropa y zapatillas con estilo urbano. 
              Las mejores marcas al mejor precio.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=ropa" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Ropa
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=zapatillas" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Zapatillas
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text-primary mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>WhatsApp: +51 931 869 696</li>
              <li>Envio rápido a todo el Perú</li>
              <li>Pago seguro</li>
              <li>Atención personalizada</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-8 pt-8 text-center text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} ADNSTORE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
