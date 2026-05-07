import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import ReportFilter from './components/ReportFilter';
import { useTranslation } from '../common/components/LocalizationProvider';
import ReportLayout from './components/ReportLayout';
import ColumnSelect from './components/ColumnSelect';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { useCatch } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import scheduleReport from './common/scheduleReport';
import ReportTableEmptyState from './components/ReportTableEmptyState';
import { formatSpeed, formatDistance, formatTime } from '../common/util/formatter';
import { useAttributePreference } from '../common/util/preferences';
import { useRestriction } from '../common/util/permissions';

const Mobilization = () => {
  const navigate = useNavigate();
  const classes = useReportStyles();
  const t = useTranslation();
  const speedUnit = useAttributePreference('speedUnit');
  const distanceUnit = useAttributePreference('distanceUnit');
  const positionAttributes = usePositionAttributes(t);
  const devices = useSelector((state) => state.devices.items);

  const readonly = useRestriction('readonly');
  const users = useSelector((state) => state.users);

const user = useSelector(state => state.session.user);

  console.log("Devices ");
 
  console.log(devices);
  console.log("Devices ");

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
   /* { key: 'distanceKm', label: 'Total Distance (Kms)' },
    { key: 'avgSpeed', label: 'Average Speed (Km/h)' },
    { key: 'maxSpeed', label: 'Max Speed (Km/h)' },
    { key: 'maxSpeedTime', label: 'Max Speed Time' },
    { key: 'engineTime', label: 'Engine Hours' },
    { key: 'idleTime', label: 'Idle Time' },
    { key: 'Start Coords', label: 'Start Coords' },
    { key: 'End Coords', label: 'End Coords' },
*/
    { key:'startAddress', label: 'Start Address' },
    { key: 'endAddress', label: 'End Address' }
   /* { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },

    {key:'geofenceInTime', label: 'Geofence In (Times)' },
    {key:'geofenceOutTime', label: 'Geofence Out (Times)' },
    {key:'ignitionOnTime', label: 'Ignition On (Times)' },
    {key:'ignitionOffTime', label: 'Ignition Off (Times)' },
*/
    
  ]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <ReportLayout
      breadcrumbs={['reportTitle', 'reportRoute']}
      handleSubmit={handleSubmit}
      handleSchedule={handleSchedule}
      multiDevice
      loading={loading}
      showExportButton
      filterExtension={(
        <ColumnSelect
          columns={columns.map(c => c.key)}
          setColumns={(keys) =>
            setColumns(keys.map(k => columns.find(c => c.key === k) || { key: k, label: k }))
          }
          columnsArray={available}
          rawValues
          disabled={!items.length}
        />
      )}
    >
      <div className={classes.containerMain}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('sharedDevice')}</TableCell>
              <TableCell>{"User Name"}</TableCell>
              <TableCell>{"Type"}</TableCell>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading ? (
              items.length ? items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{devices[item.deviceId]?.name || 'Unknown'}</TableCell>
                  <TableCell>{user.name }</TableCell>
                  <TableCell>{devices[item.deviceId]?.uniqueId || 'Unknown'}</TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {formatValue(item, col.key)}
                    </TableCell>
                  ))}
                </TableRow>
              )) : <ReportTableEmptyState colSpan={columns.length + 3} />
            ) : (<TableShimmer columns={columns.length + 3} />)}
          </TableBody>
        </Table>
      </div>
    </ReportLayout>
  );
};

export default Mobilization;