# react-router-paneling-framework

An example project demonstrating how to use [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling) in React Router **Framework Mode** with **React Context** for panel state management.

## Overview

This example shows how to set up paneling in Framework Mode using `createClientLoader`. It uses React Context to share panel state (title, minimized, etc.) between the panel wrapper and its content components.

For a variant using Zustand instead of React Context, see [react-router-paneling-zustand](../react-router-paneling-zustand).

## Project structure

```
app/
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
│   ├── home.tsx               # Home route
│   └── paneling.tsx           # Paneling route with clientLoader
├── utils/
│   └── drag.ts
├── definitions.ts             # Shared type definitions
├── root.tsx
└── routes.ts                  # Route definitions
```

## Getting started

### Install dependencies

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Start production server

```bash
pnpm start
```

### Docker

```bash
docker build -t react-router-paneling-framework .
docker run -p 3000:3000 react-router-paneling-framework
```

## References

- [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling)
- [React Router Framework Mode](https://reactrouter.com/start/framework/installation)
- [Zustand variant](../react-router-paneling-zustand)
