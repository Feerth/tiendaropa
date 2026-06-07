"use client";

interface InstagramButtonProps {
  className?: string;
  username?: string;
}

export function InstagramButton({ className = "", username }: InstagramButtonProps) {
  const igUser = username || process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "nov4sk_";
  const url = `https://ig.me/m/${igUser.replace(/^@/, "")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      {/* Desktop: icon-only circle + tooltip */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por Instagram"
        className={`
          group/tooltip relative
          hidden md:flex items-center justify-center
          w-14 h-14
          rounded-full
          shadow-lg shadow-[#E1306C]/30
          hover:scale-105 hover:shadow-xl hover:shadow-[#E1306C]/40
          active:scale-95
          transition-all duration-200 ease-out
          ${className}
        `}
        style={{
          background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>

        {/* Tooltip desktop */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-bg-elevated text-text-primary text-xs font-medium border border-border-subtle opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
          ¡ESCRÍBENOS!
        </span>
      </a>

      {/* Mobile: full label */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden flex items-center gap-2 pl-4 pr-5 h-12 rounded-full shadow-lg shadow-[#E1306C]/30 hover:scale-105 active:scale-95 transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        <span className="font-display text-sm tracking-wider text-white">
          ¡ESCRÍBENOS!
        </span>
      </a>
    </div>
  );
}
