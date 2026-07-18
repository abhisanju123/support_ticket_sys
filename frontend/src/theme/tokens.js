/**
 * Shared design tokens used by Material UI and global CSS.
 * Keep palette and spacing values in sync across both systems.
 */

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

/** Base spacing unit (px). MUI multiplies this by the factor passed to theme.spacing(). */
export const spacingUnit = 8;

/** Named spacing scale in px for layout composition. */
export const spacing = {
  xs: spacingUnit * 0.5,
  sm: spacingUnit,
  md: spacingUnit * 2,
  lg: spacingUnit * 3,
  xl: spacingUnit * 4,
  '2xl': spacingUnit * 6,
  '3xl': spacingUnit * 8,
  layout: {
    page: spacingUnit * 3,
    section: spacingUnit * 5,
    card: spacingUnit * 2,
    stack: spacingUnit * 1.5,
    inline: spacingUnit * 1,
  },
};

export const colors = {
  primary: {
    main: '#1565C0',
    light: '#42A5F5',
    dark: '#0D47A1',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#6A1B9A',
    light: '#9C4DCC',
    dark: '#38006B',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
    contrastText: '#FFFFFF',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  dark: {
    background: {
      default: '#121212',
      paper: '#1E1E1E',
      elevated: '#2C2C2C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
};

export const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontFamilyMono: '"Roboto Mono", "SFMono-Regular", "Consolas", monospace',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    '4xl': '2rem',
    '5xl': '2.5rem',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.6,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const shape = {
  borderRadius: 8,
  borderRadiusSm: 4,
  borderRadiusLg: 12,
};

export const themeMode = {
  storageKey: 'support-ticket-theme-mode',
  colorSchemeStorageKey: 'support-ticket-color-scheme',
  defaultMode: 'system',
};
