import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initializeParse } from './config/parse';

// Suppress browser extension errors (ad blockers, password managers, etc.)
window.addEventListener('error', (event) => {
  // Ignore extension-related errors
  if (
    event.message?.includes('message channel closed') ||
    event.message?.includes('Extension context invalidated') ||
    event.message?.includes('chrome.runtime') ||
    event.filename?.includes('extension')
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// Suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('message channel closed') ||
    event.reason?.message?.includes('Extension context invalidated') ||
    event.reason?.message?.includes('chrome.runtime')
  ) {
    event.preventDefault();
    return;
  }
});

// Initialize Parse SDK before rendering app
try {
  console.log('🚀 Starting application initialization...');
  initializeParse();
  console.log('✅ Application initialized successfully');
} catch (error) {
  console.error('Failed to initialize Parse SDK:', error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
  
  // Show detailed error to user
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto; font-family: system-ui; color: #dc2626;">
      <h2>❌ Application Initialization Error</h2>
      <p>Failed to initialize Parse SDK. Please check the console for more details or contact support.</p>
      <div style="background: #fee; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h3 style="margin-top: 0; font-size: 14px; color: #991b1b;">Error Message:</h3>
        <pre style="overflow: auto; font-size: 12px; white-space: pre-wrap; word-wrap: break-word;">${errorMessage}</pre>
      </div>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 15px; color: #92400e;">
        <h3 style="margin-top: 0; font-size: 14px;">💡 Troubleshooting:</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
          <li>Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)</li>
          <li>Clear your browser cache and reload</li>
          <li>Check your internet connection</li>
          <li>Check browser console for detailed logs</li>
        </ul>
      </div>
      <details style="margin-top: 15px; font-size: 12px;">
        <summary style="cursor: pointer; color: #7c2d12;">Show Stack Trace</summary>
        <pre style="background: #fef3c7; padding: 10px; border-radius: 4px; overflow: auto; margin-top: 10px;">${errorStack}</pre>
      </details>
    </div>
  `;
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
