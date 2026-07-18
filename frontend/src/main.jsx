import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProviders } from './app/providers';
import { themeMode } from './theme';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InitColorSchemeScript
      defaultMode={themeMode.defaultMode}
      modeStorageKey={themeMode.storageKey}
      colorSchemeStorageKey={themeMode.colorSchemeStorageKey}
    />
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
