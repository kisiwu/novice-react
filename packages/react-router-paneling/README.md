# `@novice1-react/react-router-paneling`

A library for [React Router](https://reactrouter.com/) that turns each segment of a URL path into a panel. Stack multiple panels by simply navigating to deeper paths, each segment mapping to a panel component.

## Install

```bash
npm install @novice1-react/react-router-paneling
```

## Overview

The library works with both [Data Mode](#data-mode) and [Framework Mode](#framework-mode) of React Router.

| Mode | Function | Description |
|------|----------|-------------|
| Data Mode | `createPaneling` | Creates a complete route object with loader, action, and component |
| Framework Mode | `createClientLoader` | Creates a client-side loader to use in your route's `clientLoader` export |

### How it works

Each URL path segment is parsed into a panel. Panels are registered by name, and each segment can optionally include an **ID** and **key-value extras**, separated by a configurable `extrasSeparator` (default `:`).

**URL structure:**

```
/<panelName><sep><id><sep><key>=<value><sep><key>=<value>/...
```

**Example** (with default separator `:`):

```
/user:abc123:role=admin/settings
```

This produces two panels:
1. **user** - `id: 'abc123'`, `extras: { role: 'admin' }`
2. **settings** - no id, no extras

Your panel components receive these values as props (`id`, `extras`, `currentPath`, `previousPath`, etc.).

### Extras separator

The `extrasSeparator` option controls the character used to separate segments within a single panel path (name, id, and extras). The default is `:`.

For URLs where `:` might conflict, you can use another URL-safe character like `;`:

```typescript
createPaneling({
  panels: { /* ... */ },
  extrasSeparator: ';'
})
```

With `;` as extras separator, URLs look like:
```
/user;abc123;role=admin/settings;456
```

> **Note:** Keys in extras cannot contain `=` or the extras separator character. Values can contain `=`.

### Extras (key-value parameters)

Each panel segment can carry additional parameters after the ID. These are parsed as key-value pairs joined by `=`:

```
/profile:id123:theme=dark:lang=en
```

The panel component receives:
```typescript
{
  id: 'id123',
  extras: { theme: 'dark', lang: 'en' }
}
```

If a key has no `=`, it defaults to an empty string:
```
/profile:id123:verbose
// extras: { verbose: '' }
```

---

## Data Mode

Use `createPaneling` to create a route object for [Data Mode](https://reactrouter.com/start/data/installation). Place this in your `main.jsx` or `main.tsx` file:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router';
import { createPanel, createPaneling } from '@novice1-react/react-router-paneling';

function LinksMenu({ basePath }: { basePath?: string }) {
  return <ul>
    <li>
      <Link to={`${basePath || ''}/a`}>Open panel 'a'</Link>
    </li>
    <li>
      <Link to={`${basePath || ''}/b`}>Open panel 'b'</Link>
    </li>
  </ul>
}

function Root() {
  return <div>
    <LinksMenu />
    <div>
      <Outlet />
    </div>
  </div>;
}

function ErrorPage() {
  return <h1>Error</h1>;
}

function PanelAContent({ currentPath }: { currentPath: string }) {
  return <div>
    <h1>Panel A: {currentPath}</h1>
    <LinksMenu basePath={currentPath} />
  </div>
}

function PanelBContent({ currentPath }: { currentPath: string }) {
  return <div>
    <h1>Panel B: {currentPath}</h1>
    <LinksMenu basePath={currentPath} />
  </div>
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      createPaneling({
        panels: {
          a: createPanel(PanelAContent),
          b: createPanel(PanelBContent)
        },
        max: 5
      })
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

With this setup:

- `/a` renders `PanelAContent`
- `/b` renders `PanelBContent`
- `/a/b` renders `PanelAContent` then `PanelBContent`
- `/b/a` renders `PanelBContent` then `PanelAContent`

The `max: 5` option limits the stack to 5 panels. If the URL contains more segments, the user is redirected to show only the allowed maximum.

Instead of `createPanel`, you can use `createCustomPanel` to provide your own panel layout component and style them however you want ([example](https://raw.githubusercontent.com/kisiwu/novice-react/refs/heads/main/examples/react-router-paneling-vite-ts/example.png)).

More Data Mode examples:
- [Vite + JS](https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-vite-js)
- [Vite + TS](https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-vite-ts)

---

## Framework Mode

Use `createClientLoader` in [Framework Mode](https://reactrouter.com/start/framework/installation). You need to:
1. Register your route with a `*` wildcard
2. Export a `clientLoader` that calls `createClientLoader`
3. Render the panels in your route component

### 1. Register the route

```ts
// routes.ts

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // ...
    route('paneling/*', 'routes/paneling.tsx')
] satisfies RouteConfig;
```

### 2. Create the client loader

> **Important:** Define the panel configuration object **at module scope** (outside `clientLoader`).
> In Framework Mode, `clientLoader` runs on **every navigation**. If you call `createCustomPanel` inside `clientLoader`, 
> it creates new component references each time, causing React to **unmount and remount** all panels on every navigation, 
> losing any local state (e.g., form inputs, titles) in those panels. By defining the configuration at module scope, 
> component references are created once and remain stable across navigations.

```tsx
// routes/paneling.tsx

import type { Route } from "./+types/paneling";

import { 
    createClientLoader, 
    createCustomPanel,
} from "@novice1-react/react-router-paneling";

import CustomPanel from "~/components/panels/CustomPanel";
import IndexPage from "~/components/IndexPage";
import ErrorContent from "~/components/contents/ErrorContent";
import InfoContent from "~/components/contents/InfoContent";
import ExtraContent from "~/components/contents/ExtraContent";

// Define panel configuration at module scope to keep component references stable
const panelingConfig = {
    // repeat the route path here (with or without '*')
    path: 'paneling', 

    // component displayed when no panels are active
    indexComponent: IndexPage,
    
    // component displayed for unknown panel names
    errorComponent: createCustomPanel(
        ErrorContent,
        CustomPanel
    ),
    
    // maximum number of panels in the stack
    max: 8,

    // character used to separate the panel name, id and extras within a URL segment (default ':')
    extrasSeparator: ':',

    // registered panels
    panels: {
        // simple panel at /paneling/info
        info: createCustomPanel(
          InfoContent,
          CustomPanel
        ),
        // panel with ID support at /paneling/extra:<id>
        'extra:': createCustomPanel(
          ExtraContent,
          CustomPanel
        )
    }
};

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Paneling" },
        { name: "description", content: "Welcome to React Router Paneling!" }
    ];
}

export async function clientLoader(args: Route.ClientLoaderArgs) {
    const clientData = await createClientLoader(panelingConfig)(args)

    if (clientData instanceof Response) return clientData
    
    return { ...clientData };
}

export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Paneling() {
  // we will update this after defining the panels

  return <div>Paneling</div>
}
```

> **Panel name convention:** A panel registered as `'extra:'` (with a trailing `:`) expects an ID segment. A panel registered as `'info'` (without trailing `:`) does not.

### 3. Extending panel props

If you need to pass additional props to your panels (e.g., the panel's index), define extension types:

```ts
// types.ts

import type { IPanelContentProps, IPanelProps } from "@novice1-react/react-router-paneling"

export type PanelPropsExtension = {
    panelIndex: number,
}

export type ContentPropsExtension = {
    panelIndex: number
}

export type PanelProps = IPanelProps<ContentPropsExtension> & PanelPropsExtension

export type ContentProps = IPanelContentProps & ContentPropsExtension
```

Then use those types in your components:

```tsx
// components/panels/CustomPanel.tsx

import type { PanelProps } from '../../types'

export default function CustomPanel ({
    panelIndex,
    content,
    children
}: PanelProps) {
  return <div>
    {content ? content({ panelIndex }) : children}
  </div>
}
```

```tsx
// components/contents/ExtraContent.tsx

import type { ContentProps } from '../../types'

export default function ExtraContent ({
    panelIndex,
    id
}: ContentProps) {
  return (
    <div>
      <h1>Extra panel</h1>
      <p>My ID is {id}</p>
      <p>My index is "{panelIndex}"</p>
    </div>
  );
}
```

```tsx
// components/contents/InfoContent.tsx

import { Link } from 'react-router'
import type { ContentProps } from '../../types'

export default function InfoContent ({
    panelIndex,
    currentPath
}: ContentProps) {
  return (
    <div>
      <h1>Info panel</h1>
      <p>My index is "{panelIndex}"</p>
      <div>
        <Link to={currentPath + '/extra:4448-927777-633-3444666'}>
          open extra panel 4448-927777-633-3444666
        </Link>
      </div>
    </div>
  );
}
```

```tsx
// components/contents/ErrorContent.tsx

import type { ContentProps } from '../../types'

export default function ErrorContent ({
    panelIndex
}: ContentProps) {
  return (
    <div>
      <h1>Error panel</h1>
      <p>My index is "{panelIndex}"</p>
    </div>
  );
}
```

```tsx
// components/IndexPage.tsx

import { Link } from 'react-router'

export default function IndexPage () {
  return (
    <div>
      <h1>Index page</h1>
      <div>
        <Link to='info'>open info panel</Link>
      </div>
    </div>
  );
}
```

### 4. Rendering panels

In Framework Mode, your route component handles the rendering. You can use one of three approaches:

> **Note:** Render only **one** instance of `Paneling` or call `paneling()` from `usePaneling` only **once** per page. Multiple instances would render duplicate panel stacks.

#### With `Paneling`

```tsx
// routes/paneling.tsx

import {
    // ...
    Paneling as ReactRouterPaneling,
    type FunctionExtension
} from "@novice1-react/react-router-paneling";

import type { 
  PanelPropsExtension
} from '../types';

// ...

export default function Paneling() {
  const extension: FunctionExtension<PanelPropsExtension> = (panelIndex) => {
      return {
          panelIndex
      }
  }

  return <div>
    <ReactRouterPaneling extension={extension} />
  </div>
}
```

#### With `usePaneling`

```tsx
// routes/paneling.tsx

import {
    // ...
    usePaneling, 
    type FunctionExtension
} from "@novice1-react/react-router-paneling";

import type { 
  PanelPropsExtension, 
  ContentPropsExtension 
} from '../types';

// ...

export default function Paneling() {
  const extension: FunctionExtension<PanelPropsExtension> = (panelIndex) => {
      return {
          panelIndex
      }
  }

  const { paneling } = usePaneling({ extension })
  // or strictly typed:
  // const { paneling } = usePaneling<ContentPropsExtension, PanelPropsExtension>({ extension }) 

  return <div>{paneling()}</div>
}
```

#### With `LoaderData`

For full control over rendering:

```tsx
// routes/paneling.tsx

import {
    createElement
} from 'react';

import { 
  useLoaderData,
  useLocation
} from "react-router";

import {
    // ...
    createCustomPanelProps,
    type LoaderData
} from "@novice1-react/react-router-paneling";

import type { 
  PanelPropsExtension, 
  ContentPropsExtension 
} from '../types';

// ...

export default function Paneling() {
  const { splat, stack } = useLoaderData<LoaderData<ContentPropsExtension, PanelPropsExtension>>();

  const { pathname } = useLocation()

  return <div>
    {
      stack.flatMap((c, i) => [
          createElement(
              c.component,
              {
                  key: `panel-${i}`,
                  ...createCustomPanelProps(c, splat, pathname, {
                      panelIndex: i
                  }),
              },
              null
          )
      ])
    }
  </div>
}
```

### 5. Programmatic navigation with `usePanelNav`

The `usePanelNav` hook provides programmatic navigation between panels. It returns:

- **`createPanelPath(segments)`** - builds a panel path string from an array of segments.
- **`navigate(segments, navigateTo?)`** - navigates to the generated panel path. Optionally accepts a custom navigation function.
- **`basePath`** - the base URL prefix for the panels.

**Example:**

```tsx
import { usePanelNav } from "@novice1-react/react-router-paneling";

function MyComponent() {
  const { navigate, createPanelPath, basePath } = usePanelNav();

  function openUser() {
    // Navigates to <basePath>/user:abc123:role=admin/settings
    navigate([
      { panel: 'user', id: 'abc123', extras: { role: 'admin' } },
      { panel: 'settings' }
    ]);
  }

  // You can also just build the path without navigating
  const path = createPanelPath([{ panel: 'info' }]); // "info"

  return <button onClick={openUser}>Open user panel</button>;
}
```

More Framework Mode examples:
- [Framework example](https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-framework)