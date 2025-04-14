import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/ecommerce/service-worker.js');
      console.log('Service Worker registered: ServiceWorkerRegistration', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}
