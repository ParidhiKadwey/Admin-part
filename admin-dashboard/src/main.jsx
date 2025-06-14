import { BrowserRouter } from 'react-router-dom';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';  // ✅ REQUIRED



ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
