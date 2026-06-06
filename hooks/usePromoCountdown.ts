"use client";

import { useState, useEffect } from "react";

const DURATION_MS = 16 * 60 * 60 * 1000; // 16 horas en ms
const STORAGE_KEY = "novask_promo_end";

export function usePromoCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 16, m: 0, s: 0 });

  useEffect(() => {
    function getEndTime(): number {
      const stored = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();

      if (stored) {
        const end = parseInt(stored, 10);
        if (end > now) return end;
      }

      // No hay timer activo o expiró — crear uno nuevo
      const newEnd = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, newEnd.toString());
      return newEnd;
    }

    function tick() {
      const now = Date.now();
      const end = getEndTime();
      let remaining = end - now;

      if (remaining <= 0) {
        // Expiró — limpiar y reiniciar
        localStorage.removeItem(STORAGE_KEY);
        remaining = DURATION_MS;
      }

      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);

      setTimeLeft({ h, m, s });
    }

    tick(); // ejecutar inmediatamente
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
