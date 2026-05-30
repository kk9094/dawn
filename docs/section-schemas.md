# Section Schemas — Voxel Forge Dawn Port

> Per-section contract for `{% schema %}` blocks. When porting a section
> from React to Liquid, refer to this document to decide what's
> hardcoded (brand-locked) vs merchant-editable (theme customiser).
>
> The principle: **layout, type ramp, colour pairings, and structural
> hairlines are brand-locked.** Copy, images, and links are editable.
> If a setting could let a merchant break the brand, it doesn't ship.
>
> Coverage is incremental: homepage sections and site chrome are
> documented first, with template-bound and template-fragment sections
> added as they are ported. Sections not yet listed below are present
> in `/sections/vf-*.liquid` but await documentation.

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
| `eyebrow` | text | Eyebrow | "Voxel Forge · India · Edition 2026" |
| `headline_part_1` | text | Headline (first line, regular) | "Form follows" |
| `headline_part_2` | text | Headline (second line, italic) | "light." |
| `body` | richtext | Body copy | "Precision 3D-printed sculptural objects in numbered editions…" |
| `cta_primary_label` | text | Primary CTA label | "See the editions" |
| `cta_primary_href` | url | Primary CTA link | — |
| `cta_secondary_label` | text | Secondary CTA label | "Read the brief" |
| `cta_secondary_href` | url | Secondary CTA link | — |
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
| Gold tick mark at column top | Open brand-judgment item — Gold reads as the Atelier / Série II tier accent elsewhere in the system. Its use on a generic-editorial Process surface conflicts with that reservation. Tracked in the project-state Open questions; not resolved here. |

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

> Deployed on: `templates/index.json` (homepage) AND `templates/page.process.json`. The page instance uses headline "The Process. / Stage by stage." with `method_label`/`method_url` blank (no self-referential anchor). Both instances render via Customizer `step` blocks — same mechanism, no schema divergence. The homepage instance was the original; the page instance was added 2026-05-30 (`cb28ca43`).

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
| **Three-tile architecture:** Série I + Série II from collection, Atelier tile static | Atelier is commission-only — no product SKU exists. Static tile hardcodes href="/pages/atelier", title="Commission", subtitle="Atelier · 1 of 1", price="On request" in Ember Bright. Hover adds `border-color: --vf-ember-bright` transition (motion-gated). Block path skips any block where `tier == 'Atelier'` and always appends the same static tile. |
| **Tile order fixed to brand hierarchy** (Série I → Série II → Atelier) | Two separate passes over the collection, each breaking on first matching tier tag. Collection sort order is ignored. If the source collection lacks a `serie-1` or `serie-2` tagged product, that tile position renders empty — intentional fail-loud behavior. The static Atelier tile is unconditional and always renders in position 3 regardless of source collection contents. |

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
| `bottom_bar_text` | text | Bottom-bar mono text | "Voxel Forge · India · 2026" |

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

## 9 · `vf-materials` (Production methodology page)

### Hardcoded
| What | Why |
| --- | --- |
| Bone register surface (`data-mode="bone"`) | Transactional page surface |
| `.page-width--narrow` container | Editorial measure for long-form prose |
| Fixed editorial sequence: eyebrow → headline → lead → rule → five numbered sections → closing | Brand-locked composition |
| Hairline rule between lead and section 1 | Brand structural element |
| H1 headline (single per page — page heading register) | Type system |
| Section heading register (H2 per numbered section) | Type system |
| `enabled_on: templates: ["page"]` — pinned to page template | Section is wired to `/pages/materials` only |
| Single section, no blocks — five content sections are fixed-count schema settings | Editorial layout is brand-locked; sections cannot be added or removed |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow text | "Production" |
| `headline` | text | Page heading | "Production methodology." |
| `lead` | richtext | Lead paragraph (italic) | "The material and production methodology behind the studio's current lighting line." |
| `section_1_title` | text | Section 1 heading | "The shade" |
| `section_1_body` | richtext | Section 1 body | "Every shade in both Série I and Série II is printed in Bambu Lab PLA Basic — Jade White…" |
| `section_2_title` | text | Section 2 heading | "Print methodology" |
| `section_2_body` | richtext | Section 2 body | "Shades are printed on the Bambu Lab P2S at 0.16mm layer height across both Série I and Série II…" |
| `section_3_title` | text | Section 3 heading | "Série I hardware" |
| `section_3_body` | richtext | Section 3 body | "Série I pieces use the Bambu Lab LED Lamp Kit 001 — a self-contained lighting module…" |
| `section_4_title` | text | Section 4 heading | "Série II hardware" |
| `section_4_body` | richtext | Section 4 body | "Série II pieces use a metal base with a standard E27 socket, manufactured to studio specification…" |
| `section_5_title` | text | Section 5 heading | "On the current catalogue" |
| `section_5_body` | richtext | Section 5 body | "The sculptural designs in Série I and Série II are produced under license from Leora Studio, a design house specialising in printable lighting designs…" |
| `closing` | richtext | Closing line (italic) | "Materials and methodology, made open. Designs evolve. Discipline does not." |

### Editable (blocks)
None. Editorial sequence is fixed-count by schema design — five content sections, no block-based extensibility.

---

## 10 · `vf-collection-header` (Collection page header)

### Hardcoded
| What | Why |
| --- | --- |
| Bone register (`data-mode="bone"`) | Transactional collection surface |
| `.page-width` container | Standard grid width on collection pages |
| `data-tier` dispatch on inner wrapper (handle → `i` / `ii` / `atelier`) | Downstream tier-aware re-skin via CSS sibling selectors |
| Edition-count auto-render (`collection.products_count`, zero-padded) | Edition rhythm convention |
| Replaces Dawn's `main-collection-banner` | Brand-locked surface; no Dawn header retained |

### Editable (settings)
None — content derives from `collection.title`, `collection.description`, and `collection.metafields.vox.italic_subtitle`. The italic subtitle metafield must be defined in Shopify Admin → Settings → Custom data → Collections (`vox.italic_subtitle`, single line text) before values appear; see CLAUDE.md §9 "Section settings vs metafields".

> Deployed on: `templates/collection.json`.

---

## 11 · `vf-collection-footer` (End-of-edition closing mark)

### Hardcoded
| What | Why |
| --- | --- |
| Bone register (`data-mode="bone"`) | Pairs with collection header surface |
| Centred hairline + tier-accented "END OF EDITION" label | Brand structural element |
| Tier dispatch by `collection.handle` (Série I / II / Atelier) | Carries the same tier ink as the header |
| Must render after `main-collection-product-grid` in `collection.json` | Sequencing rule — closing mark, not a header |

No editable settings.

> Deployed on: `templates/collection.json`.

---

## 12 · `vf-collection-list` (Three-tier collection directory)

### Hardcoded
| What | Why |
| --- | --- |
| Bone register (`data-mode="bone"`) | Transactional list surface |
| Hardcoded three-tile architecture (Série I → Série II → Atelier) | Brand catalogue is fixed-shape, not merchant-extensible |
| Tile URLs: `/collections/serie-1`, `/collections/serie-2`, `/pages/atelier` | Atelier is commission-only (no collection record) |
| Per-tile fallback: collection's `featured_image` if `image_*` setting is blank | Avoids empty tiles during catalogue bring-up |
| Replaces Dawn's `main-list-collections` on `/collections` | Brand-locked surface |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `heading` | text | Page heading | "Collections" |
| `image_i` | image_picker | Série I — tile image | — |
| `image_ii` | image_picker | Série II — tile image | — |
| `image_atelier` | image_picker | Atelier — tile image | — |
| `closing_quote` | text | Closing pull-quote | — |

> Deployed on: `templates/list-collections.json`.

---

## 13 · `vf-product-header` (PDP breadcrumb)

### Hardcoded
| What | Why |
| --- | --- |
| Three-segment breadcrumb (Collection → tier collection → product title) | Brand-locked navigation pattern |
| Tier-collection segment auto-resolves from `product.collections` (`serie-1`/`serie-i`/`serie-2`/`serie-ii`) | Tier dispatch from tags |
| Middle segment conditionally rendered; CSS `::before` separators | See CLAUDE.md §9 "Conditional list separators via CSS `::before`" |
| Pinned into `templates/product.json` directly (no `enabled_on`, no `presets`) | Single-use; not customiser-surfaced |

No editable settings.

> Deployed on: `templates/product.json`.
>
> Note: this is a **section**, not a snippet — the file is `sections/vf-product-header.liquid`. Path confusion is common because PDP chrome conventionally lives in snippets in other themes.

---

## 14 · `vf-cart-empty` (Empty-cart editorial fallback)

### Hardcoded
| What | Why |
| --- | --- |
| Bone register (`data-mode="bone"`) | Pairs with cart page surface |
| Renders only when `cart == empty`; zero DOM output otherwise | Conditional surface — never bleeds into populated cart |
| Three-tile architecture mirrors `vf-collection-list` (Série I → Série II → Atelier) | Cross-surface tile consistency |
| Per-tile fallback: collection's `featured_image` if `image_*` setting blank | Same fallback discipline as `vf-collection-list` |
| Suppresses Dawn's `.cart__warnings` via `vf-tokens.css` §17 (`!important`) | See CLAUDE.md §9 "CSS specificity vs source order with body-injected stylesheets" |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `image_i` | image_picker | Série I — tile image | — |
| `image_ii` | image_picker | Série II — tile image | — |
| `image_atelier` | image_picker | Atelier — tile image | — |

> Deployed on: `templates/cart.json`.

---

## 15 · `vf-journal-index` (Blog article index)

### Hardcoded
| What | Why |
| --- | --- |
| Obsidian editorial register (`data-mode="obsidian"`) | Journal lives in the editorial register, not transactional |
| Card grid (3-col desktop / 2-col tablet / 1-col mobile) with landscape lead image | Brand-locked rhythm |
| 8 articles per page via `paginate by 8`; inline numbered pagination | Brand-locked pagination shape |
| Replaces Dawn's `main-blog` section | Brand-locked surface |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow text | "Journal" |
| `heading` | text | Page heading | "Studio Notes." |
| `subtitle` | text | Italic subtitle | — |

> Deployed on: `templates/blog.json`.

---

## 16 · `vf-journal-article` (Individual article body)

### Hardcoded
| What | Why |
| --- | --- |
| Obsidian editorial register (`data-mode="obsidian"`) | Matches index surface |
| Fixed editorial sequence: back link → optional lead image → header (date + reading time + title + excerpt) → body → rule → prev/next nav | Brand-locked composition |
| `.page-width--narrow` measure on header, body, nav | Editorial readability measure |
| Article structured data preserved at end (`article \| structured_data`) | SEO baseline |
| Replaces Dawn's `main-article` section | Brand-locked surface |

No editable settings. All content derives from the `article` object (title, image, content, excerpt, published_at).

> Deployed on: `templates/article.json`.

---

## 17 · `vf-editorial` (Generic editorial page wrapper)

### Hardcoded
| What | Why |
| --- | --- |
| Bone editorial register (`data-mode="bone"`) | Standard editorial-page surface |
| `.page-width--narrow` measure | Editorial readability measure |
| Renders `page.title` as H1 + `page.content` as body | Reusable wrapper, no per-page schema |
| Visual mirror of `vf-materials` chrome | Cross-surface consistency for editorial pages |

No editable settings. All visible body content lives in the page's admin **Content** field.

> Deployed on: `templates/page.editorial.json`.
>
> Note: this is the reuse target for editorial-register pages whose body lives in admin Content rather than in template-specific schema (Care · Cleaning, Shipping, Returns, Studio, future editorial pages). Set the Shopify Page record's template to `editorial` to route a page through this surface. Empty Content renders the chrome without errors.

---

## 18 · `vf-archive` (Closed-editions placeholder)

### Hardcoded
| What | Why |
| --- | --- |
| Bone editorial register (`data-mode="bone"`) | Editorial placeholder surface |
| `.page-width--narrow` measure | Editorial readability measure |
| Fixed sequence: eyebrow → H1 → hairline rule → richtext body | Brand-locked composition |
| Single section, no blocks | Editorial layout is brand-locked; entries arrive as copy, not as block-based extensibility |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow text | "Archive" |
| `heading` | text | Page heading | "Closed Editions." |
| `body` | richtext | Body copy | "<p>The archive will catalogue closed editions and past works. Edition I — Volute, Intaglio, Massif, Filigree, Lamina — opened May 2026 and remains in active production. The first archival entries are expected in 2027.</p>" |

> Deployed on: `templates/page.archive.json`.
>
> Note: schema default vs live drift — the live `templates/page.archive.json` body has been edited via the Customizer to drop the model-name list and the prose em-dash, and to push the first-entry date to 2028. The schema **default** above is preserved as-is (the original copy). Do **not** "fix" the default to match live — the schema default is the customiser-reset value and changing it would propagate the old copy back into any new preset instance. The live JSON is authoritative for what renders; the schema default is the reset value.

---

## 19 · `vf-contact` (Studio contact form + identity)

### Hardcoded
| What | Why |
| --- | --- |
| Bone register (`data-mode="bone"`) | Transactional contact surface |
| `.page-width--narrow` measure | Editorial readability measure on long-form text |
| Form fields — name, email, phone, "Enquiry type" select (General / Atelier brief / Press), body — are hardcoded markup | Brand-locked field set; no merchant-managed fields |
| Form posts through Shopify's native `{%- form 'contact' -%}` handler | Uses Shopify's built-in contact pipeline |
| `.vf-contact*` classes; Dawn `.field` / `.contact` primitives not reused (full surface re-skin) | Brand surface, not a re-themed Dawn component |
| Studio-of-record section (legal name / address / contact / grievance officer) is a fixed `<dl>` layout | Compliance display |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Contact" |
| `heading` | text | Heading | "Write to the studio." |
| `intro` | richtext | Intro paragraph | "<p>For enquiries about open editions, Atelier commissions, or press requests. The studio replies within two working days.</p>" |
| `success_message` | text | Success message | "Message received. The studio will reply within two working days." |
| `legal_name` | text | Registered legal name | "[PLACEHOLDER — Registered legal name]" |
| `studio_address` | textarea | Studio address | "[PLACEHOLDER — Studio address]" |
| `contact_email` | text | Contact email | "[PLACEHOLDER — contact email]" |
| `grievance_officer` | richtext | Grievance officer | "<p>[PLACEHOLDER — Grievance officer name, role, contact route]</p>" |

> Deployed on: `templates/page.contact.json`.
>
> Notes:
> - **Form fields are hardcoded markup, not blocks.** Only labels and the studio-identity copy are merchant-editable. To change the field set (add an enquiry-type option, add a field), edit the section file.
> - **Shopify canonical contact field names must be lowercase.** `contact[email]`, `contact[body]`, etc. Capitalised variants (`contact[Email]`) silently strip server-side validation, and Shopify rejects all submissions through that form. The current section uses the canonical lowercase keys; do not rename them.
> - **Identity settings ship as `[PLACEHOLDER …]` defaults.** Live values are set per the Contact decision (`P Radha` / `studio@voxelforge.in` / `grievance@voxelforge.in`) and stored in `templates/page.contact.json`. The placeholders are the schema reset value, not the live render.

---

## 20 · `vf-atelier-page` (Atelier landing — long-form intake surface)

### Hardcoded
| What | Why |
| --- | --- |
| Obsidian editorial register (no `data-mode` attribute; `.vf-atelier-page` selector sets `background-color: var(--vf-obsidian)` directly per §23 CSS) | Editorial register surface |
| Tier-coded Ember accent on this surface (the only page surface that is tier-coded, not generic Teal) — §23 scope-overrides `.vf-atelier-page .vf-eyebrow--teal` and `.vf-mono--teal` to `var(--vf-color-tier-atelier)` | Atelier identity carries through to the landing page |
| `.page-width--narrow` measure throughout | Editorial readability |
| Four fixed regions: A · Opening → B · Process (four steps) → C · Scope → D · Intake form | Brand-locked composition; sequence cannot be reordered |
| Process steps render via `{%- for i in (1..4) -%}` over flat `step_N_*` settings, not Customizer blocks | Deliberate discipline — locks the step count to exactly 4 and the order to 1→2→3→4 |
| Headline second segment renders inside `<em>` (italic span pattern) | Type system, matches `vf-hero` / `vf-process` headline shape |
| Intake form: `{%- form 'contact' -%}` with `contact[Form source]` = "Atelier brief" hidden input | Routes briefs into the same contact pipeline, taggable on the admin side |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Atelier · Commission" |
| `headline_part_1` | text | Headline | "One object." |
| `headline_italic` | text | Headline (italic span) | "Made for one room." |
| `opening_body` | richtext | Opening body | "<p>Placeholder. Studio copy pending.</p>" |
| `step_1_number` | text | Number (step 1) | "01" |
| `step_1_title` | text | Title (step 1) | "Brief" |
| `step_1_body` | richtext | Body (step 1) | "<p>Placeholder.</p>" |
| `step_2_number` | text | Number (step 2) | "02" |
| `step_2_title` | text | Title (step 2) | "Studio response" |
| `step_2_body` | richtext | Body (step 2) | "<p>Placeholder.</p>" |
| `step_3_number` | text | Number (step 3) | "03" |
| `step_3_title` | text | Title (step 3) | "Production" |
| `step_3_body` | richtext | Body (step 3) | "<p>Placeholder.</p>" |
| `step_4_number` | text | Number (step 4) | "04" |
| `step_4_title` | text | Title (step 4) | "Delivery" |
| `step_4_body` | richtext | Body (step 4) | "<p>Placeholder.</p>" |
| `scope_eyebrow` | text | Eyebrow (scope) | "Scope" |
| `scope_heading` | text | Heading (scope) | "Capability" |
| `scope_body` | richtext | Body (scope) | "<p>Placeholder.</p>" |
| `pull_text` | text | Pull-quote (optional) | — |
| `pull_attribution` | text | Pull-quote attribution (optional) | — |
| `submit_label` | text | Submit button label | "Submit brief" |
| `success_message` | text | Success message | "Your brief is with the studio. We respond within five working days." |

> Deployed on: `templates/page.atelier.json`.
>
> Notes:
> - **Process steps are fixed-count flat settings, not Customizer blocks.** The four steps are `step_1_*` through `step_4_*` (number / title / body each), iterated via a Liquid `(1..4)` range. This is the deliberate discipline distinguishing this section from homepage `vf-process` (which uses `step` blocks). The fixed-count pattern locks the step count and order at the schema layer; merchants cannot add a fifth step or reorder.
> - **Schema `name` must stay ≤ 25 characters.** Shopify enforces a 25-char limit on section schema `name`. The current value `"VF · Atelier (page)"` is 19 chars and is safe. The original 30-char name caused a validation failure that blocked the whole theme import. When renaming, count characters before saving.
> - **Tier-coded Ember accent — markup vs surface routing.** The section markup calls `{%- render 'vf-mono', ..., color: 'teal' -%}` for step numbers, but `vf-tokens.css` §23 scope-overrides `.vf-atelier-page .vf-mono--teal` and `.vf-eyebrow--teal` to `var(--vf-color-tier-atelier)` (Ember). Don't be misled by the `color: 'teal'` calls in the section file — the rendered ink is Ember on this surface. This is the only **page** template that carries tier ink (the homepage `vf-atelier` strip is the other Ember surface).

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
      "eyebrow": "Voxel Forge · India · Edition 2026"
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
