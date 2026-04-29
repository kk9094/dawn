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
| `body` | richtext | Body copy | "Each piece moves through four disciplined stages…" |

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
| Bottom gradient overlay on hover | Motion system |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Editions · 2026" |
| `headline_part_1` | text | Headline (first part) | "Three editions." |
| `headline_part_2` | text | Headline (italic, second part) | "Open now." |
| `source_collection` | collection | Source collection | (unset — uses blocks if empty) |

### Editable (blocks)
Block type `tile` — used when `source_collection` is unset. Maximum 6, recommended 3.
| ID | Type | Label |
| --- | --- | --- |
| `product` | product | Product |
| `tier` | select | Tier — options: I, II, Atelier |
| `name_override` | text | Display name (optional) |
| `subtitle` | text | Subtitle (e.g. "Lamp", "Pendant · gold", "Commission · 1 of 1") |

> **Note:** When `source_collection` is set, tier is derived from product
> tags (`tier:i`, `tier:ii`, `tier:atelier`). Tag-based tier dispatch is the
> preferred mechanism — block fallback is for catalogue bring-up only.

---

## 5 · `vf-material` (Material block)

### Hardcoded
| What | Why |
| --- | --- |
| 60/40 image+text split (column-stacked mobile) | Brand-locked composition |
| Figure aspect ratio: `var(--vf-ratio-process)` (3/2) | Aspect-ratio token enforcement |
| FIG. caption (Mono, bottom-left of figure) | Editorial framing |
| Iso-grid pattern at 6% opacity behind cube | Brand texture rule |
| Spec table layout (key/value rows, hairline dividers) | Type system |

### Editable (settings)
| ID | Type | Label | Default |
| --- | --- | --- | --- |
| `eyebrow` | text | Eyebrow | "Material · Method" |
| `headline_part_1` | text | Headline (first half) | "Engineered" |
| `headline_part_2` | text | Headline (italic, second half) | "from the inside." |
| `body` | richtext | Body copy | "A gyroid lattice carries the load. Light scatters through it." |
| `figure_caption` | text | Figure caption | "FIG. 04 · INTERNAL GEOMETRY · GYROID 40%" |
| `pull_text` | text | Pull-quote text | "Lighter than aluminium. Stronger than ABS." |
| `pull_attribution` | text | Pull-quote attribution | "Engineering note · 2026" |

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
| Centred composition with hairline frame | Brand-locked composition |
| Three metric pairs in a row (mono) | Type system |

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
| Wordmark in bottom band (gold "F O R G E") | Identity element |
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
| Logo replaced with VF wordmark snippet (Bone "VOXEL" + Gold "F O R G E") | Identity |
| Nav link tracking: `var(--vf-track-label)` (0.18em) | Type system |
| Nav link colour: `var(--vf-fg-1)` | Type system |
| Sticky on scroll, 0.5px hairline at bottom | Brand-locked behaviour |

No new `settings` introduced — header content (nav links, announcement bar) continues to use Dawn's existing schema.

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
