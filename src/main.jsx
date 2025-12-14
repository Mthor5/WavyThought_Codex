import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Shop from './Shop.jsx'

const normalizePath = (path) => {
  if (!path) return '/'
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

const pathname = normalizePath(window.location.pathname)
const isShopRoute = pathname === '/shop'

createRoot(document.getElementById('root')).render(
  <StrictMode>{isShopRoute ? <Shop /> : <App />}</StrictMode>,
)
