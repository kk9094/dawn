---
name: click-path-audit
description: Detect silent state-mutation bugs in Shopify theme interactive UI — cart drawer, variant pickers, AJAX forms, filters, quantity inputs. Use when a reported bug is hard to reproduce or when reviewing JS-heavy sections before shipping.
origin: affaan-m/everything-claude-code
---

# Click-Path Audit — Interactive State Bug Detection

Finds bugs that are invisible to static code analysis: race conditions, stale closures, sequential-action failures, missing state transitions.

## When to Use
- Cart drawer behaves incorrectly after multiple add/remove actions
- Variant picker gets into a broken state after switching variants
- Quick Add or Quantity Rules stop responding after user interaction
- Filters don't clear properly after multiple selections
- Any Shopify AJAX flow that works in isolation but breaks in sequence

## 6 Bug Patterns to Hunt

### 1. Sequential Undo Bugs
The UI breaks when the user does A → B → undo B → undo A but the state assumes only forward actions.
```javascript
// BAD: assumes linear cart operations
updateCart(item) { this.items.push(item) }

// GOOD: always derive state from source of truth
updateCart() { fetch('/cart.json').then(data => this.items = data.items) }
```

### 2. Async Race Conditions
Two AJAX requests fire simultaneously; the slower one resolves last and overwrites the faster result.
```javascript
// BAD: no request cancellation
addToCart(variantId) { fetch('/cart/add.js', { body: ... }) }

// GOOD: abort previous request
let controller = new AbortController();
addToCart(variantId) {
  controller.abort();
  controller = new AbortController();
  fetch('/cart/add.js', { signal: controller.signal, body: ... })
}
```

### 3. Stale Closures in Event Listeners
Event handler captures an old variable value when the listener is re-added on re-render.
```javascript
// BAD: re-adds listener without removing old one
connectedCallback() { this.btn.addEventListener('click', () => this.currentVariant) }

// GOOD: AbortController-based cleanup
connectedCallback() {
  this.abortController = new AbortController();
  this.btn.addEventListener('click', handler, { signal: this.abortController.signal });
}
disconnectedCallback() { this.abortController.abort(); }
```

### 4. Missing State Transitions
Loading/disabled state not set → user can click again during pending AJAX.
```javascript
// Check: button disabled during fetch?
// Check: loading spinner shown?
// Check: error state handled (not just success)?
```

### 5. Dead Code Paths
Conditional branches that were coded but never triggered in testing.
- Product with no variants (single-variant product)
- Cart with 0 items (empty cart state)
- Product sold out with `continue_selling = false`
- Variant with no inventory policy set

### 6. useEffect / Custom Element Lifecycle Interference
Shopify's custom elements (`<cart-items>`, `<variant-selects>`) re-render and fire `connectedCallback` on section updates via Theme Editor.

```javascript
// Check: does the component handle being re-connected to DOM?
connectedCallback() {
  if (this.initialized) return; // guard against re-init
  this.initialized = true;
  // setup...
}
```

## Shopify Click-Path Test Matrix

| Feature | Test Sequence |
|---------|---------------|
| Cart | Add → Add same item → Increase qty → Decrease qty → Remove → Verify empty state |
| Variant Picker | Select OOS variant → Select in-stock → Check price/image update |
| Quick Add | Add from collection → Open cart → Add same item from PDP → Check count |
| Filters | Apply filter A → Apply filter B → Remove filter A → Clear all → Verify URL |
| Search | Type → Select result → Back → Re-open search → Verify state reset |
| Gift Cards | Enter recipient → Change date → Remove recipient → Verify form clears |

## Audit Output Format
For each bug found:
```
COMPONENT: <cart-drawer>
SEQUENCE: Add item → close drawer → add same item → open drawer
SYMPTOM: Item count shows 1 instead of 2
ROOT CAUSE: Stale cart state — drawer reads cached items instead of fetching /cart.json
FIX: Dispatch 'cart:refresh' event on drawer open
```
