---
name: coding-standards
description: Shopify theme coding conventions for Liquid, JavaScript, and CSS. Apply when writing new sections, reviewing PRs, or refactoring theme code to ensure consistent, maintainable patterns.
origin: affaan-m/everything-claude-code
---

# Coding Standards — Shopify Theme

Universal quality conventions for Liquid, JavaScript, and CSS in Shopify Dawn-based themes.

## Core Principles
- **KISS**: The simplest solution that works is always preferred
- **DRY**: Extract repeated Liquid snippets into `snippets/`, repeated CSS into shared classes
- **Readability over cleverness**: A future developer (or you in 3 months) must understand it immediately
- **No premature abstraction**: Don't build a system for a pattern that appears fewer than 3 times

## Liquid Standards

### Snippet Naming
```
snippets/
  card-product.liquid       # component name, noun first
  icon-arrow.liquid         # icon-{name} for SVG snippets
  price.liquid              # shared utility snippets are single nouns
  section-header.liquid     # section-specific partials prefixed with section name
```

### Render vs Include
Always use `{% render %}` over `{% include %}`. `render` is isolated (no parent scope leakage).
```liquid
{% comment %} BAD {% endcomment %}
{% include 'card-product' %}

{% comment %} GOOD {% endcomment %}
{% render 'card-product', product: product, section: section %}
```

### Safe Output
Always escape user-generated content and validate metafield output:
```liquid
{% comment %} Check metafield exists before outputting {% endcomment %}
{% if product.metafields.custom.subtitle != blank %}
  <p>{{ product.metafields.custom.subtitle | escape }}</p>
{% endif %}
```

### Section Schema
```json
{
  "name": "t:sections.featured-product.name",
  "settings": [
    {
      "type": "header",
      "content": "t:sections.all.layout.heading"
    },
    {
      "type": "select",
      "id": "color_scheme",
      "options": [
        { "value": "scheme-1", "label": "t:sections.all.color_scheme.options__1.label" },
        { "value": "scheme-2", "label": "t:sections.all.color_scheme.options__2.label" }
      ],
      "default": "scheme-1",
      "label": "t:sections.all.color_scheme.label"
    }
  ]
}
```
- All `label`/`content` values must reference translation keys (`t:...`)
- Group related settings under `"type": "header"` separators
- Always include `color_scheme` setting on visible sections

## JavaScript Standards

### File Organization
```
assets/
  cart.js                   # one file per major feature
  cart-drawer.js
  variant-selects.js
  predictive-search.js
  global.js                 # shared utilities only (debounce, fetchConfig, etc.)
```

### No Dependencies
Shopify themes ship zero npm dependencies in production JS. Use:
- Native `fetch()` for AJAX
- `customElements.define()` for components
- `IntersectionObserver` for lazy loading
- `ResizeObserver` for responsive JS logic

### fetchConfig Helper (standard pattern)
```javascript
function fetchConfig(type = 'javascript') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: `application/${type}`
    }
  };
}
```

### Error Handling
```javascript
// Always handle both network and application errors
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return await response.json();
} catch (error) {
  console.error('[Theme]', error);
  this.showError(error.message || 'Something went wrong');
}
```

## CSS Standards

### Custom Property Naming
```css
/* Shopify settings tokens */
--color-base-background-1
--color-base-text
--color-base-accent-1
--font-body-family
--font-body-size
--page-width

/* Component-level tokens (scoped) */
--card-border-width: var(--border-width, 0);
--card-shadow: var(--box-shadow, none);
```

### Responsive Breakpoints (Dawn standard)
```css
/* Mobile first */
@media screen and (min-width: 750px) { /* tablet */ }
@media screen and (min-width: 990px) { /* desktop */ }
@media screen and (min-width: 1200px) { /* wide desktop */ }

/* Use Dawn's grid system */
.grid { display: grid; grid-template-columns: repeat(var(--grid-mobile-columns, 1), 1fr); gap: var(--grid-mobile-vertical-spacing) var(--grid-mobile-horizontal-spacing); }
@media screen and (min-width: 750px) {
  .grid { grid-template-columns: repeat(var(--grid-desktop-columns, 3), 1fr); }
}
```

### Animation
```css
/* Always respect reduced motion */
@media screen and (prefers-reduced-motion: no-preference) {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
}
```

## File Naming Conventions
```
sections/    main-*.liquid       # template sections (main-product, main-collection)
             featured-*.liquid   # flexible/reusable sections
snippets/    card-*.liquid       # card components
             icon-*.liquid       # SVG icons
             price.liquid        # utility snippets (no prefix)
assets/      component-*.css     # component scoped styles
             section-*.css       # section-specific styles
             base.css            # global base styles
             theme.css           # theme-wide utilities
```

## PR Checklist
- [ ] All new Liquid output uses `| escape` or trusted sources only
- [ ] New section has `color_scheme` and `padding_top`/`padding_bottom` settings
- [ ] All translation strings referenced via `t:` keys, not hardcoded
- [ ] JS file has no external dependencies
- [ ] CSS uses `--color-base-*` tokens, not hardcoded hex
- [ ] `prefers-reduced-motion` respected for all new animations
- [ ] Mobile tested at 375px width
