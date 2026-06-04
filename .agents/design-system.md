# Design System — TiendaRopa

## Paleta de colores (Dark Aesthetic)
```css
--bg-base:      #080808    /* Base absoluta */
--bg-primary:   #0A0A0A    /* Fondo principal */
--bg-secondary: #111111    /* Secciones alternadas */
--bg-card:      #161616    /* Cards de producto */
--bg-elevated:  #1E1E1E    /* Hover, dropdowns */
--bg-input:     #141414    /* Inputs */
--bg-overlay:   rgba(0,0,0,0.7)

--accent-primary:   #E8FF00   /* Amarillo neón — CTA principal */
--accent-secondary: #FF3B3B   /* Rojo — badges, alertas */
--accent-success:   #00D68F   /* Verde — confirmaciones */
--accent-info:      #3B9EFF   /* Azul — info */

--text-primary:   #F0F0F0    /* Titulares */
--text-secondary: #999999    /* Descripciones */
--text-muted:     #555555    /* Placeholders, disabled */
--text-on-accent: #000000    /* Texto sobre accent */

--border-subtle:  #1A1A1A
--border-default: #2A2A2A
--border-strong:  #404040
--border-accent:  rgba(232,255,0,0.25)

--shadow-card:  0 0 0 1px var(--border-default)
--shadow-glow:  0 0 24px rgba(232,255,0,0.10)
--shadow-modal: 0 24px 48px rgba(0,0,0,0.7)
--transition:   all 0.2s ease
```

## Tipografía
- **Bebas Neue** → Hero titles (72-120px), secciones impacto, precios grandes
- **DM Sans** → Cuerpo, UI, botones, labels (14-18px, pesos 400 y 500)
- **Space Mono** → Precios (S/ 150.00), SKU, números de pedido

## Principios visuales
- Fondo siempre oscuro, nunca blanco. Negro profundo como base.
- Imágenes como protagonistas: 70-80% de cada card
- Tipografía como elemento gráfico (títulos en Bebas Neue 72-96px)
- Contraste extremo: negro vs blanco vs neón. Sin grises como fondos principales
- Cards de producto: imagen grande → precio (Space Mono) → nombre → badge → 2 botones (Converse-style)
- Hover: card sube (translateY -4px) + borde neón + glow suave
- Botón primario: bg accent-primary, texto negro. Botón secundario: outline
- Grid asimétrico en secciones destacadas (bento/masonry)
- Badges streetwear: mayúsculas, letra espaciada (letter-spacing: 0.1em)
- Sin ilustraciones decorativas. Solo tipografía y fotos
- Mobile-first, touch targets ≥ 44×44px

## Componentes definidos
- **Button** — primary (neón), secondary (outline), ghost, danger (rojo)
- **Badge** — nuevo (verde), oferta (rojo), agotado (rojo), stockBajo (rojo pulsante), default
- **Input** — dark theme, con error, helperText
- **Skeleton** — loading placeholder
- **WhatsAppButton** — flotante, fixed bottom-right
- **HeroSection** — split layout, Bebas Neue 96-120px, badge neón pulsante
- **CategoryGrid** — 3 cards full-image, aspect-ratio 3/4, hover scale
- **ProductCard** — Converse-style: imagen 75% + precio mono + nombre + dual buttons
- **OrderTimeline** — horizontal steps con estado pago
- **Header** (store) — sticky, nav links, carrito badge
- **Footer** — 3 columnas, links, contacto
