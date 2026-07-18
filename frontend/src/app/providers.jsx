import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { NotificationProvider } from './NotificationProvider.jsx';
import { muiTheme, themeMode } from '../theme';
import { store } from '../store';

export function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        theme={muiTheme}
        defaultMode={themeMode.defaultMode}
        modeStorageKey={themeMode.storageKey}
        colorSchemeStorageKey={themeMode.colorSchemeStorageKey}
        disableTransitionOnChange
      >
        <CssBaseline enableColorScheme />
        <BrowserRouter>
          {children}
          <NotificationProvider />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}