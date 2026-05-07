import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { Box, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTranslation } from '../../common/components/LocalizationProvider';

const ReportTableEmptyState = ({ colSpan }) => {
  const t = useTranslation();

  return (
    <TableRow className="empty-row">
      <TableCell
        colSpan={colSpan}
        sx={{
          borderBottom: 0,
          py: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            opacity: 0.6,
            textAlign: 'center',
          }}
        >
          <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 1 }} />
          <Typography 
            variant="h5" 
            component="div"
            sx={{ 
              color: 'text.primary', 
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}
          >
            {t('sharedNoData')}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 300
            }}
          >
            Select devices and time range in the sidebar to generate your report.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default ReportTableEmptyState;
