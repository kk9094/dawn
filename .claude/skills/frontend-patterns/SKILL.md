---
name: frontend-patterns
description: Shopify theme JavaScript patterns — custom elements, AJAX cart, section rendering API, event-driven architecture, performance optimization. Use when writing or reviewing theme JS, building custom web components, or implementing Shopify-specific AJAX flows.
origin: affaan-m/everything-claude-code
---

# Frontend Patterns — Shopify Theme JavaScript

Modern JavaScript patterns for Shopify Dawn-based themes.

## When to Use
- Building custom web components for Shopify sections
- Implementing AJAX cart or cart drawer logic
- Using the Shopify Section Rendering API
- Optimizing JavaScript performance (lazy loading, deferred init)
- Handling variant change events across components

## Shopify Custom Element Pattern
```javascript
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.abortController = null;
  }

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.abortController = new AbortController();
    this.setupListeners();
  }

  disconnectedCallback() {
    this.abortController?.abort();
  }

  setupListeners() {
    const { signal } = this.abortController;
    document.addEventListener('cart:add', this.onCartAdd.bind(this), { signal });
    this.querySelector('[data-close]')
      ?.addEventListener('click', this.close.bind(this), { signal });
  }

  async onCartAdd(event) {
    this.open();
    await this.renderContents(event.detail.sectionId);
  }

  open() {
    this.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    this.querySelector('[data-close]')?.focus();
  }

  close() {
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    document.querySelector('[data-cart-trigger]')?.focus();
  }
}

customElements.define('cart-drawer', CartDrawer);
```

## Section Rendering API Pattern
```javascript
async renderSection(sectionId, params = {}) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('sections', sectionId);

  const response = await fetch(url.toString());
  const data = await response.json();
  return data[sectionId];
}

// Usage: re-render cart after add
const html = await renderSection('cart-drawer', { variant_id: 123 });
document.getElementById('cart-drawer').innerHTML = new DOMParser()
  .parseFromString(html, 'text/html')
  .getElementById('cart-drawer').innerHTML;
```

## AJAX Add to Cart
```javascript
async addToCart(formData) {
  const button = this.querySelector('[type="submit"]');
  button.setAttribute('disabled', '');
  button.classList.add('loading');

  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) throw new Error(await response.text());

    const item = await response.json();
    document.dispatchEvent(new CustomEvent('cart:add', { detail: { item } }));
    this.dispatchEvent(new CustomEvent('cart:add:success', { bubbles: true }));
  } catch (error) {
    this.handleError(error);
  } finally {
    button.removeAttribute('disabled');
    button.classList.remove('loading');
  }
}
```

## Variant Change Handling
```javascript
class VariantSelects extends HTMLElement {
  connectedCallback() {
    this.addEventListener('change', this.onVariantChange.bind(this));
  }

  onVariantChange() {
    const selectedOptions = Array.from(this.querySelectorAll('select, input:checked'))
      .map(el => el.value);

    this.currentVariant = this.getVariantData().find(variant =>
      variant.options.every((option, i) => option === selectedOptions[i])
    );

    if (!this.currentVariant) return;

    this.updateURL();
    this.updateMedia();
    this.updatePrice();
    this.updateButton();

    document.dispatchEvent(new CustomEvent('variant:change', {
      detail: { variant: this.currentVariant, product: this.getProductData() }
    }));
  }

  getVariantData() {
    return JSON.parse(this.querySelector('[type="application/json"]').textContent);
  }
}
```

## Performance Patterns

### Lazy Initialize Heavy Components
```javascript
// Don't initialize until near viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      import('./heavy-component.js').then(m => m.init(entry.target));
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px' });

document.querySelectorAll('[data-lazy]').forEach(el => observer.observe(el));
```

### Debounce Predictive Search
```javascript
debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

this.onInputChange = this.debounce(this.search.bind(this));
```

## Event Architecture
Use custom events on `document` for cross-component communication:
- `cart:add` — item added to cart
- `cart:update` — cart quantity changed
- `cart:remove` — item removed
- `variant:change` — variant selection changed
- `drawer:open` / `drawer:close` — any drawer state change
- `search:open` / `search:close` — search overlay

Never reach across components with direct DOM queries. Dispatch and listen.
