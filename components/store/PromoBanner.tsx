"use client";

import { usePromoCountdown } from "@/hooks/usePromoCountdown";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function PromoBanner() {
  const { h, m, s } = usePromoCountdown();

  return (
    <div className="w-full bg-[#111111] border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-center gap-3 sm:gap-4">

        {/* Punto pulsante */}
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF00] promo-pulse-dot flex-shrink-0" />

        {/* Badge 2×1 */}
        <span
          className="bg-[#E8FF00] text-black px-3 py-0.5 rounded font-bold tracking-widest flex-shrink-0 leading-none"
          style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "18px" }}
        >
          2×1
        </span>

        {/* Texto de la promo — desktop */}
        <span className="text-[#F0F0F0] text-[13px] font-medium tracking-wide flex-shrink-0 hidden sm:block">
          Todos los modelos a{" "}
          <span className="text-[#E8FF00] font-bold">S/ 149.90</span>
          {" "}— lleva 2 pares
        </span>

        {/* Texto de la promo — mobile */}
        <span className="text-[#F0F0F0] text-xs font-medium flex-shrink-0 sm:hidden">
          2 pares a <span className="text-[#E8FF00] font-bold">S/ 149.90</span>
        </span>

        {/* Separador */}
        <div className="w-px h-6 bg-[#222222] flex-shrink-0 hidden sm:block" />

        {/* Countdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="uppercase tracking-wider flex-shrink-0 hidden sm:block"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: "11px", color: "#666" }}
          >
            Oferta termina en
          </span>

          <div className="flex items-center gap-1">
            {/* Horas */}
            <div
              className="text-[#E8FF00] text-center rounded px-1.5 py-0.5 min-w-[28px]"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "15px",
                fontWeight: 700,
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
              }}
            >
              {pad(h)}
            </div>
            <span className="text-[#444] font-mono text-sm font-bold">:</span>
            {/* Minutos */}
            <div
              className="text-[#E8FF00] text-center rounded px-1.5 py-0.5 min-w-[28px]"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "15px",
                fontWeight: 700,
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
              }}
            >
              {pad(m)}
            </div>
            <span className="text-[#444] font-mono text-sm font-bold">:</span>
            {/* Segundos */}
            <div
              className="text-[#E8FF00] text-center rounded px-1.5 py-0.5 min-w-[28px]"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "15px",
                fontWeight: 700,
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
              }}
            >
              {pad(s)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
