import React, {
  Fragment, useCallback, useEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import MapView from '../map/core/MapView';
import MapRoutePath from '../map/MapRoutePath';
import MapRoutePoints from '../map/MapRoutePoints';
import MapPositions from '../map/MapPositions';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import MapCamera from '../map/MapCamera';
import MapGeofence from '../map/MapGeofence';
import scheduleReport from './common/scheduleReport';
import MapScale from '../map/MapScale';
import { useRestriction } from '../common/util/permissions';
import CollectionActions from '../settings/components/CollectionActions';
import { formatSpeed, formatDistance, formatTime } from '../common/util/formatter';
import { useAttributePreference } from '../common/util/preferences';

const Mobilization = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();
  const speedUnit = useAttributePreference('speedUnit');
  const distanceUnit = useAttributePreference('distanceUnit');
  const positionAttributes = usePositionAttributes(t);
  const devices = useSelector((state) => state.devices.items);
  const readonly = useRestriction('readonly');

  const minutesToHHMMSS = (minutes) => {
    if (minutes == null || isNaN(minutes)) return '';
    const totalSeconds = Math.floor(minutes * 60);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const [available, setAvailable] = useState([]);
  const [prevaddress, setPrevaddress] = useState('N/A');
  const [curraddress, setCurraddress] = useState('N/A');

// Device Name
// 	Distance (Kms)
// 	Average Speed (Km/h)
// 	Max Speed (Km/h)
// 	Max Speed Time	
// Engine Hours	
// Idle Time	
// Start Coords	End Coords	
// Start Address	
// End Address	
// Start Time	End Time
// 	Geofence In (Times)	Geofence Out (Times)	
// Ignition On (Times)	
// Ignition Off (Times)


  // ✅ Columns with label + key
  const [columns, setColumns] = useState([
    { key: 'distanceKm', label: 'Total Distance (Kms)' },
    { key: 'avgSpeed', label: 'Average Speed (Km/h)' },
    { key: 'maxSpeed', label: 'Max Speed (Km/h)' },
    { key: 'maxSpeedTime', label: 'Max Speed Time' },
    { key: 'engineTime', label: 'Engine Hours' },
    { key: 'idleTime', label: 'Idle Time' },
    { key: 'Start Coords', label: 'Start Coords' },
    { key: 'End Coords', label: 'End Coords' },
    { key:'startAddress', label: 'Start Address' },
    { key: 'endAddress', label: 'End Address' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },

    {key:'geofenceInTime', label: 'Geofence In (Times)' },
    {key:'geofenceOutTime', label: 'Geofence Out (Times)' },
    {key:'ignitionOnTime', label: 'Ignition On (Times)' },
    {key:'ignitionOffTime', label: 'Ignition Off (Times)' },

    
  ]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const selectedIcon = useRef();

  useEffect(() => {
    if (selectedIcon.current) {
      selectedIcon.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [selectedItem]);

  const onMapPointClick = useCallback((id) => {
    setSelectedItem(items.find((it) => it.id === id));
  }, [items]);

  const handleSubmit = useCatch(async ({ deviceIds, from, to, type }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((id) => query.append('deviceId', id));

    setLoading(true);
    try {
      const res = await fetch(`/api/reports/routelivi?${query.toString()}`);
      const data = await res.json();

      // reverse geocode
      try {
        const prev = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${data[0].prelatitude}&lon=${data[0].prevlongitude}&format=json`);
        const prevJson = await prev.json();
        setPrevaddress(prevJson.display_name);
      } catch {}

      try {
        const curr = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${data[0].curlatitude}&lon=${data[0].curlongitude}&format=json`);
        const currJson = await curr.json();
        setCurraddress(currJson.display_name);
      } catch {}

      setItems(data);
    } finally {
      setLoading(false);
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'route';
    const error = await scheduleReport(deviceIds, groupIds, report);
    if (error) throw Error(error);
    navigate('/reports/scheduled');
  });

  const formatValue = (item, key) => {
    const value = item[key];
    if (value == null) return '';

    switch (key) {
      case 'startTime':
      case 'endTime':
      case 'firstIgnition':
      case 'lastIgnition':
      case 'maxSpeedTime':
        return formatTime(value, 'time');

      case 'distanceKm':
        return formatDistance(value, distanceUnit, t);

      case 'avgSpeed':
      case 'maxSpeed':
        return value > 0 ? formatSpeed(value, speedUnit, t) : '';

      case 'startAddress':
        return prevaddress;

      case 'endAddress':
        return curraddress;

      case 'idleTime':
      case 'motionTime':
      case 'stopTime':
      case 'engineTime':  
      case 'geofenceInTime':
      case 'geofenceOutTime':
      case 'ignitionOnTime':
      case 'ignitionOffTime':
        return minutesToHHMMSS(value);

      default:
        return value;
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportRoute']}>
      <div className={classes.container}>

        {selectedItem && (
          <div className={classes.containerMap}>
            <MapView>
              <MapGeofence />
              {[...new Set(items.map((it) => it.deviceId))].map((deviceId) => {
                const positions = items.filter((p) => p.deviceId === deviceId);
                return (
                  <Fragment key={deviceId}>
                    <MapRoutePath positions={positions} />
                    <MapRoutePoints positions={positions} onClick={onMapPointClick} />
                  </Fragment>
                );
              })}
              <MapPositions positions={[selectedItem]} titleField="fixTime" />
            </MapView>
            <MapScale />
            <MapCamera positions={items} />
          </div>
        )}

        <div className={classes.containerMain}>
          <div className={classes.header}>
            <ReportFilter handleSubmit={handleSubmit} handleSchedule={handleSchedule} multiDevice loading={loading}>
              
              {/* ✅ ColumnSelect FIX */}
              <ColumnSelect
                columns={columns.map(c => c.key)}
                setColumns={(keys) =>
                  setColumns(keys.map(k => columns.find(c => c.key === k) || { key: k, label: k }))
                }
                columnsArray={available}
                rawValues
                disabled={!items.length}
              />

            </ReportFilter>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>{t('sharedDevice')}</TableCell>

                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.label}
                  </TableCell>
                ))}

                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading ? items.map((item) => (
                <TableRow key={item.id}>

                  <TableCell>
                    <IconButton onClick={() => setSelectedItem(item)}>
                      <LocationSearchingIcon fontSize="small" />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    {devices[item.deviceId]?.name || 'Unknown'}
                  </TableCell>

                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {formatValue(item, col.key)}
                    </TableCell>
                  ))}

                  <TableCell>
                    <CollectionActions itemId={item.id} endpoint="positions" readonly={readonly} />
                  </TableCell>

                </TableRow>
              )) : (
                <TableShimmer columns={columns.length + 2} />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default Mobilization;