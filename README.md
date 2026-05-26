# custom-design-system

A token-first design system distributed as a single npm package. One source of truth — CSS custom properties — is consumed three ways:

- **CSS** — drop-in stylesheet that defines the tokens and emits Tailwind base/utilities layers.
- **Tailwind preset** — maps utilities like `bg-primary`, `text-muted-foreground`, `rounded-md` onto the tokens.
- **SCSS bridge** — exposes the same tokens as SCSS variables backed by the CSS vars, so theme swaps still work at runtime.

Theme is swapped by toggling a class on a wrapper element (`<html>` or `<body>`):

| Class | Theme |
| --- | --- |
| _(none)_ | Light (default `:root`) |
| `.dark` | Dark |
| `.theme-mars` | Mars (rusty / dusty) |
| `.theme-winamp` | Winamp 2.x (near-black + neon LCD green) |

---

## Install

```sh
# from GitHub (current distribution model)
npm install github:ux-studio-sibiu/uds#main

# or pin a tag
npm install github:ux-studio-sibiu/uds#v0.1.2
```

Peer dependencies (you most likely already have these):

```sh
npm install -D tailwindcss tailwindcss-animate
```

`tailwindcss-animate` is optional — the preset references it; remove it from the preset if you don't want the dependency.

---

## Consume

### 1. Load the tokens stylesheet

This is required regardless of whether you use Tailwind or SCSS — it defines the CSS variables every other layer reads.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['custom-design-system/tokens.css'],
})
```

```ts
// vite + vue/react main.ts
import 'custom-design-system/tokens.css'
```

```css
/* or from any global stylesheet */
@import 'custom-design-system/tokens.css';
```

### 2. Use the Tailwind preset

```ts
// tailwind.config.ts
import dsPreset from 'custom-design-system'

export default {
  presets: [dsPreset],
  content: ['app/**/*.{vue,ts,tsx}', 'components/**/*.{vue,ts,tsx}'],
}
```

Then write utilities normally — they resolve to the token vars:

```html
<button class="bg-primary text-primary-foreground rounded-md px-4 py-2">
  Launch
</button>

<div class="bg-card text-card-foreground border rounded-lg">…</div>
```

Token → utility mapping (excerpt):

| Token | Utility |
| --- | --- |
| `--color-primary` | `bg-primary`, `text-primary`, `ring-primary` |
| `--color-accent` | `bg-accent`, `text-accent` |
| `--color-destructive` | `bg-destructive` |
| `--surface-default` | `bg-background` |
| `--surface-raised` | `bg-card`, `bg-popover` |
| `--surface-muted` | `bg-muted` |
| `--surface-secondary` | `bg-secondary` |
| `--text-color-default` | `text-foreground` |
| `--text-color-muted` | `text-muted-foreground` |
| `--border` | `border-border` (and the default `border` color) |
| `--ring` | `ring-ring` |
| `--radius` | `rounded-sm` / `-md` / `-lg` / `-xl` (computed from `--radius`) |

### 3. (Optional) SCSS bridge

For component-local SCSS that needs to stay themable:

```scss
@use 'custom-design-system/scss/tokens' as *;

.card {
  background: $surface-default;
  color: $text-color-default;
  border: 1px solid $color-border;
  border-radius: $radius;
}
```

Each variable is `hsl(var(--…))`, so it retints automatically when the theme class changes — no rebuild needed.

For SCSS imports from `node_modules`, your bundler needs to be able to resolve them. With Vite:

```ts
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { loadPaths: ['node_modules'] },
    },
  },
})
```

### 4. Apply a theme

```html
<!-- light (default) -->
<html>

<!-- dark -->
<html class="dark">

<!-- Mars -->
<html class="theme-mars">

<!-- Winamp -->
<html class="theme-winamp">
```

Scoping to a subtree works too:

```html
<section class="theme-winamp">…retinted region…</section>
```

---

## What's in the package

```
src/
  css/
    tokens.css           # public contract: :root + .dark + .theme-* + base/utilities layers
    tokens.preview.css   # dev-only swatch reference (NOT shipped via exports)
  scss/
    _tokens.scss         # SCSS aliases backed by the CSS vars
    global.scss          # opt-in base resets + body defaults
  tailwind/
    preset.mjs           # Tailwind preset (default export of the package)
```

Package exports:

| Specifier | Resolves to |
| --- | --- |
| `custom-design-system` | `src/tailwind/preset.mjs` |
| `custom-design-system/tokens.css` | `src/css/tokens.css` |
| `custom-design-system/tokens.scss` | `src/scss/_tokens.scss` |
| `custom-design-system/scss/*` | `src/scss/*` |

---

## Tokens reference

All tokens live on `:root` and are overridden inside each `.theme-*` class. Values are stored as bare HSL triplets (`H S% L%`) so they can be wrapped in `hsl(var(--…) / <alpha>)` for transparency.

```css
/* text */
--text-color-default
--text-color-strong
--text-color-muted

/* surfaces */
--surface-default
--surface-strong
--surface-raised
--surface-secondary
--surface-muted

/* colors */
--color-primary
--color-accent
--color-destructive

/* lines & focus */
--border
--input
--ring
--divider

/* shape */
--radius
```

To add a new theme, copy a `.theme-*` block in [src/css/tokens.css](src/css/tokens.css), rename it, and edit the values. Mirror the same block in [src/css/tokens.preview.css](src/css/tokens.preview.css) using `hsl(H S% L%)` literals so VS Code's color decorator shows a swatch beside each line — this preview file is a manual reference, there is no sync script.

---

## Develop alongside a consumer

Point the consumer's dependency at your local clone:

```sh
npm pkg set dependencies.custom-design-system="file:../uds"
npm install
```

npm creates a junction in `node_modules/custom-design-system` pointing at the local folder, so edits in `src/**` are picked up on the next dev-server refresh — no rebuild, no publish.

Switch back to the git-published version when done:

```sh
npm pkg set dependencies.custom-design-system="github:ux-studio-sibiu/uds#main"
npm update custom-design-system
```

---

## Release

```sh
npm run release         # patch
npm run release:minor
npm run release:major
```

Each script pushes `main`, bumps `package.json`, tags, and pushes the tag. Consumers installing via `github:ux-studio-sibiu/uds#vX.Y.Z` pick up the new version on `npm update`.
