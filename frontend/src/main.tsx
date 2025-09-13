import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './config/parse'; // Initialize Parse SDK
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
