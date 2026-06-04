"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart";

export function StoreHeader() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemsCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.cantidad, 0));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-2xl tracking-wider text-accent-primary hover:text-accent-primary/80 transition-colors"
          >
            ADNSTORE
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/productos"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Productos
            </Link>
            <Link
              href="/productos?categoria=ropa"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Ropa
            </Link>
            <Link
              href="/productos?categoria=zapatillas"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Zapatillas
            </Link>
            <Link
              href="/productos?categoria=ofertas"
              className="text-sm font-medium text-accent-secondary hover:text-accent-secondary/80 transition-colors"
            >
              Ofertas
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/carrito"
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Carrito de compras"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="21" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a1 1 0 0 0 1 .61h9.72a1 1 0 0 0 1-.79L23 6H6" />
              </svg>
              {mounted && itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-primary text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {itemsCount > 9 ? "9+" : itemsCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-bg-primary border-l border-border-subtle shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-border-subtle">
              <span className="font-display text-lg text-accent-primary">ADNSTORE</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary"
                aria-label="Cerrar menú"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="p-6 space-y-4">
              <Link
                href="/productos"
                onClick={() => setMenuOpen(false)}
                className="block text-lg text-text-primary hover:text-accent-primary transition-colors font-display tracking-wider"
              >
                TODOS LOS PRODUCTOS
              </Link>
              <Link
                href="/productos?categoria=ropa"
                onClick={() => setMenuOpen(false)}
                className="block text-lg text-text-secondary hover:text-accent-primary transition-colors font-display tracking-wider"
              >
                ROPA
              </Link>
              <Link
                href="/productos?categoria=zapatillas"
                onClick={() => setMenuOpen(false)}
                className="block text-lg text-text-secondary hover:text-accent-primary transition-colors font-display tracking-wider"
              >
                ZAPATILLAS
              </Link>
              <Link
                href="/productos?categoria=accesorios"
                onClick={() => setMenuOpen(false)}
                className="block text-lg text-text-secondary hover:text-accent-primary transition-colors font-display tracking-wider"
              >
                ACCESORIOS
              </Link>
              <Link
                href="/productos?categoria=ofertas"
                onClick={() => setMenuOpen(false)}
                className="block text-lg text-accent-secondary hover:text-accent-secondary/80 transition-colors font-display tracking-wider"
              >
                OFERTAS
              </Link>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border-subtle">
              <Link
                href="/carrito"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" /><circle cx="21" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a1 1 0 0 0 1 .61h9.72a1 1 0 0 0 1-.79L23 6H6" />
                </svg>
                Carrito {mounted && itemsCount > 0 ? `(${itemsCount})` : ""}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
