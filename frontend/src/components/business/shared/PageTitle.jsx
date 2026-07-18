import Typography from '@mui/material/Typography';

export function PageTitle({ children, component = 'h1', variant = 'h4' }) {
  return (
    <Typography variant={variant} component={component} className="text-heading text-balance">
      {children}
    </Typography>
  );
}
