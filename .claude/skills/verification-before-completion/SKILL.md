---
name: verification-before-completion
description: Quality gate that must run before claiming any Shopify theme task is complete. Prevents shipping broken, inaccessible, or visually incorrect theme code. Invoke before every "done" statement.
origin: obra/superpowers
---

# Verification Before Completion

Never claim a task is complete without running and reading verification output.

## The Rule
Before saying any variant of "done", "complete", "finished", "should work", or "that's it":
1. **IDENTIFY** what command or check will prove it works
2. **RUN** it
3. **READ** the full output, including exit codes and warnings
4. **VERIFY** output matches expectations
5. **ONLY THEN** report completion

No hedging language: never say "should work", "probably fine", "seems correct", "I believe this will". Either verify it or say you haven't verified it yet.

## Shopify Theme Verification Checklist

### After editing a Liquid file
- [ ] No Liquid syntax errors (check `shopify theme check` output)
- [ ] Translation keys referenced actually exist in `locales/en.default.json`
- [ ] Metafields referenced have fallback for when blank
- [ ] Section renders in Theme Editor without errors

### After editing JavaScript
- [ ] No console errors in browser
- [ ] Feature works through full click-path (not just first action)
- [ ] Works on mobile viewport (375px)
- [ ] No AJAX request failures (Network tab shows 200 responses)

### After editing CSS
- [ ] No layout breakage at 375px / 768px / 1280px
- [ ] CLS not introduced (images have explicit dimensions)
- [ ] Color contrast passes (text on background ≥ 4.5:1)
- [ ] `prefers-reduced-motion` still respected

### Before pushing to Shopify store
```bash
shopify theme check              # run theme linter
shopify theme push --only <file> # push only changed files to preview theme
```

### Before pushing to git
- [ ] `git diff` reviewed — no accidental whitespace changes or debug code
- [ ] No `console.log` statements left in production JS
- [ ] No hardcoded store URLs or API keys in committed files

## Forbidden Completion Phrases
- "This should work now"
- "I believe this will fix it"
- "The code looks correct"
- "That should do it"
- "I think this is ready"

## Allowed Completion Phrases (after actual verification)
- "I ran `shopify theme check` — 0 errors. The section is ready."
- "Tested add-to-cart at 375px and 1440px — both work. Cart count updates correctly."
- "Theme push succeeded. Preview URL shows the correct layout."
