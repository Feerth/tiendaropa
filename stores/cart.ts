import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (varianteId: string) => void;
  updateQuantity: (varianteId: string, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.varianteId === item.varianteId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.varianteId === item.varianteId
                ? { ...i, cantidad: Math.min(i.cantidad + item.cantidad, i.stockDisponible) }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (varianteId) => {
        set({ items: get().items.filter((i) => i.varianteId !== varianteId) });
      },

      updateQuantity: (varianteId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(varianteId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.varianteId === varianteId
              ? { ...i, cantidad: Math.min(cantidad, i.stockDisponible) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },
    }),
    {
      name: "tienda-ropa-cart",
    }
  )
);
