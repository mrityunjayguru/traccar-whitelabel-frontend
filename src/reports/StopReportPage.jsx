import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import {
  formatDistance, formatVolume, formatTime, formatNumericHours,
} from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ColumnSelect from './components/ColumnSelect';
import usePersistedState from '../common/util/usePersistedState';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import MapPositions from '../map/MapPositions';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import AddressValue from '../common/components/AddressValue';
import TableShimmer from '../common/components/TableShimmer';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import CustomAddressValue from './CustomAddressValue';

import ReportLayout from './components/ReportLayout';
import ReportTableEmptyState from './components/ReportTableEmptyState';

const columnsArray = [
  ['startTime', 'reportStartTime'],
  ['startOdometer', 'positionOdometer'],
  ['address', 'positionAddress'],
  ['endTime', 'reportEndTime'],
  ['duration', 'reportDuration'],
  ['engineHours', 'reportEngineHours'],
  ['spentFuel', 'reportSpentFuel'],
];
const columnsMap = new Map(columnsArray);

const StopReportPage = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();

  const distanceUnit = useAttributePreference('distanceUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [columns, setColumns] = usePersistedState('stopColumns', ['startTime', 'endTime', 'startOdometer', 'address']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = useCatch(async ({ deviceId, from, to, type }) => {
    const query = new URLSearchParams({ deviceId, from, to });
    if (type === 'export') {
      window.location.assign(`/api/reports/stops/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/stops/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/stops?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          setItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'stops';
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  const formatValue = (item, key) => {
    const value = item[key];
    switch (key) {
      case 'startTime':
      case 'endTime':
        return formatTime(value, 'minutes');
      case 'startOdometer':
        return formatDistance(value, distanceUnit, t);
      case 'duration':
        return formatNumericHours(value, t);
      case 'engineHours':
        return value > 0 ? formatNumericHours(value, t) : null;
      case 'spentFuel':
        return value > 0 ? formatVolume(value, volumeUnit, t) : null;
      case 'address':
        return (<CustomAddressValue latitude={item.latitude} longitude={item.longitude} originalAddress={value} />);
      default:
        return value;
    }
  };

  return (
    <ReportLayout
      breadcrumbs={['reportTitle', 'reportStops']}
      handleSubmit={handleSubmit}
      handleSchedule={handleSchedule}
      loading={loading}
      showExportButton
      filterExtension={(
        <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
      )}
    >
      <div className={classes.container}>
        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              <MapPositions
                positions={[{
                  deviceId: selectedItem.deviceId,
                  fixTime: selectedItem.startTime,
                  latitude: selectedItem.latitude,
                  longitude: selectedItem.longitude,
                }]}
                titleField="fixTime"
              />
            </MapView>
            <MapScale />
            <MapCamera latitude={selectedItem.latitude} longitude={selectedItem.longitude} />
          </div>
        )}
        <div className={classes.containerMain}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                items.length ? items.map((item) => (
                  <TableRow key={item.positionId}>
                    {columns.map((key, index) => (
                      <TableCell key={key}>
                        {index === 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {selectedItem === item ? (
                              <IconButton size="small" onClick={() => setSelectedItem(null)}>
                                <GpsFixedIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <IconButton size="small" onClick={() => setSelectedItem(item)}>
                                <LocationSearchingIcon fontSize="small" />
                              </IconButton>
                            )}
                            {formatValue(item, key)}
                          </div>
                        ) : formatValue(item, key)}
                      </TableCell>
                    ))}
                  </TableRow>
                )) : <ReportTableEmptyState colSpan={columns.length} />
              ) : (<TableShimmer columns={columns.length} startAction />)}
            </TableBody>
          </Table>
        </div>
      </div>
    </ReportLayout>
  );
};

export default StopReportPage;
