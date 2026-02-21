# react-router-paneling-zustand

An example project demonstrating how to use [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling) with [Zustand](https://zustand.docs.pmnd.rs/) for per-panel state management in React Router **Framework Mode**.

## Overview

This example showcases a **hybrid approach** combining:

- **React Context** for values shared across all panels (`panelIndex`, `nbPanels`, `panelingType`, `activePanel`)
- **Zustand** for per-panel state (`title`, `minimized`) that should only trigger re-renders in the affected panel

### Why this approach?

| Concern | Solution | Reason |
|---|---|---|
| Panel index | React Context | Lightweight, never changes per panel instance |
| Panel manager state (`nbPanels`, `activePanel`) | React Context | All panels need to re-render when these change anyway |
| Per-panel state (`title`, `minimized`) | Zustand store | Only the affected panel re-renders when its state changes |

### Key points

- **`"use client"`** is required on any component that uses the Zustand store, since Framework Mode uses SSR and Zustand relies on client-side React hooks.
- The Zustand store is keyed by `panelIndex`, which is unique per panel in the stack.
- Each panel initializes its own state in the store via `useEffect` on mount and cleans up on unmount.
- Store actions (`setPanelTitle`, `togglePanelMinimized`, etc.) include equality checks to avoid unnecessary re-renders.

## Project structure

```
app/
├── components/
│   ├── contents/          # Panel content components
│   │   ├── ExtraContent.tsx
│   │   └── InfoContent.tsx
│   └── panels/
│       └── CustomPanel.tsx # Panel wrapper using Zustand + React Context
├── hooks/
│   ├── usePanelingStore.ts # Zustand store for per-panel state
│   └── usePanelContext.ts  # React Context for panelIndex
├── routes/
│   └── paneling.tsx        # Route component using usePaneling
└── definitions.ts          # Shared type definitions
```

## Getting started

### Install dependencies

```bash
pnpm install
```

### Run in development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## How it works

### 1. Zustand store (`usePanelingStore.ts`)

A single store holds the state for all panels, keyed by `panelIndex`:

```typescript
const { setPanelTitle, togglePanelMinimized } = usePanelingStore.getState()
```

Actions are retrieved via `getState()` to avoid creating unnecessary subscriptions.

### 2. Panel context (`usePanelContext.ts`)

A lightweight React Context provides `panelIndex` to all child components inside a panel:

```typescript
const panelIndex = usePanelIndex()
```

### 3. CustomPanel (`CustomPanel.tsx`)

The panel component:
1. Subscribes to its own slice of the Zustand store
2. Wraps children in a `PanelContext.Provider`
3. Initializes its state in `useEffect` and cleans up on unmount

```tsx
const context = usePanelingStore((state) => state.panels[panelIndex]?.context)

if (!context) return null
```

### 4. Content components

Content components access `panelIndex` from React Context and use it to read/write their panel's state in the Zustand store:

```tsx
const panelIndex = usePanelIndex()
const setPanelTitle = usePanelingStore.getState().setPanelTitle

useEffect(() => {
    setPanelTitle(panelIndex, 'My Title')
}, [panelIndex])
```

## References

- [`@novice1-react/react-router-paneling`](../../packages/react-router-paneling)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [Framework Mode example (without Zustand)](../react-router-paneling-framework)