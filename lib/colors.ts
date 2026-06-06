export const COLOR_HEX_MAP: Record<string, string> = {
  blanco: "#FFFFFF",
  negro: "#1a1a1a",
  rojo: "#FF0000",
  azul: "#2563EB",
  verde: "#22C55E",
  amarillo: "#EAB308",
  naranja: "#F97316",
  morado: "#A855F7",
  rosa: "#EC4899",
  gris: "#6B7280",
  marron: "#8B4513",
  beige: "#F5F5DC",
  crema: "#FFFDD0",
  cafe: "#6F4E37",
  vino: "#722F37",
  navy: "#1E3A8A",
  khaki: "#BDB76B",
  oliva: "#65A30D",
  celeste: "#87CEEB",
  turquesa: "#40E0D0",
  coral: "#FF7F50",
  plata: "#C0C0C0",
  oro: "#FFD700",
  menta: "#98FF98",
  lavanda: "#E6E6FA",
  mostaza: "#FFDB58",
  borgoña: "#800020",
  camel: "#C19A6B",
  carbon: "#36454F",
  fucsia: "#FF00FF",
};

function hashHue(color: string): number {
  let hash = 0;
  for (let i = 0; i < color.length; i++) {
    hash = color.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 360) + 360) % 360;
}

export function colorToHex(color: string): string {
  return COLOR_HEX_MAP[color.toLowerCase().trim()] || `oklch(65% 0.12 ${hashHue(color)})`;
}

type ImagenColor = { url: string; colorKey: string | null };

function normalizeColorKey(key: string | null): string | null {
  return key?.toLowerCase().trim() ?? null;
}

export function getImagenPorColor(imagenes: ImagenColor[], colorKey: string | null): string | null {
  const key = normalizeColorKey(colorKey);
  if (key) {
    const match = imagenes.find((i) => normalizeColorKey(i.colorKey) === key);
    if (match) return match.url;
  }
  const defaultImg = imagenes.find((i) => !i.colorKey);
  return defaultImg?.url || imagenes[0]?.url || null;
}

export function getImagenesFiltradas(imagenes: ImagenColor[], colorKey: string | null): ImagenColor[] {
  const key = normalizeColorKey(colorKey);
  if (!key) return imagenes;
  const delColor = imagenes.filter((i) => normalizeColorKey(i.colorKey) === key);
  if (delColor.length > 0) return delColor;
  return imagenes.filter((i) => !i.colorKey);
}

export function getColoresFromVariantes<T extends { color?: string | null }>(variantes: T[]): string[] {
  const colores = new Set<string>();
  variantes.forEach((v) => {
    if (v.color?.trim()) colores.add(v.color.trim().toLowerCase());
  });
  return Array.from(colores);
}

export const COLOR_NAMES = Object.keys(COLOR_HEX_MAP);
