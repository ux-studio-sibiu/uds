# custom-design-system

Token-first design system. Ships:

- `custom-design-system/css/tokens.css` — CSS variables (`:root`, `.dark`, `.theme-mars`) + Tailwind base/utilities layers.
- `custom-design-system/tailwind` — Tailwind preset mapping utilities to those vars.
- `custom-design-system/scss/tokens` — SCSS bridge that reads the same CSS vars.
- `custom-design-system/scss/variables`, `custom-design-system/scss/global` — legacy SCSS helpers.

## Consume

```ts
// nuxt.config.ts / vite.config.ts
css: ['custom-design-system/css/tokens.css']
```

```ts
// tailwind.config.ts
import dsPreset from 'custom-design-system/tailwind'
export default {
  presets: [dsPreset],
  content: ['app/**/*.{vue,ts}'],
}
```

```scss
// any *.scss file
@use 'custom-design-system/scss/tokens' as *;
```

For SCSS imports from `node_modules`, the consumer's bundler needs `loadPaths: ['node_modules']` (Vite) or equivalent.

## Develop alongside a consumer (yalc)

```sh
# one-time, in the consumer repo
npm i -g yalc
yalc add custom-design-system
npm install

# in this repo, after edits
yalc push
```

Token edits: edit `src/css/tokens.preview.css` (swatches in VS Code), then `npm run tokens:sync && yalc push`.

## Publish (later)

Set `"private": false` in `package.json`, bump version, `npm publish`. Validate the artifact with Verdaccio or `npm pack` first.
