import { createTheme } from '@mui/material/styles';

import { breakpoints, colors, shape, spacingUnit, typography } from './tokens.js';

const sharedTypography = {
  fontFamily: typography.fontFamily,
  h1: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
  },
  h2: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 1.35,
  },
  h5: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  h6: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
  },
  subtitle1: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
  subtitle2: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
  },
  body1: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
  },
  body2: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.relaxed,
  },
  button: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'none',
  },
  caption: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
  },
  overline: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};

export const muiTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        background: {
          default: colors.neutral[50],
          paper: '#FFFFFF',
        },
        text: {
          primary: colors.neutral[900],
          secondary: colors.neutral[600],
        },
        divider: colors.neutral[200],
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: {
          ...colors.primary,
          main: colors.primary.light,
        },
        secondary: {
          ...colors.secondary,
          main: colors.secondary.light,
        },
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        background: colors.dark.background,
        text: colors.dark.text,
        divider: colors.dark.divider,
      },
    },
  },
  breakpoints: {
    values: breakpoints,
  },
  spacing: spacingUnit,
  typography: sharedTypography,
  shape: {
    borderRadius: shape.borderRadius,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: shape.borderRadiusLg,
          textTransform: 'none',
          fontWeight: typography.fontWeight.semibold,
          letterSpacing: '0.01em',
          transition:
            'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
            transitionDuration: '0.08s',
          },
          '&:disabled, &.Mui-disabled': {
            pointerEvents: 'none',
            cursor: 'not-allowed',
            transform: 'none',
            boxShadow: 'none',
          },
          '&.Mui-disabled:hover': {
            transform: 'none',
            boxShadow: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }),
        contained: ({ theme }) => ({
          boxShadow: 'none',
          '&:hover': {
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 6px 20px rgba(21, 101, 192, 0.28)'
                : '0 6px 20px rgba(0, 0, 0, 0.45)',
          },
          '&:active': {
            boxShadow: 'none',
          },
          '&.Mui-disabled': {
            backgroundColor:
              theme.palette.mode === 'light' ? colors.neutral[300] : 'rgba(255, 255, 255, 0.12)',
            color:
              theme.palette.mode === 'light' ? colors.neutral[600] : 'rgba(255, 255, 255, 0.38)',
          },
        }),
        outlined: ({ theme }) => ({
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor:
              theme.palette.mode === 'light'
                ? 'rgba(21, 101, 192, 0.05)'
                : 'rgba(66, 165, 245, 0.08)',
          },
        }),
        text: ({ theme }) => ({
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'light'
                ? 'rgba(21, 101, 192, 0.06)'
                : 'rgba(255, 255, 255, 0.06)',
          },
        }),
        sizeLarge: {
          padding: '0.625rem 1.375rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: shape.borderRadius,
          transition:
            'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor:
              theme.palette.mode === 'light'
                ? colors.neutral[100]
                : 'rgba(255, 255, 255, 0.08)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.96)',
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: shape.borderRadiusLg,
          backgroundColor:
            theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.04)',
          transition:
            'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor:
              theme.palette.mode === 'light' ? colors.neutral[400] : 'rgba(255, 255, 255, 0.28)',
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 0 0 3px rgba(21, 101, 192, 0.12)'
                : '0 0 0 3px rgba(66, 165, 245, 0.18)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1.5px',
          },
          '&.Mui-error.Mui-focused': {
            boxShadow:
              theme.palette.mode === 'light'
                ? '0 0 0 3px rgba(211, 47, 47, 0.12)'
                : '0 0 0 3px rgba(239, 83, 80, 0.18)',
          },
        }),
        notchedOutline: ({ theme }) => ({
          borderColor:
            theme.palette.mode === 'light' ? colors.neutral[300] : 'rgba(255, 255, 255, 0.18)',
          transition: 'border-color 0.2s ease',
        }),
        input: {
          padding: '0.8125rem 0.875rem',
        },
        inputMultiline: {
          padding: 0,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: typography.fontWeight.medium,
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            fontWeight: typography.fontWeight.semibold,
          },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: '0.375rem',
          marginLeft: '0.125rem',
          fontSize: typography.fontSize.xs,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: typography.fontFamily,
        },
      },
    },
  },
});
