---
name: accessibility
description: Design, implement, and audit inclusive Shopify storefronts using WCAG 2.2 Level AA standards. Use when implementing UI components, auditing Liquid templates for accessibility barriers, or reviewing section/block code that handles interactive elements.
origin: affaan-m/everything-claude-code
---

# Accessibility (WCAG 2.2 — Shopify Theme Focus)

Ensures Shopify storefronts are POUR: Perceivable, Operable, Understandable, Robust.

## When to Use
- Implementing cart drawers, modal dialogs, variant pickers, or dropdowns
- Auditing existing Liquid templates for ARIA gaps
- Reviewing any section with interactive JavaScript (Quick Add, filters, sliders)
- Adding new Shopify section/block types that include buttons, forms, or media

## Core Implementation Steps

**Step 1: Semantic HTML first** — always prefer native elements (`<button>`, `<a>`, `<select>`) over `<div>` with click handlers.

**Step 2: Perceivable** — 4.5:1 color contrast minimum, text alternatives for all images, no color-only meaning (e.g., variant sold-out must show text + visual change).

**Step 3: Operable** — all interactive elements keyboard-reachable via Tab, Enter/Space activates buttons, Escape closes modals/drawers. Touch targets ≥ 44x44px.

**Step 4: Understandable** — consistent nav patterns across pages, descriptive form error messages, Liquid `aria-label` on icon-only buttons.

**Step 5: Robust** — `role`, `aria-expanded`, `aria-controls`, `aria-live` for dynamic cart updates.

## Shopify-Specific ARIA Patterns

### Cart Drawer
```html
<div id="cart-drawer" role="dialog" aria-modal="true" aria-label="Cart" aria-hidden="true">
  <button class="cart-drawer__close" aria-label="Close cart">{% render 'icon-close' %}</button>
  <div aria-live="polite" aria-atomic="true" class="cart-count-bubble">
    <span aria-hidden="true">{{ cart.item_count }}</span>
    <span class="visually-hidden">{{ cart.item_count }} {{ 'sections.header.cart_count' | t }}</span>
  </div>
</div>
```

### Variant Picker
```html
<fieldset>
  <legend>{{ option.name }}</legend>
  {% for value in option.values %}
    <label>
      <input type="radio" name="{{ option.position }}" value="{{ value }}"
        {% if value == option.selected_value %}checked{% endif %}>
      {{ value }}
    </label>
  {% endfor %}
</fieldset>
```

### Announcement Bar (auto-rotating)
```html
<div role="region" aria-label="Announcements" aria-live="polite">
  <!-- pause animation on prefers-reduced-motion -->
</div>
```

## Anti-Patterns to Eliminate
- `<div onclick="">` without `role="button"` and `tabindex="0"`
- Icon-only buttons with no `aria-label` (search icon, cart icon, close icon)
- Color swatches that use only background-color to indicate selection (add `aria-pressed` or `aria-checked`)
- Modal/drawer that doesn't trap focus or doesn't restore focus on close
- `aria-hidden="true"` on SVG icons that ARE the label
- Missing `<label>` on email/search input fields
- Product images with empty `alt=""` when alt text conveys product info

## WCAG 2.2 New Requirements (check these specifically)
- **2.5.8 Target Size Minimum**: Interactive elements ≥ 24×24 CSS px
- **3.2.6 Consistent Help**: Help links in same relative order across pages
- **3.3.7 Redundant Entry**: Don't make users re-enter info already provided in same session
- **3.3.8 Accessible Authentication**: No cognitive function test for login (CAPTCHA alternatives)

## Focus Management for Shopify JS
```javascript
// When opening cart drawer
cartDrawer.setAttribute('aria-hidden', 'false');
firstFocusableElement.focus();

// When closing cart drawer
cartDrawer.setAttribute('aria-hidden', 'true');
triggerElement.focus(); // return focus to the element that opened it
```

## Audit Checklist
- [ ] All product images have meaningful `alt` attributes (populated from product.featured_image.alt)
- [ ] Cart item count updates announced via `aria-live`
- [ ] All modals/drawers trap focus and restore on close
- [ ] Search form has visible label or `aria-label`
- [ ] Mobile navigation close button has accessible label
- [ ] Form errors are associated with inputs via `aria-describedby`
- [ ] Color swatches communicate state beyond color alone
- [ ] Skip-to-content link present and functional
- [ ] `prefers-reduced-motion` respected for all CSS/JS animations
