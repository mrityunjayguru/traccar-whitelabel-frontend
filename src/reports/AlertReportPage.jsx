import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import {
  formatDistance,
  formatSpeed,
  formatVolume,
  formatTime,
  formatNumericHours,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePersistedState from '../common/util/usePersistedState';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import scheduleReport from './common/scheduleReport';
import ReportLayout from './components/ReportLayout';
import ReportTableEmptyState from './components/ReportTableEmptyState';

// ✅ Manual column definitions
const allColumns = [
  { key: 'deviceName', label: 'Vehicle Number' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
  { key: 'eventType', label: 'Event' },

];

const AlertReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  // ✅ Use manual columns instead of ColumnSelect
  const [selectedColumns, setSelectedColumns] = usePersistedState('summaryColumns', [
    'startTime',
    'distance',
    'averageSpeed',
  ]);
  const [daily, setDaily] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCatch(async ({ deviceIds, groupIds, from, to, type }) => {
    const query = new URLSearchParams({ from, to, daily });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));
    groupIds.forEach((groupId) => query.append('groupId', groupId));

    if (type === 'export') {
      window.location.assign(`/api/reports/summary/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/summary/mail?${query.toString()}`);
      if (!response.ok) throw Error(await response.text());
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/summaryAlert?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw Error(await response.text());
        setItems(await response.json());
        
        console.log("items");
        console.log("items");
        console.log(items);
        console.log("items");
        console.log("items");



      } finally {
        setLoading(false);
      }
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'summary';
    report.attributes.daily = daily;
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) throw Error(error);
    navigate('/reports/scheduled');
  });

  // ✅ Manual checkbox control for columns
  const toggleColumn = (key) => {
    if (selectedColumns.includes(key)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== key));
    } else {
      setSelectedColumns([...selectedColumns, key]);
    }
  };

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'deviceId':
        return devices[value]?.name || '';
      case 'deviceName':
        return value;
      case 'startOdometer':
      case 'endOdometer':
      case 'distance':
        return formatDistance(value, distanceUnit, t);
      case 'averageSpeed':
      case 'maxSpeed':
        return value > 0 ? formatSpeed(value, speedUnit, t) : null;
      case 'engineHours':
      case 'startHours':
      case 'endHours':
        return value > 0 ? formatNumericHours(value, t) : null;
      case 'spentFuel':
        return value > 0 ? formatVolume(value, volumeUnit, t) : null;
      default:
        return value;
    }
  };

  return (
    <ReportLayout
      breadcrumbs={['reportTitle', 'reportSummary']}
      handleSubmit={handleSubmit}
      handleSchedule={handleSchedule}
      multiDevice
      includeGroups
      loading={loading}
      filterExtension={(
        <>
          <div className="flex flex-col gap-4">
            <FormControl fullWidth size="small">
              <InputLabel>{t('sharedType')}</InputLabel>
              <Select
                label={t('sharedType')}
                value={daily}
                onChange={(e) => setDaily(e.target.value)}
              >
                <MenuItem value={false}>{t('reportSummary')}</MenuItem>
                <MenuItem value>{t('reportDaily')}</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel id="columns-select-label">Select Columns</InputLabel>
              <Select
                labelId="columns-select-label"
                multiple
                value={selectedColumns}
                onChange={(e) => setSelectedColumns(e.target.value)}
                renderValue={(selected) =>
                  selected
                    .map((key) => allColumns.find((c) => c.key === key)?.label || key)
                    .join(', ')
                }
              >
                {allColumns.map((col) => (
                  <MenuItem key={col.key} value={col.key}>
                    <Checkbox checked={selectedColumns.includes(col.key)} />
                    <span>{col.label}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </>
      )}
    >
      <div className={classes.containerMain}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('sharedDevice')}</TableCell>
              {selectedColumns.map((key) => {
                const col = allColumns.find((c) => c.key === key);
                return <TableCell key={key}>{col ? col.label : key}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              items.length ? items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{devices[item.deviceId]?.name || item.deviceName || ''}</TableCell>
                  {selectedColumns.map((key) => (
                    <TableCell key={key}>{formatValue(item, key)}</TableCell>
                  ))}
                </TableRow>
              )) : <ReportTableEmptyState colSpan={selectedColumns.length + 1} />
            ) : (
              <TableShimmer columns={selectedColumns.length + 1} />
            )}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
};

export default AlertReportPage;
