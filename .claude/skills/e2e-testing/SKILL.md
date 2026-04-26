---
name: e2e-testing
description: End-to-end testing for Shopify storefronts using Playwright. Use when writing automated tests for cart flows, checkout, product pages, filters, or any customer-facing journey that must not regress.
origin: affaan-m/everything-claude-code
---

# E2E Testing — Shopify Storefront (Playwright)

## When to Use
- Writing tests for cart add / update / remove flows
- Testing variant selection and price update
- Verifying checkout initiation (add to cart → checkout button)
- Collection filtering and search result tests
- Regression tests before pushing to production

## Setup (Shopify Theme Dev Server)
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Shopify dev server is single-threaded
  retries: 2,
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:9292', // shopify theme dev port
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

## Page Object Model — Shopify Pages
```typescript
// tests/pages/product-page.ts
import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly variantOptions: Locator;
  readonly price: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
    this.variantOptions = page.locator('variant-selects');
    this.price = page.locator('[data-testid="product-price"]');
    this.cartCount = page.locator('[data-testid="cart-count"]');
  }

  async goto(handle: string) {
    await this.page.goto(`/products/${handle}`);
    await this.page.waitForLoadState('networkidle');
  }

  async selectVariant(optionName: string, value: string) {
    await this.page.locator(`[name="${optionName}"][value="${value}"]`).check();
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.page.waitForResponse(resp => resp.url().includes('/cart/add.js'));
  }
}
```

## Core Test Suite
```typescript
// tests/e2e/cart.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/product-page';

test.describe('Cart Flow', () => {
  test('add product to cart increments count', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('your-product-handle');

    const initialCount = await productPage.cartCount.textContent();
    await productPage.addToCart();

    await expect(productPage.cartCount).not.toHaveText(initialCount ?? '');
  });

  test('cart drawer opens on add to cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('your-product-handle');
    await productPage.addToCart();

    await expect(page.locator('cart-drawer')).toHaveAttribute('aria-hidden', 'false');
  });

  test('variant change updates price', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.goto('your-product-handle');

    const priceBefore = await productPage.price.textContent();
    await productPage.selectVariant('Size', 'Large'); // adjust to your variant

    await expect(productPage.price).not.toHaveText(priceBefore ?? '');
  });
});
```

## Shopify-Specific Test Patterns

### Wait for AJAX Completion
```typescript
// Always wait for cart API response, not just DOM update
await page.waitForResponse(resp =>
  resp.url().includes('/cart') && resp.status() === 200
);
```

### Test Sold-Out State
```typescript
test('sold out variant disables add to cart', async ({ page }) => {
  // Use a product with a known sold-out variant
  await page.goto('/products/test-product');
  await page.locator('[value="sold-out-variant-id"]').check();
  await expect(page.locator('[data-testid="add-to-cart"]')).toBeDisabled();
});
```

### Multi-Device Test
```typescript
test.describe('Mobile cart', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('cart drawer is full-screen on mobile', async ({ page }) => {
    // mobile-specific assertions
    await expect(page.locator('cart-drawer')).toHaveCSS('width', '100vw');
  });
});
```

## `data-testid` Convention
Add to Liquid templates for stable test selectors (not relying on class names):
```liquid
<button
  type="submit"
  data-testid="add-to-cart"
  {% if product.selected_variant.available == false %}disabled{% endif %}
>
```

## Running Tests
```bash
# Start Shopify dev server first
shopify theme dev --store your-store.myshopify.com

# In another terminal
npx playwright test
npx playwright test --ui           # interactive mode
npx playwright test cart.spec.ts   # single file
npx playwright show-report         # view results
```
