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

## Develop alongside a consumer

In the consumer repo, point the dependency at the local clone:

```sh
npm pkg set dependencies.custom-design-system="file:./path/to/uds"
npm install
```

npm creates a junction in `node_modules/custom-design-system` pointing at the local folder, so edits to `src/**` are reflected immediately — just refresh the dev server.

To switch back to a git-published version:

```sh
npm pkg set dependencies.custom-design-system="github:ux-studio-sibiu/uds#main"
npm update custom-design-system
```

## Publish (later)

Set `"private": false` in `package.json`, bump version, `npm publish`. Validate the artifact with Verdaccio or `npm pack` first.
