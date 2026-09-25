import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ROUTER_BASE } from './lib/base'
import './styles/tokens.css'
import './styles/app.css'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter basename={ROUTER_BASE}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
