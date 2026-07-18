import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import appLogo from '../assets/app-logo.svg';
import { APP_TITLE, SIDEBAR_LOGO_SIZE } from '../constants/layout.constants.js';
import { ROUTE_PATHS } from '../constants/routes.constants.js';

/**
 * @param {{
 *   size?: number;
 *   showLink?: boolean;
 *   showTitle?: boolean;
 *   layout?: 'row' | 'column';
 * }} props
 */
export function AppLogo({
  size = SIDEBAR_LOGO_SIZE,
  showLink = true,
  showTitle = false,
  layout = 'row',
}) {
  const isColumn = layout === 'column';

  const brand = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: isColumn ? 'column' : 'row',
        gap: isColumn ? 1 : 1.25,
        textAlign: isColumn ? 'center' : 'left',
      }}
    >
      <Box
        component="img"
        src={appLogo}
        alt={APP_TITLE}
        sx={{
          width: size,
          height: size,
          display: 'block',
          flexShrink: 0,
        }}
      />

      {showTitle ? (
        <Typography
          variant={isColumn ? 'h6' : 'subtitle1'}
          component="span"
          fontWeight={700}
          sx={{
            color: 'text.primary',
            lineHeight: 1.2,
            maxWidth: isColumn ? 'none' : { xs: 150, sm: 220 },
          }}
        >
          {APP_TITLE}
        </Typography>
      ) : null}
    </Box>
  );

  if (!showLink) {
    return brand;
  }

  return (
    <Box
      component={RouterLink}
      to={ROUTE_PATHS.DASHBOARD}
      aria-label={`${APP_TITLE} home`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        borderRadius: 1.5,
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      {brand}
    </Box>
  );
}
