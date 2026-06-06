import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 mx-auto rounded-full bg-accent-primary/10 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h1 className="font-display text-5xl text-text-primary tracking-wider">404</h1>
        <p className="text-text-secondary text-base">Página no encontrada</p>
        <p className="text-text-muted text-sm">La página que buscas no existe o fue movida.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 bg-[#E8FF00] text-black font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-[#E8FF00]/90 transition-all duration-200"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
