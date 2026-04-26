---
name: test-driven-development
description: TDD discipline for Shopify theme JavaScript. Use when building new cart logic, custom elements, or any JS feature where correctness matters and regressions would be costly.
origin: obra/superpowers
---

# Test-Driven Development — Shopify Theme JS

## The Iron Law
No production JavaScript without a failing test first. No exceptions.

## Red → Green → Refactor

1. **RED**: Write a failing test that describes the desired behavior. Run it. Confirm it fails for the right reason.
2. **GREEN**: Write the minimum code to make the test pass. Nothing more.
3. **REFACTOR**: Clean up the code. Run tests again. All green before moving on.

Never skip RED. Writing a test after code means you're testing the implementation, not the behaviour.

## What Makes a Good Test (Shopify Context)

- **Tests behaviour, not implementation**: Test that "add to cart increments count by 1", not that "`this.items.push()` was called"
- **Minimal**: One assertion per test case (or closely related assertions)
- **Deterministic**: No flakiness — don't rely on network, timing, or Shopify store state
- **Descriptive name**: `'cart drawer opens when item is added'` not `'test1'`
- **Real DOM over mocks**: Use `jsdom` or actual custom elements; mock only external fetch calls

## Test Setup for Shopify Theme JS
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
});

// tests/setup.js — stub Shopify globals
global.Shopify = {
  currency: { active: 'USD', rate: '1.0' },
  shop: 'test-store.myshopify.com',
};

// Stub fetch for cart API calls
global.fetch = vi.fn();
```

## Example: Cart Counter TDD
```javascript
// tests/cart-count.test.js

// Step 1 — RED: write failing test
test('cart count updates when cart:update event fires', () => {
  document.body.innerHTML = `
    <cart-count>
      <span data-testid="count">0</span>
    </cart-count>
  `;
  // CartCount custom element not defined yet — this will fail
  document.dispatchEvent(new CustomEvent('cart:update', { detail: { count: 3 } }));
  expect(document.querySelector('[data-testid="count"]').textContent).toBe('3');
});

// Step 2 — GREEN: minimal implementation
class CartCount extends HTMLElement {
  connectedCallback() {
    document.addEventListener('cart:update', (e) => {
      this.querySelector('[data-testid="count"]').textContent = e.detail.count;
    });
  }
}
customElements.define('cart-count', CartCount);

// Step 3 — REFACTOR: add AbortController, aria-live, animation
```

## Common Rationalizations (Reject These)
| Rationalization | Why It's Wrong |
|----------------|----------------|
| "It's simple, it doesn't need a test" | Simple code breaks too; tests cost ~2 mins |
| "I'll add tests later" | Later never comes; the code is now untested in production |
| "I tested it manually in the browser" | Manual tests don't prevent future regressions |
| "The test would be too hard to write" | Hard-to-test code is a design smell — refactor the code |
| "Shopify themes don't need tests" | Cart logic, variant state, and AJAX flows all have regressions |

## Red Flags in Theme JS
- Cart AJAX function with no error handling test
- Variant picker with no test for sold-out state
- Drawer open/close with no focus management test
- Quantity input with no test for min=0 edge case
- Predictive search with no test for empty results state

## Running Tests
```bash
npx vitest              # watch mode
npx vitest run          # single run (CI)
npx vitest --coverage   # coverage report
```
