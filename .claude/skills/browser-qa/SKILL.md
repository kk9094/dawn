---
name: browser-qa
description: Visual QA and performance testing for Shopify themes. Use when verifying a theme feature before pushing to Shopify, running Core Web Vitals audits, or checking responsive layouts at mobile/tablet/desktop breakpoints.
origin: affaan-m/everything-claude-code
---

# Browser QA — Shopify Theme Visual & Performance Testing

## When to Use
- Before pushing theme changes to a live Shopify store
- After implementing a new section or component
- When a reported bug can't be reproduced from code alone
- Core Web Vitals audit (LCP, CLS, INP) before launch

## 4-Phase QA Protocol

### Phase 1: Smoke Test
- Open storefront at all 3 breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)
- Check browser console for JavaScript errors
- Verify Core Web Vitals targets:
  - **LCP** (Largest Contentful Paint) < 2.5s
  - **CLS** (Cumulative Layout Shift) < 0.1
  - **INP** (Interaction to Next Paint) < 200ms
- Confirm no 404s for CSS, JS, or image assets

### Phase 2: Interaction Test
- Navigation: desktop menu hover states, mobile hamburger open/close
- Cart: add to cart → cart drawer opens → quantity update → remove item
- Variant picker: all variants selectable, sold-out state shows correctly
- Search: open → type query → results appear → click result
- Filters (collection page): apply filter → URL updates → products filter

### Phase 3: Visual Regression
- Screenshot homepage, PDP, PLP, cart at all 3 breakpoints
- Check for layout shift on image load (set explicit `width`/`height` on `<img>`)
- Verify font loading (no FOUT on heading fonts)
- Confirm dark/light color scheme variants if applicable
- Test with `prefers-reduced-motion` enabled

### Phase 4: Accessibility
- Run axe DevTools or Lighthouse accessibility audit
- Verify keyboard navigation: Tab through interactive elements in logical order
- Check focus states are visible on all interactive elements
- Confirm screen reader landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`
- Validate cart count `aria-live` updates are announced

## Shopify-Specific Checks
- **Metafields**: do they render when populated AND gracefully absent?
- **Product images**: do all media types (image/video/3D model) load correctly?
- **Predictive search**: results appear within 300ms of typing?
- **Cart AJAX**: does the page NOT hard-reload on cart update?
- **Announcement bar**: does it scroll/rotate correctly on mobile?
- **Sticky header**: does it clear below the announcement bar?
- **Collection infinite scroll / pagination**: does it work at last page?

## Core Web Vitals Quick Fixes
| Issue | Fix |
|-------|-----|
| High LCP | Add `fetchpriority="high"` to hero image, preload font files |
| High CLS | Set `width`/`height` on all `<img>` and `<video>` elements |
| High INP | Defer non-critical JS, reduce main thread blocking |

## QA Report Format
```
VERDICT: SHIP / HOLD

Breakpoints: ✓ 375px  ✓ 768px  ✓ 1440px
Console errors: 0
LCP: 1.8s ✓  CLS: 0.05 ✓  INP: 120ms ✓
Accessibility violations: 0 critical, 2 moderate (listed below)
Issues found: [list]
```
