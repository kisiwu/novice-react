# `@novice1-react/react-router-paneling`

React Router Paneling is a library to use with React Router to create routes where each segment of the path is a panel.

## Usage

You can use `@novice1-react/react-router-paneling` in [Data Mode](#data-mode) or in [Framework Mode](#framework-mode).

### DATA MODE

For a basic usage example in [Data Mode](https://reactrouter.com/start/data/installation) without much customization, you can place the code below in `main.jsx` or `main.tsx` file:

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

/**
 * Content of panel A
 */
function PanelAContent({ currentPath }: { currentPath: string }) {
  return <div>
    <h1>Panel A: {currentPath}</h1>
    <div>
      <LinksMenu basePath={currentPath} />
    </div>
  </div>
}

/**
 * Content of panel B
 */
function PanelBContent({ currentPath }: { currentPath: string }) {
  return <div>
    <h1>Panel B: {currentPath}</h1>
    <div>
      <LinksMenu basePath={currentPath} />
    </div>
  </div>
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      /**
       * Create the route that will handle panels
       */
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

Start your server and access it on your browser. You should see links rendered by the component `Root`.
    
- When you access `/a`, `PanelAContent` is rendered
- When you access `/b`, `PanelBContent` is rendered
- When you access `/a/b`, `PanelAContent` is rendered then `PanelBContent`
- When you access `/b/a`, `PanelBContent` is rendered then `PanelAContent`
- etc ...

We limited the route to 5 segments so 5 panels with `max: 5`. Even if we try to add more segments in the address bar, we get redirected to display the maximum number of panels defined.

Instead of using `createPanel` you could use `createCustomPanel`, use your own component to display the panels and add style to make your panels like like whatever you want like [here](https://raw.githubusercontent.com/kisiwu/novice-react/refs/heads/main/examples/react-router-paneling-vite-ts/example.png).

The documentation being ongoing, you can find some examples:
- https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-vite-js
- https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-vite-ts


### FRAMEWORK MODE

To use React Router Paneling in [Framework Mode](https://reactrouter.com/start/framework/installation), you have to make use of `clientLoader` of your route and `createClientLoader` of `@novice1-react/react-router-paneling`. 
Also you will have to register your route with a `*`.

Let's use an example to understand the usage.

- First register the route.

```ts
// routes.ts

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // ...
    route('paneling/*', 'routes/paneling.tsx') // saved route 'paneling/*'
] satisfies RouteConfig;
```

- Then we will create the route component.

```tsx
// routes/paneling.tsx

import type { Route } from "./+types/paneling";

import { 
    createClientLoader, 
    createCustomPanel,
} from "@novice1-react/react-router-paneling";

// your own customized panel layout
import CustomPanel from "~/components/panels/CustomPanel";

// your own content components
import IndexPage from "~/components/IndexPage";
import ErrorContent from "~/components/contents/ErrorContent";
import InfoContent from "~/components/contents/InfoContent";
import ExtraContent from "~/components/contents/ExtraContent";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Paneling" },
        { name: "description", content: "Welcome to React Router Paneling!" }
    ];
}

export async function clientLoader(args: Route.ClientLoaderArgs) {
    const clientData = await createClientLoader({
        // required to repeat the route here with or without '*'
        path: 'paneling', 
        
        // the content that will be displayed at '/paneling'
        indexComponent: IndexPage,
        
        // the content that will be displayed for unknown panels
        errorComponent: createCustomPanel(
            ErrorContent,
            CustomPanel
        ),
        
        // the maximum number of panels on the page
        max: 8,

        // the panels (examples)
        panels: {
            // the panel 'info' (e.g.: /paneling/info)
            info: createCustomPanel(
              InfoContent,
              CustomPanel
            ),
            // the panel 'extra' (e.g.: /paneling/extra:here-is-my-id/)
            'extra:': createCustomPanel(
              ExtraContent,
              CustomPanel
            )
        }
    })(args)

    if (clientData instanceof Response) return clientData
    
    return { ...clientData };
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Paneling() {
  // we will update the code here after defining the panels

  return <div>Paneling</div>
}
```

- Let's say that we would like to send more props to the panel component and to the content components. One thing we would like to know is the index order of the panel. We create the types for add that information.

```ts
// types.ts

import type { IPanelContentProps, IPanelProps } from "@novice1-react/react-router-paneling"

// additional props for the panel
export type PanelPropsExtension = {
    panelIndex: number,
}

// additional props for the content component of the panel
export type ContentPropsExtension = {
    panelIndex: number
}

// all the props for the panel
export type PanelProps = IPanelProps<ContentPropsExtension> & PanelPropsExtension

// all the props for the content of panel
export type ContentProps = IPanelContentProps & ContentPropsExtension
```

- So now in our panel, we want to use that additional property and send it to our content.

```tsx
// components/panels/CustomPanel.tsx

import type { PanelProps } from '../../types'

/**
 * This will be our layout
 */
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

- And we want to use that property in our content component.

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

In framework mode, your route will be the equivalent of `element` or `Component` in the `createPaneling` method of data mode. So it will be up to you to handle the rendering of your panels. You could use the component `Paneling`, the method `usePanel` or directly `LoaderData` if you want to have full control on the rendering.

- Now we have to update the rendering of our route/component `Paneling` to display those panels and send the additional property `panelIndex`.

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

#### With `usePanel`

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
  // or strictly typed
  // const { paneling } = usePaneling<ContentPropsExtension, PanelPropsExtension>({ extension }) 

  return <div>{paneling()}</div>
}
```

#### With `LoaderData`

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

The documentation being ongoing, you can find some examples:
- https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-framework