import React from 'react';
import { createRoot } from 'react-dom/client';  // For React 18 compatibility
import App from './App';
import ErrorBoundary from './ErrorBoundary';  // Optional but useful for error handling

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary>  {/* Optional: Error handling */}
    <App />
  </ErrorBoundary>
);
