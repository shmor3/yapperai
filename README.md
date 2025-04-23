# yapperai

- Dev works `pnpm dev`

- Production (-ish since `pnpm preview doesn't work`) 
Run `pnpm build` to build the client and render previews
then run `pnpm run sirv build/client --single index.html` to serve the spa

See [Pre-rendering with a SPA](https://reactrouter.com/how-to/pre-rendering#pre-rendering-with-a-spa-fallback)

Also there is a Warning for the `:path` in routes.ts (still works though)

```zsh
⚠️ Paths with dynamic/splat params cannot be prerendered when using `prerender: true`. You may want to use the `prerender()` API to prerender the following paths:
  - :page
```
