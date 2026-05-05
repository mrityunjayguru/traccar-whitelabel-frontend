import React, {
  useState, useCallback, useEffect,
} from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import DeviceList from './DeviceList';
import BottomMenu from '../common/components/BottomMenu';
import StatusCard from '../common/components/StatusCard';
import { devicesActions } from '../store';
import usePersistedState from '../common/util/usePersistedState';
import EventsDrawer from './EventsDrawer';
import useFilter from './useFilter';
import MainToolbar from './MainToolbar';
import MainMap from './MainMap';
import { useAttributePreference } from '../common/util/preferences';
import SideBarNav from '../common/components/SideBarNav';
import { useTranslation } from '../common/components/LocalizationProvider';


const MainPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const mapOnSelect = useAttributePreference('mapOnSelect', true);

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId);

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);

  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(keyword, filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  const deviceStatusCount = (status) => Object.values(devices).filter((d) => d.status === status).length;

  const handleStatusToggle = (status) => {
    const newStatuses = filter.statuses.includes(status)
      ? filter.statuses.filter((s) => s !== status)
      : [...filter.statuses, status];
    setFilter({ ...filter, statuses: newStatuses });
  };

  return (
    <div className="h-full relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MainMap
          filteredPositions={filteredPositions}
          selectedPosition={selectedPosition}
          onEventsClick={onEventsClick}
        />
      </div>

      {desktop && (
        <div className="absolute left-20 top-3 right-2 z-10 pointer-events-none flex">
          <div className="pointer-events-auto bg-white dark:bg-[#1A1C1E]! px-4 py-1 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center w-fit">
            <MainToolbar
              keyword={keyword}
              setKeyword={setKeyword}
              filter={filter}
              setFilter={setFilter}
              filterSort={filterSort}
              setFilterSort={setFilterSort}
              filterMap={filterMap}
              setFilterMap={setFilterMap}
              handleStatusToggle={handleStatusToggle}
            />
          </div>
        </div>
      )}

      <div className={`pointer-events-none absolute inset-0 flex flex-col md:p-0 ${desktop ? 'md:left-20 md:top-20' : 'md:left-2 md:top-3'} md:bottom-3 md:w-65 md:z-10 md:h-auto md:inset-auto`}>
        {!desktop && (
          <div className="pointer-events-auto z-6 bg-white dark:bg-[#1A1C1E]! dark:text-white rounded-2xl border border-gray-100 dark:border-gray-800">
            <MainToolbar
              keyword={keyword}
              setKeyword={setKeyword}
              filter={filter}
              setFilter={setFilter}
              filterSort={filterSort}
              setFilterSort={setFilterSort}
              filterMap={filterMap}
              setFilterMap={setFilterMap}
              handleStatusToggle={handleStatusToggle}
            />
          </div>
        )}

        {desktop && (
          <>
            <div className="pointer-events-auto flex-1 overflow-y-auto z-5 bg-white dark:bg-[#1A1C1E]! dark:text-white p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <DeviceList devices={filteredDevices} />
            </div>
          </>
        )}
      </div>

      {!desktop && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <BottomMenu />
        </div>
      )}

      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />

      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
          desktop={desktop}
        />
      )}
    </div>
  );
};

export default MainPage;
