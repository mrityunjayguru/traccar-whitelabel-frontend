
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
import {
  formatSpeed
} from '../common/util/formatter';
import { useAttributePreference } from '../common/util/preferences';

import {
  formatDistance,  formatVolume, formatTime, formatNumericHours,
} from '../common/util/formatter';

const SummaryLivi = () => {
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

  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};





  const [available, setAvailable] = useState([]);
  const [prevaddress, setPrevaddress] = useState("N/A");
  const [curraddress, setCurraddress] = useState("N/A");

  const [columns, setColumns] = useState([
    'zone',
    'vehicleType',
    'stopTime',
    'startTime',
    'endTime',
    'startAddress',
    'endAddress',
    'avgSpeed',
    'distanceKm',
    'firstIgnition',
    'lastIgnition',
    'maxSpeed',
    'maxSpeedTime',
    'geofenceIn',
    'geofenceOut',
    'idleTime',
    'motionTime'
   
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

  const onMapPointClick = useCallback((positionId) => {
    setSelectedItem(items.find((it) => it.id === positionId));
  }, [items]);

  const handleSubmit = useCatch(async ({ deviceIds, from, to, type }) => {
    const query = new URLSearchParams({ from, to });
    deviceIds.forEach((deviceId) => query.append('deviceId', deviceId));

    if (type === 'export') {
      window.location.assign(`/api/reports/route/xlsx?${query.toString()}`);
      return;
    }

    if (type === 'mail') {
      const response = await fetch(`/api/reports/route/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reports/routelivi?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw Error(await response.text());
      }

      const data = await response.json();

      console.log(" Livi Summary ");


      console.log(" Data Summary Livi");
      console.log(data);
      console.log(" Data Summary Livi");
try {

  console.log(" data.prelatitude "+data[0].prelatitude);
  const responseadd = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${data[0].prelatitude}&lon=${data[0].prevlongitude}&format=json&addressdetails=1`
  );

  if (!responseadd.ok) {
    throw new Error(await responseadd.text());
  }

  const add = await responseadd.json();

  console.log("Prev Address:");
  console.log(add.display_name);
  setPrevaddress(add.display_name);
  
  console.log("Prev Address:");

  // setAddress(add.display_name);

} catch (err) {
  console.error("Error fetching address:", err);
}



try {

  console.log(" data.prelatitude "+data[0].prelatitude);
  const responseaddcurr = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${data[0].curlatitude}&lon=${data[0].curlongitude}&format=json&addressdetails=1`
  );

  if (!responseaddcurr.ok) {
    throw new Error(await responseaddcurr.text());
  }

  const add = await responseaddcurr.json();

  console.log("Curr Address:");
  console.log(add.display_name);
   setCurraddress(add.display_name);
  console.log("Curr Address:");

  // setAddress(add.display_name);

} catch (err) {
  console.error("Error fetching address:", err);
}



      const keySet = new Set();
      const keyList = [];

      data.forEach((item) => {
        Object.keys(item).forEach((key) => keySet.add(key));
      });

      ['id', 'deviceId', 'outdated', 'network', 'attributes', 'raw', 'rssi']
        .forEach((key) => keySet.delete(key));

      Object.keys(positionAttributes).forEach((key) => {
        if (keySet.has(key)) {
          keyList.push(key);
          keySet.delete(key);
        }
      });

      setAvailable(
        [...keyList, ...keySet].map((key) => [
          key,
          positionAttributes[key]?.name || key,
        ]),
      );







      setItems(data);
    } finally {
      setLoading(false);
    }
  });

  const handleSchedule = useCatch(async (deviceIds, groupIds, report) => {
    report.type = 'route';
    const error = await scheduleReport(deviceIds, groupIds, report);

    if (error) {
      throw Error(error);
    } else {
      navigate('/reports/scheduled');
    }
  });

  const formatValue =  (item, key) => {
    const value = item[key];

    if (value == null) return '';

    switch (key) {

      
      case 'maxSpeedTime':
              return formatTime(value, 'time');
      
      
      case 'firstIgnition':
              return formatTime(value, 'time');
              
      case 'lastIgnition':
              return formatTime(value, 'time');
      
      case 'endTime':
              return formatTime(value, 'time');

      case 'startTime':
              return formatTime(value, 'time');
      case 'distanceKm':
        return formatDistance(value, distanceUnit, t);
      case 'avgSpeed':
      case 'averageSpeed':
      case 'maxSpeed':
        return value > 0 ? formatSpeed(value, speedUnit, t) : '';
     
     case 'startAddress': 
        return prevaddress;

      case 'endAddress':    
        return curraddress;

      case 'idleTime':
  return minutesToHHMMSS(value);

case 'motionTime':
  return minutesToHHMMSS(value);

case 'stopTime':
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
            <ReportFilter
              handleSubmit={handleSubmit}
              handleSchedule={handleSchedule}
              multiDevice
              loading={loading}
            >
              <ColumnSelect
                columns={columns}
                setColumns={setColumns}
                columnsArray={available}
                rawValues
                disabled={!items.length}
              />
            </ReportFilter>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.columnAction} />
                <TableCell>{t('sharedDevice')}</TableCell>
                {columns.map((key) => (
                  <TableCell key={key}>
                    {positionAttributes[key]?.name || key}
                  </TableCell>
                ))}
                <TableCell className={classes.columnAction} />
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading ? items.slice(0, 4000).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.columnAction} padding="none">
                    {selectedItem === item ? (
                      <IconButton
                        size="small"
                        onClick={() => setSelectedItem(null)}
                        ref={selectedIcon}
                      >
                        <GpsFixedIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={() => setSelectedItem(item)}
                      >
                        <LocationSearchingIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>

                  <TableCell>
                    {devices[item.deviceId]?.name || 'Unknown'}
                  </TableCell>

                  {columns.map((key) => (
                    <TableCell key={key}>
                      {formatValue(item, key)}
                    </TableCell>
                  ))}

                  <TableCell className={classes.actionCellPadding}>
                    <CollectionActions
                      itemId={item.id}
                      endpoint="positions"
                      readonly={readonly}
                      setTimestamp={() => {
                        setItems((prev) =>
                          prev.filter((p) => p.id !== item.id),
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              )) : (
                <TableShimmer columns={columns.length + 2} startAction />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageLayout>
  );
};

export default SummaryLivi;