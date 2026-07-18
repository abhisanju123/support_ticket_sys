import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { useBreadcrumbs } from '../hooks/useBreadcrumbs.js';

import { DashboardBackButton } from './DashboardBackButton.jsx';

export function AppBreadcrumbs() {
  const crumbs = useBreadcrumbs();

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <Box
      className="inline-spacing page-breadcrumbs"
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        mb: 2,
        minWidth: 0,
        width: '100%',
      }}
    >
      <DashboardBackButton />
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          flex: 1,
          minWidth: 0,
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'wrap',
          },
          '& .MuiBreadcrumbs-li': {
            minWidth: 0,
          },
        }}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          if (isLast || !crumb.path) {
            return (
              <Typography
                key={`${crumb.label}-${index}`}
                color="text.primary"
                fontWeight={600}
                variant="body2"
              >
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={`${crumb.label}-${index}`}
              component={RouterLink}
              to={crumb.path}
              underline="hover"
              color="text.secondary"
              variant="body2"
            >
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
