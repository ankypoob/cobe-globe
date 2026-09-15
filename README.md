# Cobe Globe

A small, dark, one-page WebGL globe demo built with [cobe](https://github.com/shuding/cobe). Drag the globe to rotate it; it auto-rotates again after you let go.

This project was inspired by Shu Ding’s original `cobe` library and the Swift/Metal port [cobe-swift](https://github.com/fayazara/cobe-swift).

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Production build

```bash
npm install
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. `npm run preview` serves that build locally.

## Credits

- [cobe](https://github.com/shuding/cobe) by [Shu Ding](https://github.com/shuding) — the WebGL globe used here
- [cobe-swift](https://github.com/fayazara/cobe-swift) — the Swift/Metal bookmark that prompted this demo
