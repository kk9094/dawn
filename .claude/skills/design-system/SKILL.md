---
name: design-system
description: Generate or audit design systems, check visual consistency, and review PRs that touch styling. Use when starting a new Shopify theme, auditing CSS for token inconsistencies, or when the UI looks "off" but you can't pinpoint why.
origin: affaan-m/everything-claude-code
---

# Design System — Generate & Audit Visual Systems

## When to Use
- Starting a new Shopify theme that needs a design token system
- Auditing existing theme CSS for visual inconsistencies
- Before a redesign — understand what tokens already exist
- When the storefront looks "off" but the cause is unclear
- Reviewing PRs that touch CSS variables, settings_schema, or section styles

## Mode 1: Generate Design System
1. Scan CSS custom properties, Shopify settings_schema.json, and section/block CSS for existing patterns
2. Extract: colors, typography, spacing, border-radius, shadows, breakpoints, z-index layers
3. Propose a design token set (CSS custom properties + Shopify settings equivalent)
4. Generate DESIGN.md with rationale for each decision
5. Create an interactive HTML preview page (self-contained, no deps)

Output: `DESIGN.md` + `design-tokens.css` + `design-preview.html`

## Mode 2: Visual Audit (10 dimensions, scored 0–10)
1. **Color consistency** — CSS variables used everywhere vs. hardcoded hex values?
2. **Typography hierarchy** — clear display > heading > body > caption scale?
3. **Spacing rhythm** — consistent 4/8/16/32px scale or arbitrary values?
4. **Component consistency** — similar elements (cards, buttons, badges) share the same visual language?
5. **Responsive behavior** — fluid at all Shopify breakpoints (mobile 375px, tablet 768px, desktop 1280px)?
6. **Section cohesion** — do all sections feel like the same theme?
7. **Animation** — purposeful (cart drawer, variant picker) or decorative noise?
8. **Accessibility** — contrast ratios pass, focus states visible, touch targets ≥44px?
9. **Information density** — product grids and collection pages breathe or feel cluttered?
10. **Polish** — hover states, loading skeletons, empty states, error states all handled?

## Mode 3: AI Slop Detection (Shopify-specific)
- Purple-to-blue gradients on hero sections with no brand rationale
- Generic rounded cards with no typographic differentiation
- Excessive `box-shadow` stacking on product cards
- Announcement bars with default Shopify font and no customization
- Footer that's a 1:1 copy of the Dawn default with no brand expression
- Color swatches that are just colored `<span>` blocks with no hover/selected state
- Mobile nav that animates but has no close affordance
- Hero image with auto-cropped face or generic lifestyle stock photo

## Shopify Token Mapping
```css
/* Map Shopify settings to CSS variables */
:root {
  --color-base-background-1: {{ settings.colors_background_1 }};
  --color-base-background-2: {{ settings.colors_background_2 }};
  --color-base-accent-1: {{ settings.colors_accent_1 }};
  --color-base-accent-2: {{ settings.colors_accent_2 }};
  --color-base-text: {{ settings.colors_text }};
  --font-body-family: {{ settings.type_body_font.family }};
  --font-heading-family: {{ settings.type_header_font.family }};
  --page-width: {{ settings.page_width }}px;
  --spacing-sections-desktop: {{ settings.spacing_sections }}px;
}
```
