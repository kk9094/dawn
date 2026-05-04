# Section Schemas — Voxel Forge Dawn Port

> Per-section contract for `{% schema %}` blocks. When porting a section
> from React to Liquid, refer to this document to decide what's
> hardcoded (brand-locked) vs merchant-editable (theme customiser).
>
> The principle: **layout, type ramp, colour pairings, and structural
> hairlines are brand-locked.** Copy, images, and links are editable.
> If a setting could let a merchant break the brand, it doesn't ship.

---

## How to read this document

Each section has three tables:

- **Hardcoded** — values baked into the Liquid file. The merchant can't change these without editing code.
- **Editable (settings)** — top-level `settings` array. Single instances per section.
- **Editable (blocks)** — repeating blocks (e.g. metric pairs, link rows).

The "Type" column maps to Shopify's input types: `text`, `richtext`, `image_picker`, `url`, `collection`, `product`, `select`, `number`, `range`, `checkbox`, `header`, `paragraph`.

---

## 1 · `vf-hero` (Hero)

### Hardcoded
| What | Why |
| --- | --- |
| Layout (60/40 grid, vertical centring, 120px section padding) | Brand-locked composition |
| Type ramp (Cormorant Display 1 + DM Sans body) | Type system |
| IsoCube illustration (always present, always right column) | Identity element |
| Iso-grid background pattern at 6% opacity | Brand texture rule |
| Reveal-on-mount animation (600ms stagger) | Motion system |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Voxel Forge · Chennai · Edition 2026" |
| `headline_part_1` | text | Headline (first line, regular) | "Form follows" |
| `headline_part_2` | text | Headline (second line, italic) | "light." |
| `body` | richtext | Body copy | "Precision 3D-printed sculptural lighting…" |
| `cta_primary_label` | text | Primary CTA label | "See the editions" |
| `cta_primary_href` | url | Primary CTA link | `/collections/all` |
| `cta_secondary_label` | text | Secondary CTA label | "Read the brief" |
| `cta_secondary_href` | url | Secondary CTA link | `/pages/about` |
| `feature_image` | image_picker | Feature image | — |

> **Figure column:** When `feature_image` is blank the IsoCube renders at 420px with glow. When set, the image replaces the cube entirely — the figure div gains the modifier class `vf-hero__figure--media`, which applies `aspect-ratio: var(--vf-ratio-process)` and `overflow: hidden`. The cube is never rendered alongside the image.
>
> **`aria-hidden="true"`** is set on the figure div unconditionally. In the IsoCube state the cube is decorative. In the image state the image carries the section's content meaning through the alt text supplied to `image_tag` — but the `<section>` itself is labelled by `#vf-hero-title` (via `aria-labelledby`), so the figure is supplementary. Hiding it from the accessibility tree is correct in both states.
>
> **Mobile figure behavior:** The hero has no `display: none` on the figure at mobile. Below 750px the inner grid collapses to a single column — figure renders full-width below the copy. The section has `overflow: hidden`, so the 420px IsoCube is center-cropped to the viewport width. The **center face** of the cube is the intended visible region at mobile widths — not the corner glow or the iso-grid pattern, which may not be visible at this crop. This is cropped-as-designed, not broken. The feature image (when set) renders correctly at all widths via `aspect-ratio` on the `--media` modifier.

### Editable (blocks)
Block type `metric` — repeating. Maximum 3 blocks. Renders as the metric stack at bottom of hero.
| ID | Type | Label |
| --- | --- | --- |
| `value` | text | Value (e.g. "0.08 mm") |
| `label` | text | Label (e.g. "Wall thickness") |

---

## 2 · `vf-statement` (Statement)

### Hardcoded
| What | Why |
| --- | --- |
| Bone background (`data-mode="bone"`) | Single bone-mode surface in the homepage |
| Centred composition, 80% max-width, italic Cormorant | Brand-locked composition |
| Two italic Teal Deep accents in the prose | Voice system |
| Mono attribution line below | Type system |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `quote_html` | richtext | Quote HTML (use `<em>` for Teal italic accents) | "Light defines its <em>geometry</em>; geometry defines the <em>object</em>." |
| `attribution` | text | Attribution | "Studio note · 2026" |

### Editable (blocks)
None. The statement is a single moment.

---

## 3 · `vf-process` (Process)

### Hardcoded
| What | Why |
| --- | --- |
| 4-column grid (1-col mobile) | Brand-locked rhythm |
| Hairline column dividers | Brand structural element |
| Step number above title (Mono, 11px base) | Type system |
| Gold tick mark at column top | Prestige sparingly — fine here |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Method · 04 stages" |
| `headline_part_1` | text | Headline (first half) | "Four stages." |
| `headline_part_2` | text | Headline (italic, second half) | "One object." |
| `method_label` | text | Link label | "Read the full method" |
| `method_url` | url | Link URL | — |

### Editable (blocks)
Block type `step` — required exactly 4. Lower or higher counts will read wrong against the headline.
| ID | Type | Label |
| --- | --- | --- |
| `number` | text | Step number (e.g. "01") |
| `title` | text | Step title (e.g. "Geometry") |
| `body` | richtext | Step body |

---

## 4 · `vf-collection` (Collection grid)

### Hardcoded
| What | Why |
| --- | --- |
| 3-column tile grid (1-col mobile) | Brand-locked composition |
| Tile aspect ratio: `var(--vf-ratio-portrait)` (4/5) | Aspect-ratio token enforcement |
| Tier badge on tile (Série I/II/Atelier) | Identity element |
| Hover scale 1.04 on lamp image | Motion system |
| Bottom gradient overlay always-on | Motion system |
| **Three-tile architecture:** Série I + Série II from collection (limit: 2), Atelier tile static | Atelier is commission-only — no product SKU exists. Static tile hardcodes href="/pages/atelier", title="Commission", subtitle="Atelier · 1 of 1", price="On request" in Ember Bright. Hover adds `border-color: --vf-ember-bright` transition (motion-gated). Block path skips any block where `tier == 'Atelier'` and always appends the same static tile. |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Editions · 2026" |
| `headline_part_1` | text | Headline (first part) | "Three editions." |
| `headline_part_2` | text | Headline (italic, second part) | "Open now." |
| `source_collection` | collection | Source collection | (unset — uses blocks if empty) |

### Editable (blocks)
Block type `tile` — used when `source_collection` is unset. Maximum 3 (matches the headline copy).
| ID | Type | Label |
| --- | --- | --- |
| `product` | product | Product |
| `tier` | select | Tier — options: I, II, Atelier |
| `name_override` | text | Display name (optional) |
| `subtitle` | text | Subtitle (e.g. "Lamp", "Pendant · gold", "Commission · 1 of 1") |

> **Note:** When `source_collection` is set, tier is derived from product
> tags (`serie-1`, `serie-2`, `atelier`). Tag-based tier dispatch is the
> preferred mechanism — block fallback is for catalogue bring-up only.
>
> **Note:** "On request" is hardcoded for `atelier`-tagged tiles in the collection path.
> There is no merchant price-override setting. This prevents "On request" from
> being misused as promotional copy in violation of voice rules.
>
> **Note:** In the collection path, subtitle falls back to `product.product_type`
> until a `custom.subtitle` metafield is wired up. Block path subtitle is
> editable per tile via `block.settings.subtitle`.

---

## 5 · `vf-material` (Material block)

### Hardcoded
| What | Why |
| --- | --- |
| 60/40 image+text split (column-stacked mobile) | Brand-locked composition |
| Section background: `--vf-graphite` — the only homepage section that does not run on Obsidian | Brand-locked surface |
| Figure background: `--vf-obsidian` inside the Graphite section | Material contrast rule |
| Figure aspect ratio: `var(--vf-ratio-process)` (3/2) | Aspect-ratio token enforcement |
| Figure caption: 9px micro — editorial annotation chrome, deliberate exception to the 11px accessibility floor | Editorial framing |
| Iso-grid pattern at 6% opacity behind cube | Brand texture rule |
| Spec table layout (key/value rows, hairline dividers) | Type system |
| Spec row value default: Bone (`--vf-fg-1`). Forge Teal at 11px violates the display-only-on-dark rule (V1.3 review fix) | Type system |
| Body copy `max-width: 460px` — deliberate typographic measure, same category as Statement's 880px. Not a layout grid value. | Readability |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Material · Method" |
| `headline_part_1` | text | Headline (first half) | "Engineered" |
| `headline_part_2` | text | Headline (italic, second half) | "from the inside." |
| `body` | richtext | Body copy | "A gyroid lattice carries the load. Light scatters through it." |
| `figure_caption` | text | Figure caption | "FIG. 04 · INTERNAL GEOMETRY · GYROID 40%" |
| `figure_image` | image_picker | Figure image | — |
| `pull_text` | text | Pull-quote text | "Lighter than aluminium. Stronger than ABS." |
| `pull_attribution` | text | Pull-quote attribution | "Engineering note · 2026" |

> **Figure image:** When `figure_image` is blank the IsoCube renders at 340px (no glow). When set, the image replaces the cube — `.vf-material__media` slots in as `position: absolute; inset: 0; z-index: 1` so it fills the same aspect-ratio container. The caption overlays at `z-index: 2` in both states.

### Editable (blocks)
Block type `spec_row` — repeating. Maximum 8.
| ID | Type | Label |
| --- | --- | --- |
| `key` | text | Spec key (e.g. "Wall thickness") |
| `value` | text | Spec value (e.g. "0.08 mm") |
| `accent` | select | Accent — options: none, gold |

> Use `accent: gold` for prestige rows (print time, edition limit).
> Default `accent: none` renders the value in Bone — never Teal at body sizes.

---

## 6 · `vf-atelier` (Atelier CTA)

### Hardcoded
| What | Why |
| --- | --- |
| Ember accent throughout (eyebrow, glow, hover) | Atelier-only colour discipline |
| Radial corner glow at 6% opacity | Atelier surface signature |
| Two-column 1fr/auto layout with hairline left-divider on metrics column (rotates to top-divider on mobile) | Brand-locked composition |
| Three metric pairs stacked vertically (mono) | Type system |
| Inner max-width 1100px (deliberate typographic literal — Atelier is intentionally narrower than the site grid; same category as Statement's 880px) | Composition |
| Body max-width 480px (deliberate typographic literal, same category as Material's 460px) | Readability |
| Headline em renders in `--vf-ember`, NOT `--vf-fg-3` (Atelier-specific; the JSX in the kit had drift here that was corrected at port) | Ember-only colour discipline |
| Metric values render in Ember at `--vf-fs-mono-display` (26px). Metric labels render at 9px — editorial annotation exception, same register as Material's FIG. caption | Type system |
| CTA button uses `variant: 'ember'`. Filled (Teal) and ghost variants are banned on this surface | Ember-only colour discipline |
| Corner glow: `::before` pseudo-element, radial-gradient at 6% Ember, top: -200px, right: -200px, 600×600px. README v1.3 fixed the opacity at 0.06 | Atelier surface signature |
| Colour discipline: no Forge Teal, no Gold anywhere on this section or its descendants. Only Ember (with Bone for foreground text) | Atelier-only colour discipline |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Atelier · Commission" |
| `headline_part_1` | text | Headline (first half) | "One object." |
| `headline_part_2` | text | Headline (italic, second half) | "Made for one room." |
| `body` | richtext | Body copy | "Atelier commissions are designed alongside the architect…" |
| `cta_label` | text | CTA label | "Request a commission" |
| `cta_href` | url | CTA link | `/pages/atelier` |
| `next_intake` | text | Next intake mono line | "NEXT INTAKE · Q3 2026 · 4 OF 4 SLOTS REMAIN" |

### Editable (blocks)
Block type `metric` — required exactly 3. Renders as the metric row.
| ID | Type | Label |
| --- | --- | --- |
| `value` | text | Value |
| `label` | text | Label |

---

## 7 · `vf-footer` (Footer)

### Hardcoded
| What | Why |
| --- | --- |
| 4-column link grid + 1-column newsletter (1-col mobile) | Brand-locked composition |
| Hairline column dividers | Brand structural element |
| Logo: `shopify_logo.svg` at 128×32 (single-line, 32px height — lighter footer register than the 40px header). Replaces the original wordmark spans; the `.vf-wordmark__*` classes in `vf-tokens.css` are preserved as orphaned but reserved tokens for future packaging or certificate surfaces. | Identity element |
| Bottom-bar mono text (workshop / edition / year) | Type system |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `newsletter_eyebrow` | text | Newsletter eyebrow | "A quarterly note from the workshop floor." |
| `newsletter_body` | richtext | Newsletter body | "Production updates, edition openings…" |
| `newsletter_cta_label` | text | Submit button label | "Subscribe" |
| `bottom_bar_text` | text | Bottom-bar mono text | "Voxel Forge · Chennai · 2026" |

### Editable (blocks)
Block type `link_column` — repeating. Maximum 4.
| ID | Type | Label |
| --- | --- | --- |
| `title` | text | Column title (e.g. "Editions", "Atelier", "Studio") |
| `link_1_label` | text | Link 1 label |
| `link_1_url` | url | Link 1 URL |
| `link_2_label` | text | Link 2 label |
| `link_2_url` | url | Link 2 URL |
| `link_3_label` | text | Link 3 label |
| `link_3_url` | url | Link 3 URL |
| `link_4_label` | text | Link 4 label |
| `link_4_url` | url | Link 4 URL |

> Four links per column is the cap. If a column needs five, the column needs splitting. The grid breaks otherwise.

---

## 8 · Header customisations (no `vf-header` section — modify Dawn's `header.liquid` token block only)

The header is the one place where modifying a Dawn file is acceptable, because the wordmark + nav lockup is brand-defining.

### Hardcoded changes to `header.liquid`
| What | Why |
| --- | --- |
| Logo: hardcoded `shopify_logo.svg` asset (160×40 desktop, 128×32 mobile). Customiser logo settings (`settings.logo`, `settings.logo_width`, etc.) are theme-level — they remain available in Theme settings but are no longer rendered. `logo_position` and `mobile_logo_position` section schema settings are preserved (layout-position, not logo-image). See comment block in `sections/header.liquid` for the AGENTS.md §2 sanction. | Identity |
| Nav link tracking: `var(--vf-track-label)` (0.18em) | Type system |
| Nav link colour: `var(--vf-fg-1)` | Type system |
| Sticky on scroll, 0.5px hairline at bottom | Brand-locked behaviour |

No new `settings` introduced — header content (nav links, announcement bar) continues to use Dawn's existing schema.

> **Responsive breakpoint note:** Real browser windows at 990px width report approximately 975px CSS viewport due to scrollbar reservation (~15px). The mobile drawer appears at this exact window width. Chrome DevTools device-emulation mode reports the inner viewport directly, so "990px" there shows the desktop nav correctly. Both behaviors are correct per Dawn's `min-width: 990px` responsive design — this is not a bug.

---

## Universal schema rules

These apply to every section's `{% schema %}` block.

### `presets`
Every section ships with at least one preset so it appears in the section picker. Naming convention: "Voxel Forge · &lt;Section name&gt;".

```json
"presets": [
  {
    "name": "Voxel Forge · Hero",
    "category": "Voxel Forge",
    "settings": {
      "eyebrow": "Voxel Forge · Chennai · Edition 2026"
    }
  }
]
```

### `settings` ordering
Use `header` and `paragraph` types to group:

```json
{
  "type": "header",
  "content": "Headline"
},
{
  "type": "text",
  "id": "headline_part_1",
  "label": "Headline (first part)",
  "default": "Form follows"
}
```

### `enabled_on` / `disabled_on`
Brand sections are pinned to the homepage and a few key landing templates:

```json
"enabled_on": {
  "templates": ["index", "page", "collection"]
}
```

### Block validation
For sections that require an exact count of blocks (Process needs 4 steps, Atelier needs 3 metrics):

```json
"max_blocks": 4
```

Don't enforce minimums in schema — Shopify will simply not render missing blocks. Document the requirement in the block label instead: "Step 01 of 04 (4 required)".

---

### Eyebrow colour token — `--vf-color-eyebrow`

The `vf-eyebrow` snippet's `teal` variant (the default) and the `vf-mono` snippet's `teal` variant both resolve through the semantic token `--vf-color-eyebrow` rather than direct `--vf-teal`. This token cascades by surface:

| Surface | Resolves to | Contrast vs background |
| --- | --- | --- |
| Default (Obsidian) | `--vf-teal-bright` (#5BA89A) | 7.1:1 |
| `[data-mode="bone"]` | `--vf-teal-deep` (#2A5A50) | 6.1:1 on Bone |
| `.vf-atelier` | `--vf-ember-bright` (#DD7A60) | 6.6:1 on Obsidian |

**Why this matters:** `--vf-teal` (#3D7A6B) is 3.95:1 on Obsidian — it fails WCAG AA for small text (4.5:1 required). Teal remains in the palette for display-size uses only.

**Naming note:** `.vf-eyebrow--teal` and `.vf-mono--teal` are now semantically "use surface accent", not literally Forge Teal. A future refactor should rename both the CSS classes to `--accent` and rename the token to `--vf-color-accent` (or `--vf-color-accent-small`). Not in scope until the full snippet API review.

**Adding a new surface override:** Set `--vf-color-eyebrow` on the section root selector's CSS rule. It will cascade to all eyebrow and mono-teal descendants automatically.

**Snippet colour variant pattern — bright tokens for small text:** Snippet colour variants on dark surfaces are progressively routed through bright or semantic tokens for WCAG AA contrast. `vf-eyebrow--teal`, `vf-mono--teal`, and `vf-mono--ember` all now resolve to their bright equivalents (`--vf-teal-bright`, `--vf-teal-bright` via `--vf-color-eyebrow`, and `--vf-ember-bright` respectively). The direct `--vf-teal` and `--vf-ember` tokens should be reserved for display-size uses (≥ 1.5rem) where WCAG large-text rules apply (3:1 minimum vs 4.5:1 for small text). When adding new colour variants to snippets, default to the bright token and document the contrast ratio.

---

### Known deferred issues

**`vf-button.liquid` bone-mode hover contrast (deferred — post-QA)**
`[data-mode="bone"] .vf-btn--filled:hover` sets `background: var(--vf-teal)` with inherited `color: var(--vf-bone)`. Bone (#E8E2D6) on Teal (#3D7A6B) = 3.95:1 — fails WCAG AA for 14px/300-weight body text. The current build has no filled button on a bone-mode surface (Statement section has no CTA), so this is latent. Fix in a dedicated button-contrast pass after QA completes.

**`.header__submenu` colour scheme (deferred — when nav grows)**
The dropdown submenu renders with `class="header__submenu ... color-{{ section.settings.menu_color_scheme }} gradient ..."` — it carries its own Customiser colour scheme, separate from the header wrapper's scheme. The `vf-tokens.css §8` header override targets `.header-wrapper` and does not reach into `.header__submenu`. If nav expands beyond top-level links, add a parallel token re-scope on `.header__submenu` (same pattern: `--color-foreground`, `--color-background`, hover rules). Not needed while the nav is top-level-only.
