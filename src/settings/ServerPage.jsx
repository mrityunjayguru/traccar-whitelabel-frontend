import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  FormControl,
  Container,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DropzoneArea } from 'react-mui-dropzone';
import { sessionActions } from '../store';
import EditAttributesAccordion from './components/EditAttributesAccordion';
import { useTranslation } from '../common/components/LocalizationProvider';
import SelectField from '../common/components/SelectField';
import SettingsLayout from './components/SettingsLayout';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useCommonUserAttributes from '../common/attributes/useCommonUserAttributes';
import { useCatch } from '../reactHelper';
import useServerAttributes from '../common/attributes/useServerAttributes';
import useMapStyles from '../map/core/useMapStyles';
import { map } from '../map/core/MapView';
import useSettingsStyles from './common/useSettingsStyles';

const ServerPage = () => {
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const mapStyles = useMapStyles();
  const commonUserAttributes = useCommonUserAttributes(t);
  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const serverAttributes = useServerAttributes(t);


  

  const original = useSelector((state) => state.session.server);

  console.log(" ===========state.session.server ===========");
  console.log(original);
  console.log(" ===========state.session.server ===========");

  const [item, setItem] = useState({ ...original });

  const handleFiles = useCatch(async (files) => {
    if (files.length > 0) {
      const file = files[0];
      const response = await fetch(`/api/server/file/${file.path}`, {
        method: 'POST',
        body: file,
      });
      if (!response.ok) {
        throw Error(await response.text());
      }
    }
  });

  const handleSave = useCatch(async () => {
    const response = await fetch('/api/server', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      dispatch(sessionActions.updateServer(await response.json()));
      navigate(-1);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <SettingsLayout breadcrumbs={['settingsTitle', 'settingsServer']}>
      <Container maxWidth="md" className={classes.container}>
        {item && (
          <>
            <Accordion defaultExpanded className="mb-4! border border-gray-200 dark:border-gray-700 rounded-md! shadow-none! before:hidden">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedPreferences')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <TextField
                  value={item.mapUrl || ''}
                  onChange={(event) => setItem({ ...item, mapUrl: event.target.value })}
                  label={t('mapCustomLabel')}
                />

              <TextField
                  value={item.enableotp || ''}
                  onChange={(event) => setItem({ ...item, enableotp: event.target.value })}
                  label="Enable OTP"
                />


              <TextField
                  value={item.masterotp || ''}
                  onChange={(event) => setItem({ ...item, masterotp: event.target.value })}
                  label="Master OTP"
                />





                <TextField
                  value={item.overlayUrl || ''}
                  onChange={(event) => setItem({ ...item, overlayUrl: event.target.value })}
                  label={t('mapOverlayCustom')}
                />
                <FormControl>
                  <InputLabel>{t('mapDefault')}</InputLabel>
                  <Select
                    label={t('mapDefault')}
                    value={item.map || 'locationIqStreets'}
                    onChange={(e) => setItem({ ...item, map: e.target.value })}
                  >
                    {mapStyles.filter((style) => style.available).map((style) => (
                      <MenuItem key={style.id} value={style.id}>
                        <Typography component="span">{style.title}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsCoordinateFormat')}</InputLabel>
                  <Select
                    label={t('settingsCoordinateFormat')}
                    value={item.coordinateFormat || 'dd'}
                    onChange={(event) => setItem({ ...item, coordinateFormat: event.target.value })}
                  >
                    <MenuItem value="dd">{t('sharedDecimalDegrees')}</MenuItem>
                    <MenuItem value="ddm">{t('sharedDegreesDecimalMinutes')}</MenuItem>
                    <MenuItem value="dms">{t('sharedDegreesMinutesSeconds')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsSpeedUnit')}</InputLabel>
                  <Select
                    label={t('settingsSpeedUnit')}
                    value={item.attributes.speedUnit || 'kn'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, speedUnit: e.target.value } })}
                  >
                    <MenuItem value="kn">{t('sharedKn')}</MenuItem>
                    <MenuItem value="kmh">{t('sharedKmh')}</MenuItem>
                    <MenuItem value="mph">{t('sharedMph')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsDistanceUnit')}</InputLabel>
                  <Select
                    label={t('settingsDistanceUnit')}
                    value={item.attributes.distanceUnit || 'km'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, distanceUnit: e.target.value } })}
                  >
                    <MenuItem value="km">{t('sharedKm')}</MenuItem>
                    <MenuItem value="mi">{t('sharedMi')}</MenuItem>
                    <MenuItem value="nmi">{t('sharedNmi')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsAltitudeUnit')}</InputLabel>
                  <Select
                    label={t('settingsAltitudeUnit')}
                    value={item.attributes.altitudeUnit || 'm'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, altitudeUnit: e.target.value } })}
                  >
                    <MenuItem value="m">{t('sharedMeters')}</MenuItem>
                    <MenuItem value="ft">{t('sharedFeet')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsVolumeUnit')}</InputLabel>
                  <Select
                    label={t('settingsVolumeUnit')}
                    value={item.attributes.volumeUnit || 'ltr'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, volumeUnit: e.target.value } })}
                  >
                    <MenuItem value="ltr">{t('sharedLiter')}</MenuItem>
                    <MenuItem value="usGal">{t('sharedUsGallon')}</MenuItem>
                    <MenuItem value="impGal">{t('sharedImpGallon')}</MenuItem>
                  </Select>
                </FormControl>
                <SelectField
                  value={item.attributes.timezone}
                  onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, timezone: e.target.value } })}
                  endpoint="/api/server/timezones"
                  keyGetter={(it) => it}
                  titleGetter={(it) => it}
                  label={t('sharedTimezone')}
                />
                <TextField
                  value={item.poiLayer || ''}
                  onChange={(event) => setItem({ ...item, poiLayer: event.target.value })}
                  label={t('mapPoiLayer')}
                />
                <TextField
                  value={item.announcement || ''}
                  onChange={(event) => setItem({ ...item, announcement: event.target.value })}
                  label={t('serverAnnouncement')}
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={item.forceSettings} onChange={(event) => setItem({ ...item, forceSettings: event.target.checked })} />}
                    label={t('serverForceSettings')}
                  />
                </FormGroup>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4! border border-gray-200 dark:border-gray-700 rounded-md! shadow-none! before:hidden">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedLocation')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <TextField
                  type="number"
                  value={item.latitude || 0}
                  onChange={(event) => setItem({ ...item, latitude: Number(event.target.value) })}
                  label={t('positionLatitude')}
                />
                <TextField
                  type="number"
                  value={item.longitude || 0}
                  onChange={(event) => setItem({ ...item, longitude: Number(event.target.value) })}
                  label={t('positionLongitude')}
                />
                <TextField
                  type="number"
                  value={item.zoom || 0}
                  onChange={(event) => setItem({ ...item, zoom: Number(event.target.value) })}
                  label={t('serverZoom')}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    const { lng, lat } = map.getCenter();
                    setItem({
                      ...item,
                      latitude: Number(lat.toFixed(6)),
                      longitude: Number(lng.toFixed(6)),
                      zoom: Number(map.getZoom().toFixed(1)),
                    });
                  }}
                >
                  {t('mapCurrentLocation')}
                </Button>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4! border border-gray-200 dark:border-gray-700 rounded-md! shadow-none! before:hidden">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedPermissions')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={item.registration} onChange={(event) => setItem({ ...item, registration: event.target.checked })} />}
                    label={t('serverRegistration')}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={item.readonly} onChange={(event) => setItem({ ...item, readonly: event.target.checked })} />}
                    label={t('serverReadonly')}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={item.deviceReadonly} onChange={(event) => setItem({ ...item, deviceReadonly: event.target.checked })} />}
                    label={t('userDeviceReadonly')}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={item.limitCommands} onChange={(event) => setItem({ ...item, limitCommands: event.target.checked })} />}
                    label={t('userLimitCommands')}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={item.disableReports} onChange={(event) => setItem({ ...item, disableReports: event.target.checked })} />}
                    label={t('userDisableReports')}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={item.fixedEmail} onChange={(e) => setItem({ ...item, fixedEmail: e.target.checked })} />}
                    label={t('userFixedEmail')}
                  />
                </FormGroup>
              </AccordionDetails>
            </Accordion>
            <Accordion className="mb-4! border border-gray-200 dark:border-gray-700 rounded-md! shadow-none! before:hidden">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedFile')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <DropzoneArea
                  dropzoneText={t('sharedDropzoneText')}
                  filesLimit={1}
                  onChange={handleFiles}
                  showAlerts={false}
                />
              </AccordionDetails>
            </Accordion>
            <EditAttributesAccordion
              attributes={item.attributes}
              setAttributes={(attributes) => setItem({ ...item, attributes })}
              definitions={{ ...commonUserAttributes, ...commonDeviceAttributes, ...serverAttributes }}
            />
          </>
        )}
        <div className={classes.buttons}>
          <Button type="button" color="primary" variant="outlined" onClick={() => navigate(-1)} className="
              inline-flex items-center justify-center
              px-6 py-2.5 rounded-md
              text-sm font-semibold
              border border-gray-300! dark:border-[#444]!
              text-gray-700! dark:text-gray-200!
              bg-white dark:bg-[#2a2a2e]!
              hover:bg-gray-50! dark:hover:bg-[#333]!
              active:scale-[0.97]
              transition-all duration-150 ease-in-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              shadow-sm cursor-pointer
              w-1/2 md:w-1/6
            ">
            {t('sharedCancel')}
          </Button>
          <Button type="button" color="primary" variant="contained" onClick={handleSave} className="
              inline-flex items-center justify-center
              px-6 py-2.5 rounded-md
              text-sm font-bold
              bg-[#D9E821]! text-black!
              hover:bg-[#d4f500]!
              active:scale-[0.97]
              transition-all duration-150 ease-in-out
              disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
              shadow-md shadow-[#D9E821]/20 cursor-pointer
              w-1/2 md:w-1/6
            ">
            {t('sharedSave')}
          </Button>
        </div>
      </Container>
    </SettingsLayout>
  );
};

export default ServerPage;
