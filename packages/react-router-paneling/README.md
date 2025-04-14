# `@novice1-react/react-router-paneling`

React Router Paneling is a library to use with React Router to create routes where each segment of the path is a panel.

## Usage

### DATA MODE

To use React Router Paneling, you should use React Router in [Data Mode](https://reactrouter.com/start/data/installation) and install `@novice1-react/react-router-paneling`.

For a basic usage example without much customization, you can place the code below in `main.jsx` or `main.tsx` file:

```ts
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

The documentation being ongoing, you can find some examples:
- https://github.com/kisiwu/novice-react/tree/main/examples/react-router-paneling-framework