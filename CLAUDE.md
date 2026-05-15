# Voxel Forge — Agent Operating Notes

> **Read this first.** Every Antigravity session that touches `.liquid`, `.css`, or `.json`
> in this repo must start here. The rules below override anything in `SKILL.md`,
> generic Shopify guides, or model priors. Whenever a rule conflicts with a
> general best-practice you remember, this file wins.

---

## 1 · Stack

- **Theme:** Shopify Dawn 15.x, branch `kk9094/dawn @ preprod`
- **Spec:** the React UI kit at `ui_kits/website/` is the visual contract. It is **not** source — translate it to Liquid, do not bundle it.
- **Token contract:** `assets/vf-tokens.css` (loaded **after** `base.css` in `theme.liquid`)
- **All custom snippets, sections, and assets prefixed `vf-`.** No exceptions.
- **All custom Liquid sits alongside Dawn's, never replacing it.** `header.liquid`, `footer.liquid`, `main-product.liquid` etc. stay untouched. Brand surfaces are new files (`vf-hero.liquid`, `vf-statement.liquid`, …).

---

## 2 · Read order on session start

When starting a fresh task, load files in this order. Stop at the first file that contains the answer; don't read everything by default.

1. **`AGENTS.md`** (this file) — operating rules
2. **`README.md`** — voice, tone, palette, content fundamentals
3. **`assets/vf-tokens.css`** — token values (pull from here, never hardcode)
4. **`docs/section-schemas.md`** — what's hardcoded vs merchant-editable per section
5. **`ui_kits/website/[Section].jsx`** — visual reference for the section being ported
6. **`snippets/vf-*.liquid`** — primitive snippets to render rather than re-implement
7. **Verify token wiring before touching `assets/vf-tokens.css`:** run `grep -n 'vf-tokens' layout/theme.liquid` — must return one match (the `<link>` tag, around line 260). If missing, the cascade is broken and CSS changes will not reach the storefront.

---

## 3 · Hard rules

These are non-negotiable. If a rule conflicts with anything else, this rule wins.

### Tokens
- **Never hardcode colour, spacing, or type values inside `.vf-*` components.** Always reference `--vf-*`.
- **Never use Dawn's `--color-*` tokens inside `.vf-*` components.** Dawn tokens are for merchant-customisable surfaces (default sections); VF brand surfaces use VF tokens.
- **Always reference grid tokens** (`--vf-grid-max`, `--vf-grid-margin-d`, `--vf-grid-gutter-d`) instead of literal values like `1400px` or `48px`.
- **Gold has two register variants.** `--vf-gold` (#C9A96E) is editorial-safe on Obsidian (~10:1). `--vf-gold-deep` (#7A5C25, 4.81:1 on Bone) is transactional-safe on Bone. Pattern mirrors `--vf-teal-bright` / `--vf-teal-deep`. The semantic alias `--vf-color-tier-ii` dispatches automatically via `[data-mode="bone"]` — never reference either palette token directly on tier call sites.
- **No sub-pixel precision in tokens.** Tokens encode meaningful design decisions, not comp-pixel exactness. When the difference between two candidate values is less than 1.5px at typical render sizes (e.g., `-0.005em` vs `-0.01em` tracking at 30px = 0.15px), use the existing token. Propose a new token only for genuinely distinct system-level sizes.

### Liquid conventions
- **Asset URLs:** `{{ 'filename.ext' | asset_url }}`. Never relative paths like `../../assets/...`.
- **Snippets:** `{% render 'vf-button', label: 'See the editions', href: '/collections/all' %}`. Never re-implement primitives inline.
- **Schema:** every section file ends with `{% schema %}` JSON. Refer to `docs/section-schemas.md` for the per-section editable-fields contract.
- **Schema: resource-reference settings cannot have `"default"`.** Settings of type `image_picker`, `url`, `collection`, `product`, `page`, `video`, `article`, `blog` reject the `"default"` property — Shopify raises a validation error on save. Handle missing values in Liquid: `{%- if section.settings.image -%}…{%- else -%}{% render 'vf-cube' %}{%- endif -%}`.
- **Liquid whitespace:** use `{%-` and `-%}` aggressively. Rendered HTML must not contain blank lines from Liquid logic.
- **Whitespace trim and inline render:** Never apply `{%-` / `-%}` trim dashes to a `{% render %}` tag whose output flows into running prose. The leading trim eats the space between the preceding word and the snippet output — `{%- render 'vf-num-words' -%}` inside `<p>Edition of …</p>` produces "Edition ofseventy". Use `{% render %}` (no dashes) when adjacent whitespace is intentional. Trim dashes are safe on block-level renders that produce only markup.

### Mobile breakpoint
- **750px**, not 768px. Dawn defines `@media screen and (min-width: 750px)`. Match it everywhere.
- Any `768` reference in the kit is stale — port it as 750.

### Buttons & focus
- All buttons: `min-height: 48px`. Override Dawn's 45px floor for `.vf-btn`.
- Focus ring: `outline: 2px solid var(--vf-teal); outline-offset: 2px;` on `:focus-visible` (not `:focus`). Suppress Dawn's `box-shadow` ring on `.vf-*` only — leave it intact for default Dawn sections.
- **Focus ring weight scales with surrounding hairline:**
  - `2px` on editorial surfaces (Obsidian field, no adjacent hairline borders) — `var(--vf-teal-bright)`
  - `1.5px` on transactional surfaces (Bone field) where the ring sits adjacent to 0.5px hairline borders — prevents double-line readability issue — `var(--vf-teal-deep)`
  - Always `outline-offset: 2px` to separate ring from any adjacent border

### Voice
- **No emoji.** Approved unicode glyphs only: `→ ↗ · — ° ± ∞`
- **No exclamation marks. No question marks.** Anywhere — body, headlines, product titles, alt text.
- **Headlines may end in periods** on complete declaratives ("Form follows light." "Four stages. One object.")
- **No words like:** "stunning," "premium," "perfect for," "amazing," "experience," "discover," "elevate," "luxury" (the brand *is* luxury; saying so is what cheap brands do).
- **Specific over evocative.** "0.08 mm wall, 196 hours of print" beats "meticulously crafted."

### Accessibility
- **Reduced motion:** every `transition` and `animation` on `.vf-*` must collapse under `prefers-reduced-motion: reduce`. Baseline rule lives in `assets/vf-tokens.css`.
- **Hit targets:** `min-height: 48px` and `min-width: 48px` for any tappable surface.
- **Type sizes:** never below 11px on mobile. Body is 14px.
- **Colour contrast:** Forge Teal (#3D7A6B) on Obsidian is 4.4:1 — display only at ≥1.5rem, never paragraph copy. Never reference `--vf-teal` directly for text; use the `--vf-color-eyebrow` semantic alias, which routes to `--vf-teal-bright` on Obsidian or `--vf-teal-deep` on Bone based on `[data-mode]` context.
- **Badge contrast:** Badge and tier-label text use surface-appropriate variants. Dark surfaces (Obsidian): Série I → `--vf-teal-bright`, Série II → `--vf-gold`, Atelier → `--vf-ember-bright`. Bone surfaces: Série I → `--vf-teal-deep`, Série II → `--vf-gold-deep`, Atelier → `--vf-ember-deep`. Direct `--vf-teal` and `--vf-ember` are display-only (≥1.5rem). Use `--vf-color-tier-*` aliases which dispatch automatically via `[data-mode]` context.

---

## 4 · Banned patterns

These will be flagged in code review. Don't ship them.

- `transition: all` → use explicit property list (`transition: background-color, color, border-color`)
- `1.5px` borders → 0.5px hairline default; 1px is the maximum rule weight
- Left-border accent cards (`border-left: …px solid …`) → use full hairline boxes
- Pill-shaped buttons / `border-radius: 999px` → square-cornered default; 4px max for inputs
- Forge Teal on body copy → Teal is display-only on dark backgrounds
- `font-weight: 600/700/800/900` → 300 / italic / 500-max. Bold is off-brand.
- Emoji of any kind → approved unicode glyphs only
- Hardcoded `1400px`, `48px`, etc. → reference `--vf-grid-*` tokens
- `768px` media queries → use `750px` to match Dawn

---

## 5 · Snippet contracts

These primitives live in `snippets/` and are called via `{% render %}`. Re-implementing any of them inline in a section is a bug — file an issue and use the snippet instead.

| Snippet | Purpose | Required params |
| --- | --- | --- |
| `vf-button` | All CTAs, primary and ghost | `label`, `href`, `variant` (`filled`/`ghost`), optional `size` |
| `vf-eyebrow` | Section eyebrows (small caps, tracked) | `text`; optional `color` (`teal` default / `gold` / `ember` / `bone`); optional `tier` (`I` / `II` / `Atelier`) |
| `vf-mono` | DM Mono utility text | `text`; optional `size`; optional `color`; optional `tier` (`I` / `II` / `Atelier`) |
| `vf-cube` | The IsoCube illustration | optional `size` (default 280), optional `glow` (boolean) |
| `vf-icon` | All icons from the 19-glyph set | `name` (one of: voxel, layers, lamp, home, precision, print, quality, package, delivery, certificate, forge, settings, search, user, cart, menu, atelier, edition, prestige), optional `size` |
| `vf-badge` | Tier badges (Série I/II/Atelier) | `tier` (`I` / `II` / `Atelier` / `SoldOut`) |
| `vf-edition-mark` | "04 / 30" numbered-edition mark | `current`, `total` |
| `vf-pull` | Pull-quote with hairline rule | `text`, optional `attribution`, optional `align` (`center`) |

### vf-eyebrow and vf-mono — dual color routing

`color` and `tier` are separate parameters with different semantic destinations. `color: 'ember'` routes to the display-tone palette (`--vf-ember`) — correct for large editorial type (≥1.5rem) but insufficient contrast at small sizes. `tier: 'Atelier'` routes through the semantic alias `--vf-color-tier-atelier`, which dispatches to `--vf-ember-bright` on Obsidian or `--vf-ember-deep` on Bone via `[data-mode]` context, enforcing contrast safety at any size.

Rule: for any element carrying tier identity — badges, collection header eyebrows, edition marks, "END OF EDITION" labels — use `tier:`. Reserve `color:` for large editorial accents where specific palette control is intentional and display size is guaranteed large. When both are passed, `tier` takes precedence. An empty-string or omitted `tier` falls back to `color`.

---

## 6 · Section porting workflow

When asked to port a section from React to Liquid:

1. **Read the corresponding JSX** in `ui_kits/website/`. It's the visual contract.
2. **Read the schema definition** in `docs/section-schemas.md` for that section. It tells you what's hardcoded vs editable.
3. **Create `sections/vf-<name>.liquid`** with: HTML structure → `{% style %}` block scoped to the section's class → `{% schema %}` JSON.
4. **Reference snippets** for buttons, eyebrows, icons, cube, badges. Don't inline.
5. **Use `block.settings.*`** for editable content. Use literal values for brand-locked surfaces (layout, type ramp, colour pairings).
6. **Test against Dawn's mobile breakpoint** (750px), not 768px.
7. **Check the section against `__BANNED__` list** before committing. If it has any banned pattern, fix it.
8. **When reducing `max_blocks`, clean up the customizer manually.** Shopify does not auto-remove blocks beyond the new limit. The customizer retains orphan blocks that fail validation on save. After deploying the schema change: open the customizer for every affected template, delete blocks above the new limit, then save.

**Section settings are global within a template.** Customizer settings (text, images) on a `templates/*.json` section are shared across all pages using that template — editing "subtitle" on `/collections/serie-1` propagates to every collection page. For content that must vary per page: use `{{ collection.description }}` (set in Shopify Admin → Collections) or `{{ collection.metafields.namespace.key }}` (define the metafield in admin first). Section settings are for content that is intentionally identical across all instances.

---

## 7 · Commit convention

Custom branches off `preprod`. Commit messages follow:

```
vf(<area>): <verb> <what>

<why, optional>
```

Examples:
- `vf(snippets): add vf-button with filled and ghost variants`
- `vf(sections): port hero from React; tokens, schema, reduced-motion`
- `vf(tokens): override Dawn page-width to 1400px to match VF grid`

`<area>` is one of: `tokens`, `snippets`, `sections`, `theme`, `schema`, `docs`.

---

## 8 · What to do when uncertain

If a request would require any of the following, **stop and ask**:

- Editing files outside the allowed prefix (`vf-*`, `vf-tokens.css`, `theme.liquid` token block). **Exception: `templates/*.json` config files are permitted** when wiring custom `vf-*` sections into templates — these are configuration, not Liquid logic, and follow the established pattern in `templates/collection.json`, `templates/list-collections.json`, etc.
- Modifying any default Dawn section (`main-product`, `header`, `footer`, etc.)
- Adding a new colour, font weight, or breakpoint not in `vf-tokens.css`
- Bypassing a snippet contract by re-implementing a primitive inline
- Disabling the reduced-motion baseline on a specific surface
- Anything involving `localStorage`, third-party trackers, or external API calls

Default to "ask the human" rather than guess. The kit was built carefully; small drifts compound.

---

## 9 · Dawn and Shopify mechanics

Patterns specific to how Dawn and Shopify behave. These take precedence over generic Shopify documentation.

### JSON template section IDs

Sections rendered via `templates/*.json` receive IDs of the form `shopify-section-template--{store_hash}__{section_key}`, where `{store_hash}` is a numeric store-specific ID assigned at install time — not derivable from theme source. CSS selectors and JS queries must use the attribute suffix form: `[id$="__{section_key}"]`. The double-underscore separator prevents false matches on short keys. The simple `shopify-section-{name}` format only applies to sections rendered via `{% section 'name' %}` calls in a Liquid layout file. First established fixing cart cross-sell suppression (§13).

### Dawn `details[open]` selector specificity

Dawn modal and drawer open states are controlled via `details[open]` at specificity (0,0,2) — two element-type selectors that beat single-class overrides at (0,0,1). Effective overrides require minimum (0,0,3): typically `.section-class details[open] .target` or an attribute-plus-element combination. A second class added to the rule is the minimum fix. Encountered in §10 (search modal) and §12 (nav drawer).

### Dawn-native surface re-scoping

To re-theme a Dawn section to a VF surface without editing Dawn files, override these Dawn custom properties on the section wrapper:

- `--color-background` — surface fill
- `--gradient-background` — gradient overlay (set equal to `--color-background` to suppress the gradient)
- `--color-foreground` — text and icon ink
- `--color-button` / `--color-button-text` — CTA surface and label

Anchor the override on `.section-class.gradient` at specificity (0,0,1,1), which beats Dawn's `.color-{scheme}` at (0,0,1,0). When specificity ties, source order is the tiebreaker — `vf-tokens.css` loads after `base.css`, giving it the win (confirmed in §1 Stack). Established in §11 (product page), §13 (cart), §14 (collection).

### Custom-element vs class selector durability

Dawn registers JavaScript-upgraded custom elements (`<header-drawer>`, `<menu-drawer>`, `<cart-notification>`, etc.), and Dawn's component CSS sometimes targets these by element tag name (e.g., `menu-drawer > details > summary::before`). Tag-name selectors are fragile: if Dawn renames or re-wraps the element in a future version, the rule silently stops matching. When writing VF overrides for Dawn component internals, use class-based selectors — `.menu-drawer-container > details > summary::before` survives element renames.

### Metafield namespace minimum length

Shopify enforces a 3-character minimum on metafield namespace identifiers. The `vf` prefix is two characters and is rejected at save time. The canonical metafield namespace for this project is `vox`. File names, CSS classes, and Liquid variable prefixes remain `vf-*` — the split is intentional and permanent. When adding new metafields: namespace = `vox`, key = snake_case descriptor (e.g., `vox.edition_size`, `vox.italic_subtitle`).

**Critical distinction** — do not unify these prefixes. `vf-*` applies to file naming, CSS classes, and Liquid section naming (vf-tokens.css, vf-collection-header, `.vf-edition-statement`). `vox.*` applies exclusively to metafield namespaces. Established metafield uses: `product.metafields.vox.edition_size` (Phase 1B, commit c2ca9e95) and `collection.metafields.vox.italic_subtitle` (§16).

### Conditional list separators via CSS `::before`

For flex lists where items are conditionally rendered in Liquid (e.g., breadcrumbs with optional middle segments), inject separators via CSS rather than HTML or Liquid markup. A `::before` pseudo-element on `.item:not(:first-child)` generates the separator only when a sibling precedes it — no trailing-separator edge case when the first item is conditionally absent, and no Liquid conditionals needed. The separator character belongs in the CSS `content` property, not the Liquid template. Established in `vf-product-header` breadcrumb (Phase 1B).

### Customiser orphan key persistence

When a section setting is removed from `{% schema %}`, the corresponding key in `templates/*.json` is not automatically cleared — Shopify retains it, and the Customiser may restore the value on the next admin save. Atomic cleanup pattern: remove the key from both the schema and the JSON template in the same commit. If the admin has already cleared the field via the Customiser, the JSON stores `"key": ""` (empty string), not a missing key — the entry still exists and must be explicitly removed. A schema-only commit leaves a stale key that resurfaces on the next Customiser save.

**Before (stale key remains after schema-only removal):**
```json
"vf-collection-header": {
  "type": "vf-collection-header",
  "settings": {
    "italic_subtitle": ""
  }
}
```

**After (atomic cleanup — schema removal + JSON key deletion in one commit):**
```json
"vf-collection-header": {
  "type": "vf-collection-header",
  "settings": {}
}
```

Confirmed in §16: `italic_subtitle` was removed from the section schema and simultaneously deleted from `templates/collection.json`.

### Section settings vs metafields — refactor signal and pattern

Detection signal: `section.settings.X` in Liquid for content that should differ per page. Confirm by attempting to change the value for one page — if the change propagates to all pages of the same template, the value belongs in a metafield. Refactor path: (1) change the Liquid read from `section.settings.X` to `resource.metafields.vox.X`; (2) remove the setting from `{% schema %}`; (3) remove the key from `templates/*.json` — all three changes in one atomic commit. The principle is stated in §6; the atomic three-step commit pattern is the implementation detail worth remembering. Confirmed in §16 (collection page italic subtitle).

**Admin workflow for the refactor:** in Shopify Admin, navigate to Settings → Custom data → Collections (or Products, Pages, etc.) and define the metafield (`vox.italic_subtitle`, type Single line text) before deploying the Liquid change. The metafield must exist in admin before the storefront reads it — deploying the Liquid read first produces a blank value, not an error, which can be mistaken for a Liquid bug. Set values per-resource after the metafield is defined.

| Content type | Where to set | Scope |
| --- | --- | --- |
| Identical across all pages of template | `section.settings.*` via Customiser | All pages sharing that template |
| Varies per collection / product / page | `resource.metafields.vox.*` via Admin | One record at a time |
| Varies per collection, auto-populated | `collection.description` | One record at a time |

### CSS specificity vs source order with body-injected stylesheets

Dawn component CSS is loaded via `{{ stylesheet_tag }}` calls inside section Liquid files, placing `<link>` tags in the document body. `vf-tokens.css` is loaded in `<head>` via `theme.liquid`. Browsers process `<link>` tags in document order — body-injected stylesheets load after all head-injected stylesheets. At equal specificity, the later (body-injected) rule wins. This means Dawn component rules at a given specificity will override `vf-tokens.css` rules at the same specificity even when `vf-tokens.css` is the intended winner.

Implication: do not rely on source-order wins when overriding Dawn component CSS from `vf-tokens.css`. Use `!important` for suppression rules where Dawn's component CSS must be decisively overridden. Document the reason for `!important` at the rule site — it is the correct response to the load-order asymmetry, not a specificity hack.

Established in §17 (`vf-cart-empty`): suppressing `.cart__warnings` required `!important` because `component-cart.css` is body-injected and matched the same (0,2,0) specificity as the suppression rule in `vf-tokens.css`.

### Axis-scoped CSS resets on `.page-width` containers

Dawn's `.page-width` class (defined in `base.css`) applies `padding: 0 1.5rem` on mobile and `padding: 0 5rem` at ≥750px, along with `margin: 0 auto`. Applying a blanket `padding: 0` or `margin: 0` reset on an element carrying `.page-width` overrides the inline padding at equal specificity via source order, causing content to bleed to the container edge.

Fix: use axis-scoped resets. `padding-block: 0` zeroes block-axis padding without touching inline padding. `margin-block: 0` zeroes block-axis margin without disturbing the `auto` inline margins that centre the container.

```css
/* Wrong — bleeds content past container edge */
.vf-section__grid {
  padding: 0;
  margin: 0;
}

/* Correct — resets only block axis; preserves .page-width inline padding */
.vf-section__grid {
  padding-block: 0;
  margin-block: 0;
}
```

Applied in §17 (`vf-cart-empty__grid`) and §14 (`vf-collection-list__grid`). Applies to any element combining a custom class with `.page-width` where block padding must be zeroed without disturbing horizontal container margins.

### Whitespace-trim discipline on inline render calls

The §3 rule captures the principle. The concrete manifestation: `{%- ... -%}` trim dashes collapse whitespace (including the space character) on both sides of the tag. When a `{% render %}` call sits between words in running text, the leading trim eats the space before the snippet output.

```liquid
{# Wrong — produces "Edition ofseventy" #}
<p>Edition of {%- render 'vf-num-words', n: edition_size -%}</p>

{# Correct — preserves word spacing around snippet output #}
<p>Edition of {% render 'vf-num-words', n: edition_size %}</p>
```

Rule of thumb: if a render tag is surrounded by text nodes, omit trim dashes. If it is surrounded only by HTML elements or whitespace-only Liquid tags (producing block-level markup with no adjacent text), trim dashes are fine. Established in Phase 1B (`vf-edition-statement`).

### Explicit surface declaration required on every VF section

Body-level CSS inheritance (e.g., `body { background: var(--vf-obsidian) }`) does NOT reliably propagate through Dawn's wrapper hierarchy. Dawn's `<main>` element or `.shopify-section` wrapper can interpose its own `background-color` via Dawn's color-scheme system, breaking visual inheritance even though cascade analysis suggests otherwise.

Rule: every VF section must explicitly declare both `background-color` and `color` on its outermost wrapper. No exceptions.

```css
.vf-section-name {
  background-color: var(--vf-obsidian); /* or --vf-bone */
  color:            var(--vf-bone);     /* or --vf-jet */
  /* ... other properties */
}
```

Anti-pattern: relying on body inheritance for section background. May appear to work in cascade analysis (`vf-tokens.css` §7 `body { background: var(--vf-obsidian) }` loads after `theme.liquid` inline style at same specificity) but fails in production because Dawn's intervening wrapper rules can override at higher specificity or via `.color-scheme-*` class application.

Reference: §18 journal theming initial implementation shipped without explicit `background-color` on `.vf-journal-index` and `.vf-journal-article` wrappers, resulting in article body content rendering against Dawn's light scheme background (invisible Bone-on-white text). Fix added explicit declarations to §18 A. This rule was previously implicit; the §18 fix promotes it to explicit. Apply to every future VF section. The `vf-statement`, `vf-process`, `vf-cart-empty`, `vf-collection-list` sections already follow this pattern.

---

## 10 · QA and verification

### Computed values over screenshots for tier and contrast

Tier accent colors on Bone surfaces — Teal Deep `#2A5A50`, Gold Deep `#7A5C25`, Ember Deep `#A04A35` — are dark, low-saturation variants calibrated for contrast, not vividness. Compressed screenshots and image-viewer apps shift these toward neutral grey, making correct dispatch appear broken. DevTools computed value is ground truth. When QA flags a tier accent as "muted" or "grey": open DevTools Elements panel, select the element, read `color` in the Computed tab. Correct hex confirms the dispatch is working; the screenshot was misleading.

### Screenshot tooling artifacts vs real defects

Shopify theme preview and headless screenshot tools can omit sections that require JavaScript initialization — product media galleries, nav drawers, search modals, and carousel components are common casualties. A component "missing" in a screenshot does not confirm it is broken in the storefront. Verify against the live browser before starting diagnostic work. Sending an agent on a component-diagnostic based solely on a screenshot is a likely false alarm.

### DevTools verification before accepting "no code change needed"

When an agent concludes that no code change is needed after a code-path trace, the conclusion covers logical correctness of the dispatch chain — not necessarily what the live storefront renders. Closing the gap takes 30 seconds: inspect the element in DevTools, confirm the computed value of `color` (or relevant property) matches the expected token. This applies especially to tier color dispatch, `data-mode` inheritance, and CSS custom property chains that are invisible to static code analysis.

### Screenshot perception unreliable for editorial register surfaces

Bone (#E8E2D6) text on Obsidian (#0A0A0A) at opacity 0.65–0.9 reads cleanly in a live browser at normal brightness but can render as visibly dim in PNG screenshots due to image compression and ambient-lighting differences in screenshot review contexts.

When QA-ing editorial register surfaces, verify rendering in a live browser at normal display brightness. Do not rely on screenshot inspection alone to diagnose perceived legibility issues.

If a screenshot shows text "disappearing":

1. First check DevTools computed `color` value — confirms actual rendered color
2. Then check DevTools computed `background-color` on the surrounding element — confirms actual surface
3. Only after computed-style verification, decide whether the issue is:
   - Genuine surface bug (background wrong) → fix surface
   - Genuine text bug (color wrong) → fix text color
   - Compression artifact (computed values are correct) → no fix needed

Reference: §18 Round 2 → Round 3 debugging cycle. DevTools confirmed `color: rgb(232, 226, 214)` on `.vf-journal-index__title` was correct. The actual bug was a separate `background-color` issue on the section wrapper, not the text color. Both bugs were initially conflated due to relying on screenshot inspection.
