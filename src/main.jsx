import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { palette } from './theme.js';

// Colour palette from weddingConfig.theme.palette ('pastel' or 'festive').
document.documentElement.dataset.palette = palette;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
