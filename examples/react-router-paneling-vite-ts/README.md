# react-router-paneling-vite-ts

An example project demonstrating how to use [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling) in React Router **Data Mode** with **Vite** and **TypeScript**.

## Overview

This example shows how to set up paneling in Data Mode using `createPaneling`. It uses React Context to share panel state between the panel wrapper and its content components.

For a Framework Mode variant, see [react-router-paneling-framework](../react-router-paneling-framework).
For a JavaScript variant, see [react-router-paneling-vite-js](../react-router-paneling-vite-js).

![Example](https://raw.githubusercontent.com/kisiwu/novice-react/refs/heads/main/examples/react-router-paneling-vite-ts/example.png)

## Project structure

```
src/
├── components/
│   ├── contents/              # Panel content components
│   │   ├── ErrorContent.tsx
│   │   ├── ExtraContent.tsx
│   │   └── InfoContent.tsx
│   └── panels/
│       └── CustomPanel.tsx    # Panel layout with React Context provider
├── hooks/
│   ├── useCustomPanel.ts      # React Context for per-panel state
│   └── usePanelManager.ts     # React Context for panel manager state
├── pages/
│   ├── ErrorPage.tsx
│   └── IndexPage.tsx
├── routes/
│   └── PanelManager.tsx       # Route component using usePaneling
├── utils/
└── main.tsx                   # App entry point with route configuration
```

## Getting started

### Install dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview production build

```bash
pnpm preview
```

## References

- [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling)
- [React Router Data Mode](https://reactrouter.com/start/data/installation)
- [Framework Mode example](../react-router-paneling-framework)
- [JavaScript variant](../react-router-paneling-vite-js)
