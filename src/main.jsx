import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/500.css';
import '@fontsource/fira-sans/600.css';
import '@fontsource/fira-sans/700.css';
import '@fontsource/fira-sans/800.css';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
