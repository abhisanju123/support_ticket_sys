import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { PageTitle } from './PageTitle.jsx';

export function PageHeader({ title, description, actions = null }) {
  return (
    <Box className="inline-spacing" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Box className="stack-spacing">
        <PageTitle>{title}</PageTitle>
        {description ? (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Box>
      {actions}
    </Box>
  );
}
