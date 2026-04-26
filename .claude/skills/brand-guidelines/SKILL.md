---
name: brand-guidelines
description: Apply Voxel Forge brand colors, typography, and visual language consistently across Shopify theme sections and components. Use when building any customer-facing UI that must reflect the Voxel Forge luxury lighting brand identity.
origin: anthropics/skills + ComposioHQ/awesome-claude-skills (adapted for Voxel Forge)
---

# Brand Guidelines — Voxel Forge Luxury Lighting

Apply brand identity consistently across all Shopify theme sections, emails, and marketing assets.

## Brand Personality
Luxury lighting for architectural spaces. The brand communicates: precision, warmth, materiality, restraint. It does NOT communicate: generic e-commerce, discount retail, or approachable-casual.

## Visual Language Principles
- **Restraint over decoration**: Every element earns its place
- **Material warmth**: Warm neutrals, brass/gold accents, deep backgrounds
- **Typographic authority**: Strong hierarchy, generous leading, refined letterforms
- **Photography-first**: Product images carry the brand; UI recedes gracefully
- **Lighting as metaphor**: Use gradient, glow, and contrast as design tools

## Color Application Rules

### In Shopify `settings_schema.json`
```json
{
  "name": "Colors",
  "settings": [
    { "type": "color", "id": "colors_background_1", "default": "#0D0D0D", "label": "Background primary" },
    { "type": "color", "id": "colors_background_2", "default": "#1A1A1A", "label": "Background secondary" },
    { "type": "color", "id": "colors_accent_1", "default": "#C9A96E", "label": "Accent (brass/gold)" },
    { "type": "color", "id": "colors_text", "default": "#F5F0E8", "label": "Body text" },
    { "type": "color", "id": "colors_text_2", "default": "#8A8278", "label": "Muted text" }
  ]
}
```

### CSS Custom Properties
```css
:root {
  --vf-color-bg-primary: #0D0D0D;
  --vf-color-bg-secondary: #1A1A1A;
  --vf-color-accent: #C9A96E;       /* brass/gold — use sparingly */
  --vf-color-text-primary: #F5F0E8;
  --vf-color-text-muted: #8A8278;
  --vf-color-border: rgba(201, 169, 110, 0.2); /* gold at 20% opacity */
}
```

## Typography

### Font Pairing
- **Display / Headings**: Cormorant Garamond or Playfair Display (serif, editorial authority)
- **Body / UI**: Inter or DM Sans (geometric, legible at small sizes)
- **Accent / Labels**: Letter-spaced uppercase body font (no secondary decorative face needed)

### Hierarchy
```css
.heading-display { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.05; }
.heading-section  { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 400; letter-spacing: -0.01em; }
.heading-product  { font-size: clamp(1.25rem, 2vw, 1.75rem); font-weight: 400; }
.label-overline   { font-size: 0.625rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--vf-color-accent); }
.body-text        { font-size: 1rem; line-height: 1.7; color: var(--vf-color-text-primary); }
```

## Component Brand Rules

### Buttons
```css
.button--primary {
  background: transparent;
  border: 1px solid var(--vf-color-accent);
  color: var(--vf-color-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 1rem 2.5rem;
  transition: background 0.2s ease, color 0.2s ease;
}
.button--primary:hover {
  background: var(--vf-color-accent);
  color: var(--vf-color-bg-primary);
}
```

### Product Cards
- No rounded corners (architectural precision)
- Image takes 70–80% of card height
- Product name below image in heading font, weight 400
- Price in muted text, no bold
- No star ratings or review counts on cards (luxury positioning)
- Hover: subtle image zoom (1.03 scale), NO overlay text

### Section Spacing
```css
.section { padding-top: var(--section-padding-top, 80px); padding-bottom: var(--section-padding-bottom, 80px); }
@media screen and (min-width: 990px) {
  .section { padding-top: 120px; padding-bottom: 120px; }
}
```

## Anti-Patterns (Never Do)
- Bright white backgrounds (`#ffffff`) — use warm off-white or dark backgrounds
- Blue or purple accent colors — the accent is brass/gold only
- Rounded product images or cards — sharp corners only
- Discount badges or "SALE" callouts in red — use muted styling
- Heavy drop shadows — use subtle borders or no shadow
- Stock photography in hero banners — product or architectural photography only
- Centered body text blocks longer than 2 sentences
- More than 2 fonts in any single layout
