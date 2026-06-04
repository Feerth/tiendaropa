"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 mx-auto rounded-full bg-accent-secondary/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-text-primary">Error del sistema</h2>
        <p className="text-text-secondary text-sm">
          Ocurrió un error inesperado. Revisa la consola para más detalles.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-accent-primary text-black font-bold rounded-lg hover:brightness-110 transition-all font-display tracking-wider"
        >
          REINTENTAR
        </button>
      </div>
    </div>
  );
}
