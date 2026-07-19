import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { buildConicGradient } from '../utils/dashboardChartData.js';

/**
 * @param {{
 *   segments: Array<{ label: string; value: number; color: string; statusKey?: string }>;
 * }} props
 */
export function DashboardStatusBreakdownChart({ segments = [] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const gradient = buildConicGradient(segments);

  return (
    <Box className="app-panel app-panel--full-height stack-spacing">
      <Box>
        <Typography variant="h6" component="h3" fontWeight={600}>
          Status Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Open, in progress, resolved, closed, and cancelled tickets
        </Typography>
      </Box>

      {total === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No ticket data to chart yet.
        </Typography>
      ) : (
        <Box className="dashboard-chart-body inline-spacing" sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Box
            className="dashboard-donut-chart"
            sx={{ background: gradient }}
            aria-hidden="true"
          >
            <Box className="dashboard-donut-chart__center">
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {total.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Box className="stack-spacing" sx={{ flex: 1, minWidth: 180 }}>
            {segments.map((segment) => {
              const percent = total > 0 ? Math.round((segment.value / total) * 100) : 0;

              return (
                <Box
                  key={segment.statusKey ?? segment.label}
                  className="inline-spacing"
                  sx={{ justifyContent: 'space-between' }}
                >
                  <Box className="inline-spacing">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: segment.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2">{segment.label}</Typography>
                  </Box>

                  <Typography variant="body2" fontWeight={600}>
                    {segment.value.toLocaleString()} ({percent}%)
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
