import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { devicesActions } from '../store';
import { useEffectAsync } from '../reactHelper';
import DeviceRow from './DeviceRow';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const DeviceList = ({ devices, isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const listInnerEl = useRef(null);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const allDevices = useSelector((state) => state.devices.items);

  if (listInnerEl.current) {
    listInnerEl.current.className = 'relative';
  }

  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffectAsync(async () => {
    const response = await fetch('/api/devices');
    if (response.ok) {
      dispatch(devicesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, []);

  const selectedDevice = selectedDeviceId ? allDevices[selectedDeviceId] : null;

  return (
    <div className={`flex flex-col ${!isCollapsed ? 'h-full' : ''}`}>
      <div 
        className="flex items-center justify-between px-3 py-2 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="font-semibold text-gray-800 dark:text-white text-lg">Device List</span>
        {isCollapsed ? <ArrowDropDownIcon className="text-gray-600 dark:text-gray-300" /> : <ArrowDropUpIcon className="text-gray-600 dark:text-gray-300" />}
      </div>
      
      {!isCollapsed ? (
        <div className="flex-1 min-h-0">
          <AutoSizer className="max-h-full">
            {({ height, width }) => (
              <FixedSizeList
                width={width}
                height={height}
                itemCount={devices.length}
                itemData={devices}
                itemSize={60}
                overscanCount={10}
                innerRef={listInnerEl}
              >
                {DeviceRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      ) : (
        selectedDevice && (
          <div >
            <DeviceRow 
              index={0} 
              style={{}} 
              data={[selectedDevice]} 
            />
          </div>
        )
      )}
    </div>
  );
};

export default DeviceList;
