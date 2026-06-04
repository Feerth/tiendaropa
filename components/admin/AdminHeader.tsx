"use client";

import { signOut } from "next-auth/react";
import { useAdmin } from "./AdminContext";

export function AdminHeader() {
  const { toggleSidebar } = useAdmin();

  return (
    <header className="h-16 border-b border-border-subtle flex items-center justify-between px-6 lg:px-8 bg-bg-primary">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 text-text-secondary hover:text-text-primary"
          aria-label="Abrir menú"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="font-display text-lg text-accent-primary">ADNSTORE ADMIN</span>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-elevated"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </button>
    </header>
  );
}
