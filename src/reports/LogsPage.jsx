import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, TableRow, TableCell, TableHead, TableBody, IconButton, Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import { sessionActions } from '../store';
import useReportStyles from './common/useReportStyles';

import ReportLayout from './components/ReportLayout';

const LogsPage = () => {
  const classes = useReportStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  useEffect(() => {
    dispatch(sessionActions.enableLogs(true));
    return () => dispatch(sessionActions.enableLogs(false));
  }, []);

  const items = useSelector((state) => state.session.logs);

  const registerDevice = (uniqueId) => {
    const query = new URLSearchParams({ uniqueId });
    navigate(`/settings/device?${query.toString()}`);
  };

  return (
    <ReportLayout breadcrumbs={['reportTitle', 'sharedLogs']} fullWidth>
      <div className={classes.containerMain} style={{ height: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.columnAction} style={{ width: '48px' }} />
              <TableCell style={{ width: '150px' }}>{t('deviceIdentifier')}</TableCell>
              <TableCell style={{ width: '100px' }}>{t('positionProtocol')}</TableCell>
              <TableCell>{t('commandData')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => /* eslint-disable react/no-array-index-key */ (
              <TableRow key={index}>
                <TableCell className={classes.columnAction} style={{ width: '48px' }}>
                  {item.deviceId ? (
                    <IconButton color="success" size="small" disabled>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Tooltip title={t('loginRegister')}>
                      <IconButton color="error" size="small" onClick={() => registerDevice(item.uniqueId)}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell style={{ width: '150px' }}>{item.uniqueId}</TableCell>
                <TableCell style={{ width: '100px' }}>{item.protocol}</TableCell>
                <TableCell style={{ wordBreak: 'break-all' }}>{item.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
};

export default LogsPage;
