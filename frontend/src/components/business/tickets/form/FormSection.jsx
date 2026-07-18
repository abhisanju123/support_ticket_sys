import Box from '@mui/material/Box';

export function FormSection({ title, description, children, sx }) {
  return (
    <Box
      component="section"
      className="app-form-section"
      sx={{
        height: '100%',
        ...sx,
      }}
    >
      <Box className="app-form-section__header">
        <h3 className="app-form-section__title">{title}</h3>
        {description ? <p className="app-form-section__description">{description}</p> : null}
      </Box>
      <Box className="app-form-fields" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
