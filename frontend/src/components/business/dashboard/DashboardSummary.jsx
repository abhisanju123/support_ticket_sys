import Box from '@mui/material/Box';

import { PageHeader } from '../shared/PageHeader.jsx';
import { Panel } from '../shared/Panel.jsx';

import { DashboardCardGrid } from './DashboardCardGrid.jsx';

export function DashboardSummary({ title, description, items = [], actions = null, children = null }) {
  return (
    <Box className="stack-spacing">
      <PageHeader title={title} description={description} actions={actions} />
      {items.length > 0 ? (
        <Panel component="section">
          <DashboardCardGrid items={items} />
        </Panel>
      ) : null}
      {children}
    </Box>
  );
}
