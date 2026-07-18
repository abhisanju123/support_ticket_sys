import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

import { getStatusStyle, getTableStatusLabelSx, STATUS_FONT_SIZE } from './statusColors.js';

export function StatusTimeline({ steps = [], currentStatus }) {
  const activeStep = steps.findIndex((step) => step.status === currentStatus);

  return (
    <Box className="w-full overflow-x-auto">
      <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: 480 }}>
        {steps.map((step) => {
          const isComplete = activeStep > steps.findIndex((item) => item.status === step.status);
          const isCurrent = step.status === currentStatus;
          const statusStyle = getStatusStyle(step.status);

          return (
            <Step key={step.status} completed={isComplete}>
              <StepLabel
                icon={
                  isComplete || isCurrent ? (
                    <CheckCircleOutlinedIcon
                      sx={{
                        color: isCurrent ? statusStyle.iconBg : statusStyle.borderColor,
                        transition: 'color 0.2s ease, transform 0.2s ease',
                        transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                      }}
                    />
                  ) : (
                    <RadioButtonUncheckedIcon color="disabled" />
                  )
                }
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: STATUS_FONT_SIZE,
                    ...(isCurrent || isComplete
                      ? getTableStatusLabelSx(step.status)
                      : { color: 'text.secondary', fontWeight: 500 }),
                    fontWeight: isCurrent ? 700 : isComplete ? 600 : 500,
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
