"use client";

import { useState, useEffect, useCallback } from "react";

interface InstagramMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  igUsername: string;
}

export function InstagramMessageModal({
  isOpen,
  onClose,
  message,
  igUsername,
}: InstagramMessageModalProps) {
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
  }, [message]);

  const handleOpenInstagram = () => {
    const cleaned = igUsername.replace(/^@/, "");
    window.open(`https://ig.me/m/${cleaned}`, "_blank");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        animateIn ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md bg-bg-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          animateIn
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Header with Instagram gradient bar */}
        <div
          className="h-1"
          style={{
            background: "linear-gradient(90deg, #833AB4, #E1306C, #F77737)",
          }}
        />

        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg text-text-primary">
                  Enviar por Instagram
                </h3>
                <p className="text-xs text-text-muted">@{igUsername.replace(/^@/, "")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
              !copied
                ? "bg-accent-primary/20 text-accent-primary"
                : "bg-accent-tertiary/20 text-accent-tertiary"
            }`}>
              {copied ? "✓" : "1"}
              <span>Copiar</span>
            </div>
            <div className="w-6 h-px bg-border-default" />
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
              copied
                ? "bg-[#E1306C]/20 text-[#E1306C]"
                : "bg-bg-elevated text-text-muted"
            }`}>
              2
              <span>Enviar</span>
            </div>
          </div>

          {/* Message preview */}
          <div className="relative">
            <div className="bg-bg-secondary rounded-xl p-4 text-sm text-text-secondary whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-border-subtle">
              {message}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            {!copied ? (
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-primary text-black font-bold rounded-xl text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 font-display tracking-wider"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                COPIAR MENSAJE
              </button>
            ) : (
              <button
                onClick={handleOpenInstagram}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 font-display tracking-wider animate-fade-in-up"
                style={{
                  background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                ABRIR INSTAGRAM Y PEGAR
              </button>
            )}

            {copied && (
              <p className="text-xs text-accent-tertiary text-center animate-fade-in-up">
                ✓ Mensaje copiado — pégalo en el chat de Instagram
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
