import { FunctionComponent, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router';
import { createCustomPanel, createPaneling } from '@novice1-react/react-router-paneling';

import { ContentProps, PanelManager } from './routes/PanelManager';

import ErrorPage from './pages/ErrorPage';
import CustomPanel from './components/panels/CustomPanel';
import ErrorContent from './components/contents/ErrorContent';
import IndexPage from './pages/IndexPage';
import InfoContent from './components/contents/InfoContent';
import ExtraContent from './components/contents/ExtraContent';
import './index.css'


function createPanel(content: FunctionComponent<ContentProps>) {
  return createCustomPanel(
    content,
    CustomPanel
  )
}

const errorComponent = createPanel(ErrorContent);
const indexComponent = IndexPage;

const panels = {
  info: createPanel(
    InfoContent
  ),
  extra: createPanel(
    ExtraContent
  ),
  'extra:': createPanel(
    ExtraContent
  )
}

const router = createBrowserRouter([
  createPaneling({
    path: '/',
    errorElement: <ErrorPage />, // necessary if not a child
    element: <PanelManager type='grid' />,
    errorComponent,
    indexComponent,
    max: 12,
    panels
  }),
  createPaneling({
    path: 'stacking',
    errorElement: <ErrorPage />, // necessary if not a child
    Component: PanelManager,
    errorComponent,
    indexComponent,
    max: 12,
    panels
  }),
  createPaneling({
    /**
     * 'tiling', '/tiling', 'tiling/', '/tiling/', 'tiling/*', '/tiling/*' are the same.
     * '/tiling', '/tiling/', '/tiling/*' will be resolved '/tiling/*'.
     * 'tiling', 'tiling/', 'tiling/*' will be resolved 'tiling/*'.
     */
    path: '/tiling/*',
    errorElement: <ErrorPage />, // necessary if not a child
    element: <PanelManager type='tiling' />,
    errorComponent,
    indexComponent,
    max: 8,
    panels
  }),
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

