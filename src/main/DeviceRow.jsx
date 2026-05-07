import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tooltip,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { devicesActions } from '../store';
import {
  formatAlarm, formatBoolean, formatStatus,
} from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import { mapIconKey, mapIcons } from '../map/core/preloadImages';
import { useAdministrator } from '../common/util/permissions';
import EngineIcon from '../resources/images/data/engine.svg?react';
import { useAttributePreference } from '../common/util/preferences';
import ICONLIST from '../resources/images/icon/list.svg';

dayjs.extend(relativeTime);

const DeviceRow = ({ data, index, style }) => {
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();

  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference('devicePrimary', 'name');
  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'online': return 'text-[#24B467]';
      case 'offline': return 'text-orange-500';
      case 'unknown': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const secondaryText = () => {
    let status;
    if (item.status === 'online' || !item.lastUpdate) {
      status = formatStatus(item.status, t);
    } else {
      status = dayjs(item.lastUpdate).fromNow();
    }
    return (
      <div className="flex flex-col">
        {deviceSecondary && item[deviceSecondary] && (
          <span className="text-gray-500 dark:text-gray-400 text-sm">{item[deviceSecondary]}</span>
        )}
        <span className={`text-xs font-medium ${getStatusTextColor(item.status)}`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div style={style} className="mt-1">
      <div
        className={`flex items-center p-2 transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg ${item.disabled && !admin ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
      >
        <div className="relative mr-3">
          <div className="w-8 h-8  flex items-center justify-cente">
            <img
              className="h-8 w-8 object-contain"
              src={ICONLIST}
              alt=""
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 ml-1">
          <div className="text-sm font-normal text-gray-900 truncate dark:text-white">
            {item[devicePrimary]}
          </div>
          <span className='text-xs'>
          {secondaryText()}
          </span>
        </div>

        <div className="flex items-center">
          {position && (
            <>
              {position.attributes.hasOwnProperty('alarm') && (
                <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                  <div className="p-1">
                    <ErrorIcon fontSize="small" className="text-red-500 w-4 h-4" />
                  </div>
                </Tooltip>
              )}
              {position.attributes.hasOwnProperty('ignition') && (
                <Tooltip title={`${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`}>
                  <div className="p-1">
                    <EngineIcon
                      width={18}
                      height={18}
                      className={position.attributes.ignition ? 'text-[#24B467]' : 'text-gray-400'}
                    />
                  </div>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceRow;
