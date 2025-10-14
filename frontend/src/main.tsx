import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initializeParse } from './config/parse';

// Initialize Parse SDK before rendering app
try {
  initializeParse();
} catch (error) {
  console.error('Failed to initialize Parse SDK:', error);
  // Show error to user
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; font-family: system-ui; color: #dc2626;">
      <h2>❌ Application Initialization Error</h2>
      <p>Failed to initialize Parse SDK. Please refresh the page or contact support.</p>
      <pre style="background: #fee; padding: 10px; border-radius: 4px; overflow: auto;">${error}</pre>
    </div>
  `;
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
