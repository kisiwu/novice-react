import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createPaneling } from '@novice1-react/react-router-paneling'

const panels = {}

createPaneling({
    path: 'stacking',
    panels
})

const route = createPaneling({
  path: 'tiling',
  panels
})

console.log(route)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
