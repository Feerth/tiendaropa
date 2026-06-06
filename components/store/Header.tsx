"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart";

function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

const navLinks = [
  { key: "productos", href: "/productos", label: "PRODUCTOS" },
  { key: "ofertas", href: "/productos?enOferta=true", label: "OFERTAS", isOferta: true },
  { key: "novedades", href: "/productos?ordenar=nuevos", label: "NOVEDADES" },
];

function isActive(pathname: string, currentSearch: string, href: string) {
  const [hrefPath, hrefQuery] = href.split("?");
  if (pathname !== hrefPath) return false;
  if (!hrefQuery) return true;
  const currentParams = new URLSearchParams(currentSearch);
  const hrefParams = new URLSearchParams(hrefQuery);
  for (const [key, value] of hrefParams) {
    if (currentParams.get(key) !== value) return false;
  }
  return true;
}

export function StoreHeader() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const pathname = usePathname();
  const scrolled = useScrollState();
  const itemsCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.cantidad, 0));

  useEffect(() => {
    setMounted(true);
    setCurrentSearch(window.location.search);
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
    <>
      <header className={`sticky top-0 z-40 bg-bg-primary/90 backdrop-blur-md transition-all duration-300 ${scrolled ? "border-b border-border-subtle" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logo/NOVASK_logo.png"
                alt="NOVASK"
                width={160}
                height={160}
                className="h-14 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`relative text-sm font-medium uppercase tracking-[0.05em] transition-colors ${
                    isActive(pathname, currentSearch, link.href)
                      ? "text-accent-primary"
                      : link.isOferta
                        ? "text-accent-secondary hover:text-accent-secondary/80"
                        : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                  {isActive(pathname, currentSearch, link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/carrito"
                className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Carrito de compras"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      </header>

      {/* Mobile menu overlay & sidebar */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`relative w-[85vw] max-w-sm h-full bg-bg-secondary border-l border-border-subtle shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="flex items-center justify-between h-16 px-6 border-b border-border-subtle shrink-0">
              <span className="font-display tracking-widest text-lg text-text-primary">MENÚ</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2 text-text-secondary hover:text-accent-primary transition-colors"
                aria-label="Cerrar menú"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-8 px-6">
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-2xl font-display tracking-widest uppercase transition-all duration-200 flex items-center justify-between group ${
                      isActive(pathname, currentSearch, link.href)
                        ? "text-accent-primary"
                        : link.isOferta
                          ? "text-accent-secondary hover:text-accent-secondary/80"
                          : "text-text-primary hover:text-accent-primary"
                    }`}
                  >
                    {link.label}
                    <svg className={`w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 ${isActive(pathname, currentSearch, link.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-6 border-t border-border-subtle bg-bg-elevated shrink-0">
              <Link
                href="/carrito"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-4 rounded-xl bg-bg-card hover:bg-[#222] border border-border-subtle hover:border-accent-primary/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <svg className="text-text-secondary group-hover:text-accent-primary transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="21" r="1" /><circle cx="21" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a1 1 0 0 0 1 .61h9.72a1 1 0 0 0 1-.79L23 6H6" />
                  </svg>
                  <span className="font-medium text-text-primary tracking-wide">CARRITO</span>
                </div>
                {mounted && itemsCount > 0 && (
                  <span className="w-6 h-6 bg-accent-primary text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {itemsCount > 9 ? "9+" : itemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
    </>
  );
}
