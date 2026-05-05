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

---

## 3 · Hard rules

These are non-negotiable. If a rule conflicts with anything else, this rule wins.

### Tokens
- **Never hardcode colour, spacing, or type values inside `.vf-*` components.** Always reference `--vf-*`.
- **Never use Dawn's `--color-*` tokens inside `.vf-*` components.** Dawn tokens are for merchant-customisable surfaces (default sections); VF brand surfaces use VF tokens.
- **Always reference grid tokens** (`--vf-grid-max`, `--vf-grid-margin-d`, `--vf-grid-gutter-d`) instead of literal values like `1400px` or `48px`.

### Liquid conventions
- **Asset URLs:** `{{ 'filename.ext' | asset_url }}`. Never relative paths like `../../assets/...`.
- **Snippets:** `{% render 'vf-button', label: 'See the editions', href: '/collections/all' %}`. Never re-implement primitives inline.
- **Schema:** every section file ends with `{% schema %}` JSON. Refer to `docs/section-schemas.md` for the per-section editable-fields contract.
- **Liquid whitespace:** use `{%-` and `-%}` aggressively. Rendered HTML must not contain blank lines from Liquid logic.

### Mobile breakpoint
- **750px**, not 768px. Dawn defines `@media screen and (min-width: 750px)`. Match it everywhere.
- Any `768` reference in the kit is stale — port it as 750.

### Buttons & focus
- All buttons: `min-height: 48px`. Override Dawn's 45px floor for `.vf-btn`.
- Focus ring: `outline: 2px solid var(--vf-teal); outline-offset: 2px;` on `:focus-visible` (not `:focus`). Suppress Dawn's `box-shadow` ring on `.vf-*` only — leave it intact for default Dawn sections.

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
- **Colour contrast:** Forge Teal (`#3D7A6B`) on Obsidian is 4.4:1 — display only, never paragraph copy. Use Bone (`#E8E2D6`) for body text.
- **Badge contrast:** Badge text and border on dark surfaces use bright token variants. Pattern: Série I → `--vf-teal-bright`, Série II → `--vf-gold` (safe at all sizes), Atelier → `--vf-ember-bright`. Direct `--vf-teal` and `--vf-ember` are display-only (≥ 1.5rem). This matches the eyebrow and mono bright-token rule.

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
| `vf-eyebrow` | Section eyebrows (small caps, tracked) | `text`, optional `color` (default Teal) |
| `vf-mono` | DM Mono utility text | `text`, optional `size`, optional `color` |
| `vf-cube` | The IsoCube illustration | optional `size` (default 280), optional `glow` (boolean) |
| `vf-icon` | All icons from the 19-glyph set | `name` (one of: voxel, layers, lamp, home, precision, print, quality, package, delivery, certificate, forge, settings, search, user, cart, menu, atelier, edition, prestige), optional `size` |
| `vf-badge` | Tier badges (Série I/II/Atelier) | `tier` (`I` / `II` / `Atelier` / `SoldOut`) |
| `vf-edition-mark` | "04 / 30" numbered-edition mark | `current`, `total` |
| `vf-pull` | Pull-quote with hairline rule | `text`, optional `attribution` |

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

- Editing files outside the allowed prefix (`vf-*`, `vf-tokens.css`, `theme.liquid` token block)
- Modifying any default Dawn section (`main-product`, `header`, `footer`, etc.)
- Adding a new colour, font weight, or breakpoint not in `vf-tokens.css`
- Bypassing a snippet contract by re-implementing a primitive inline
- Disabling the reduced-motion baseline on a specific surface
- Anything involving `localStorage`, third-party trackers, or external API calls

Default to "ask the human" rather than guess. The kit was built carefully; small drifts compound.
