import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  CardMedia,
  Link,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import MapIcon from '@mui/icons-material/Map';
import ShareIcon from '@mui/icons-material/Share';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback, useEffectAsync } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';

import {
  formatAlarm,
  formatAltitude,
  formatBoolean,
  formatCoordinate,
  formatCourse,
  formatDistance,
  formatNumber,
  formatNumericHours,
  formatPercentage,
  formatSpeed,
  formatTime,
  formatTemperature,
  formatVoltage,
  formatVolume,
  formatConsumption,
} from '../util/formatter';
import { speedToKnots } from '../util/converter';


const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();




  
  const [trackVehiclData, setTrackVehiclData] = useState(null);
  const [summarydata, setSummarydata] = useState(null);
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState(null);
  const [stopsall, setStopsall] = useState(null);

  
    const distanceUnit = useAttributePreference('distanceUnit');
    const altitudeUnit = useAttributePreference('altitudeUnit');
    const speedUnit = useAttributePreference('speedUnit');
    const volumeUnit = useAttributePreference('volumeUnit');
    
  

  let power =  0;
  let sat = 0;
  let speed = 0;
  let maxSpeed = 0;
  let distance = 0;
  let tripdistance = 0;


  let startTime = 0;
  let endTime = 0;
  let tripTime = 0;
  let endOdometer = 0;
  let engineHours = 0;
  let numberstops = 0;
  let duration = null;
  let idleTime = "00:00:00";

  if (position != undefined) {
    sat = Number(position?.attributes?.sat || 0);
    speed = position?.speed ? formatSpeed(position.speed, speedUnit, t) : '0';
    
      power = position.attributes.power.toFixed(2);
  }
  const isConnected = sat > 0;
  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);
  const positionItems = useAttributePreference('positionItems', 'fixTime,address,speed,totalDistance');


  const navigationAppLink = useAttributePreference('navigationAppLink');
  const navigationAppTitle = useAttributePreference('navigationAppTitle');

  const [anchorEl, setAnchorEl] = useState(null);

  const [removing, setRemoving] = useState(false);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetch('/api/devices');
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
    setRemoving(false);
  });
  // Start of today in UTC
  const now = new Date();

  const from = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  )).toISOString();

  // End of today in UTC
  const to = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    23, 59, 59, 999
  )).toISOString();

 // /reports/summary

const imei = device.uniqueId;

/*

useEffect(() => {
  const fetchTripReport = async () => {
    try {
      const data = {
        deviceId,
        imei,
      };

      const response = await fetch(
        "https://app.trackroutepro.com/trackVehicle/tripReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(JSON.stringify(result));
      }

      setTrackVehiclData(result.data || result);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  if (deviceId && imei) {
    fetchTripReport();
  }
}, [deviceId, imei]);

console.log("Trac veichel data ");
console.log(trackVehiclData);
console.log("Trac veichel data ");

*/





  useEffectAsync(async () => {
    const query = new URLSearchParams({
      deviceId,
      from,
      to,
    });

    const response = await fetch(`/api/reports/summary?${query.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {

      const summarydatanew = await response.json(); // ✅ FIX
      setSummarydata(summarydatanew[0]);

    } else {
      throw Error(await response.text());
    }
  }, [deviceId, from, to]); // 👈 REQUIRED 


console.log(" summarydata ==================");

console.log(summarydata);
console.log(" summarydata ==================");





/*

// totalTravelTime example: "8 h 33 m"

const ignitionHours = summarydata?.engineHours ?? "00h00m";
const moveTime = summarydata?.moveTime ?? "00h00m";

// Convert "8 h 33 m" => total minutes
const timeToMinutes = (time) => {
  if (!time) return 0;

  const hourMatch = time.match(/(\d+)\s*h/i);
  const minuteMatch = time.match(/(\d+)\s*m/i);

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

  return hours * 60 + minutes;
};

// Convert minutes => "08h 33m"
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}h ${String(
    minutes
  ).padStart(2, "0")}m`;
};

const ignitionMin = timeToMinutes(ignitionHours);
const moveMin = timeToMinutes(moveTime);

const idleMin = Math.max(0, ignitionMin - moveMin);

const idleTime = minutesToTime(idleMin);

console.log("idleTime");
console.log(idleTime);
console.log("idleTime");
*/











  useEffectAsync(async () => {
    const query = new URLSearchParams({
      deviceId,
      from,
      to,
    });

    const response = await fetch(`/api/reports/trips?${query.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {

      const data = await response.json(); // ✅ FIX
      setTrip(data.length > 0 ? data[data.length-1] : null);

    } else {
      throw Error(await response.text());
    }
  }, [deviceId, from, to]); // 👈 REQUIRED 


  tripdistance = trip ? Number(trip.distance/1000 || 0) : 0;
  


  useEffectAsync(async () => {
    const query = new URLSearchParams({
      deviceId,
      from,
      to,
    });

    const response = await fetch(`/api/reports/stops?${query.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });




    if (response.ok) {

      const datastop = await response.json(); // ✅ FIX

      setStopsall(datastop.length > 0 ? datastop : null);
      setStops(datastop.length > 0 ? datastop[0] : null);

    } else {
      throw Error(await response.text());
    }
  }, [deviceId, from, to]); // 👈 REQUIRED 


  engineHours = stops ? Number(stops.engineHours || 0) : 0;
  duration = stops ? Number(stops.duration || 0) : 0;

  numberstops = stopsall ? Number(stopsall.length || 0) : 0

  maxSpeed = summarydata?.maxSpeed ? formatSpeed(summarydata.maxSpeed, speedUnit, t) : '';

  distance = summarydata ? Number(summarydata.distance/1000 || 0) : 0;

  endOdometer = trip ? Number(trip.endOdometer || 0) : 0;


  startTime = trip?.startTime ? new Date(trip.startTime).getTime() : 0;
  endTime = trip?.endTime ? new Date(trip.endTime).getTime() : 0;

   tripTime = trip?.duration; // duration in milliseconds


const safeTripTime = tripTime ?? 0;

const hours = String(Math.floor(safeTripTime / (1000 * 60 * 60))).padStart(2, "0");

const minutes = String(
  Math.floor((safeTripTime % (1000 * 60 * 60)) / (1000 * 60))
).padStart(2, "0");

const seconds = String(
  Math.floor((safeTripTime % (1000 * 60)) / 1000)
).padStart(2, "0");

const formattedTime = `${hours}h ${minutes}m ${seconds}s`;




  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:` +
      `${minutes.toString().padStart(2, '0')}:` +
      `${seconds.toString().padStart(2, '0')}`;
  };

  tripTime = formatDuration(tripTime);

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetch('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      const item = await response.json();
      const permissionResponse = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
      });
      if (!permissionResponse.ok) {



        throw Error(await permissionResponse.text());
      }
      navigate(`/settings/geofence/${item.id}`);
    } else {
      throw Error(await response.text());
    }
  }, [navigate, position]);

  return (
    <>
      <div
        className="pointer-events-none fixed z-5 right-0"
        style={{
          top: '10px',
          right: '10px',
          bottom: '10px',
          width: '250px',
        }}
      >
        {device && (
          <Card
            elevation={3}
            className="pointer-events-auto flex flex-col rounded-2xl! w-full h-full"
          >
            {deviceImage ? (
              <CardMedia
                className="h-[180px] flex justify-end items-start"
                image={`/api/media/${device.uniqueId}/${deviceImage}`}
              >
                <IconButton
                  size="small"
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize="small" className="text-white mix-blend-difference" />
                </IconButton>
              </CardMedia>
            ) : (
              <div className="flex justify-between items-center p-2 pl-4 border-b border-gray-200 dark:border-gray-800">
                <Typography variant="body2" color="textSecondary" className="flex flex-col text-md! text-black! dark:text-white! font-medium!">
                  <span>
                    {device.name} :
                  </span>
                  <span>
                    {device.uniqueId}
                  </span>
                </Typography>
                <IconButton
                  size="small"
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

              </div>

            )}
            {position && (
              <div className="flex flex-col flex-1 overflow-auto">
                <CardContent className="pt-2 pb-2 flex-1 overflow-auto">
                  <div className="grid grid-cols-1 gap-2 p-2">
                    {positionItems.split(',').filter((key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)).map((key) => (
                      <div   style={{display:"none" }} key={key} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                        <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                          {positionAttributes[key]?.name || key}
                        </Typography>
                        <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold ">
                          <PositionValue
                            position={position}
                            property={position.hasOwnProperty(key) ? key : null}
                            attribute={position.hasOwnProperty(key) ? null : key}
                          />
                        </Typography>
                      </div>
                    ))}
                    {/* Extra tiles */}

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Speed
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {speed}
                      </Typography>
                    </div>



                    <div style={{display:"none" }} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Geofence
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {t('sharedGeofence')}
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        GPS
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {!position ? 'No Data' : isConnected ? 'Connected' : 'Disconnected'}
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Network
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {device?.status}
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Vehicle BTT 
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {power} V
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Trip Dist
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {tripdistance} km/h
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Daily Dist 
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                         {distance} km/h
                      </Typography>
                    </div>
                    <div  style={{display:"none" }} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Trip Time
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {formattedTime}
                      </Typography>
                    </div>
                    <div  style={{display:"none" }} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Idle Time 
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {idleTime}
                      </Typography>
                    </div>
                    <div style={{display:"none" }} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Last Speed
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {speed}
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Stops
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {numberstops}
                      </Typography>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Max Speed
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {maxSpeed}
                      </Typography>
                    </div>
                    <div  style={{display:"none" }} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Odometer
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {endOdometer}
                      </Typography>
                    </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl! border border-gray-200 dark:border-gray-700">
                      <Typography className="text-xs! text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        Altitude
                      </Typography>
                      <Typography className="text-sm! text-gray-700 dark:text-gray-200 font-bold truncate">
                        {position ? `${position.altitude} m` : 'No Data'}
                      </Typography>
                    </div>

                  </div>
                  <div className="px-4 pb-2 mt-1">
                    <Typography variant="body2" className="text-gray-600! dark:text-gray-400! hover:text-gray-800! dark:hover:text-gray-200! font-medium">
                      <Link className="text-gray-600! dark:text-gray-400! hover:text-gray-800! dark:hover:text-gray-200! font-medium" component={RouterLink} to={`/position/${position.id}`} underline="none">{t('sharedShowDetails') }</Link>
                    </Typography>
                  </div>
                </CardContent>
                <CardActions
                  className="flex flex-row justify-center p-2 border-t border-gray-200 dark:border-gray-800 gap-2 flex-wrap"
                  disableSpacing
                >
                  <div className="flex flex-col justify-center items-center">
                    <div className="">
                      <Tooltip title={t('sharedExtra')}>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={(e) => setAnchorEl(e.currentTarget)}
                          disabled={!position}
                        >
                          <PendingIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('reportReplay')}>
                        <IconButton
                          size="small"
                          onClick={() => navigate('/replay')}
                          disabled={disableActions || !position}
                        >
                          <ReplayIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('commandTitle')}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                          disabled={disableActions}
                        >
                          <PublishIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('linkGoogleMaps')}>
                        <IconButton
                          size="small"
                          component="a"
                          target="_blank"
                          href={`https://www.google.com/maps/search/?api=1&query=${position?.latitude}%2C${position?.longitude}`}
                          disabled={!position}
                        >
                          <MapIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className="">
                      {!shareDisabled && !user.temporary && (
                        <Tooltip title={t('deviceShare')}>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => navigate(`/settings/device/${deviceId}/share`)}
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('sharedEdit')}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/settings/device/${deviceId}`)}
                          disabled={disableActions || deviceReadonly}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('sharedRemove')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setRemoving(true)}
                          disabled={disableActions || deviceReadonly}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </CardActions>
              </div>
            )}

          </Card>
        )}
      </div>
      {position && (
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          disableScrollLock={false}
        >
          <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
          {navigationAppTitle && <MenuItem component="a" target="_blank" href={navigationAppLink.replace('{latitude}', position.latitude).replace('{longitude}', position.longitude)}>{navigationAppTitle}</MenuItem>}
          {!shareDisabled && !user.temporary && (
            <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}><Typography color="secondary">{t('deviceShare')}</Typography></MenuItem>
          )}
        </Menu>
      )}
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
