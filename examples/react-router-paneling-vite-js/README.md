# react-router-paneling-vite-js

An example project demonstrating how to use [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling) in React Router **Data Mode** with **Vite** and **JavaScript**.

## Overview

This example shows how to set up paneling in Data Mode using `createPaneling` without TypeScript. It uses React Context to share panel state between the panel wrapper and its content components.

For a TypeScript variant, see [react-router-paneling-vite-ts](../react-router-paneling-vite-ts).
For a Framework Mode variant, see [react-router-paneling-framework](../react-router-paneling-framework).

## Project structure

```
src/
├── components/
│   ├── contents/              # Panel content components
│   │   ├── ErrorContent.jsx
│   │   ├── ExtraContent.jsx
│   │   └── InfoContent.jsx
│   ├── panels/
│   │   └── CustomPanel.jsx    # Panel layout with React Context provider
│   └── PanelManager.jsx       # Route component using usePaneling
├── hooks/
│   ├── useCustomPanel.js      # React Context for per-panel state
│   └── usePanelManager.js     # React Context for panel manager state
├── pages/
│   ├── ErrorPage.jsx
│   └── IndexPage.jsx
├── routes/
│   └── Root.jsx               # Root layout component
├── utils/
└── main.jsx                   # App entry point with route configuration
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
- [TypeScript variant](../react-router-paneling-vite-ts)
- [Framework Mode example](../react-router-paneling-framework)
