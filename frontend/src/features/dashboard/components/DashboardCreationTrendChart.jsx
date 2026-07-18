import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CHART_WIDTH = 360;
const CHART_HEIGHT = 180;
const PADDING = { top: 16, right: 16, bottom: 32, left: 16 };

/**
 * @param {{
 *   points: Array<{ label: string; shortLabel: string; count: number }>;
 * }} props
 */
export function DashboardCreationTrendChart({ points = [] }) {
  const maxCount = Math.max(...points.map((point) => point.count), 1);
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const coordinates = points.map((point, index) => {
    const x =
      points.length <= 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (points.length - 1)) * plotWidth;
    const y = PADDING.top + plotHeight - (point.count / maxCount) * plotHeight;

    return { ...point, x, y };
  });

  const polylinePoints = coordinates.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <Box className="app-panel app-panel--full-height stack-spacing">
      <Box>
        <Typography variant="h6" component="h3" fontWeight={600}>
          Tickets Created
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Daily trend for the last 7 days
        </Typography>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box
          component="svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          sx={{ width: '100%', minWidth: 280, maxWidth: CHART_WIDTH, display: 'block' }}
          role="img"
          aria-label="Line chart showing tickets created per day over the last seven days"
        >
          {[0, 0.5, 1].map((ratio) => {
            const y = PADDING.top + plotHeight * (1 - ratio);

            return (
              <line
                key={ratio}
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                stroke="var(--app-color-border)"
                strokeDasharray="4 4"
              />
            );
          })}

          {coordinates.length > 1 ? (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="var(--mui-palette-primary-main, #1565C0)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}

          {coordinates.map((point) => (
            <g key={point.shortLabel}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4.5"
                fill="var(--mui-palette-primary-main, #1565C0)"
              />
              <text
                x={point.x}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                fontSize="10"
                fill="var(--app-color-text-secondary, #757575)"
              >
                {point.label}
              </text>
            </g>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
