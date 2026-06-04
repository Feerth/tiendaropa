import { create } from "zustand";

type FiltersStore = {
  categoria: string | null;
  talla: string | null;
  precioMin: number | null;
  precioMax: number | null;
  ordenar: string;
  page: number;
  setCategoria: (categoria: string | null) => void;
  setTalla: (talla: string | null) => void;
  setPrecioMin: (precio: number | null) => void;
  setPrecioMax: (precio: number | null) => void;
  setOrdenar: (orden: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  categoria: null,
  talla: null,
  precioMin: null,
  precioMax: null,
  ordenar: "nuevos",
  page: 1,

  setCategoria: (categoria) => set({ categoria, page: 1 }),
  setTalla: (talla) => set({ talla, page: 1 }),
  setPrecioMin: (precio) => set({ precioMin: precio, page: 1 }),
  setPrecioMax: (precio) => set({ precioMax: precio, page: 1 }),
  setOrdenar: (ordenar) => set({ ordenar, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      categoria: null,
      talla: null,
      precioMin: null,
      precioMax: null,
      ordenar: "nuevos",
      page: 1,
    }),
}));
